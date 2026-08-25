import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import EmailVerificationToken from '../models/EmailVerificationToken.js';
import PasswordResetToken from '../models/PasswordResetToken.js';

// Helper to generate a signed JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'customer',
      isEmailVerified: false
    });

    // Generate email verification token (32 bytes hex)
    const verificationRawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(verificationRawToken).digest('hex');

    await EmailVerificationToken.create({
      user: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    const verificationLink = `${env.clientUrl}/verify-email?token=${verificationRawToken}`;
    console.log(`\n======================================================`);
    console.log(`[EMAIL DISPATCH] Verification email for: ${user.email}`);
    console.log(`[EMAIL LINK] ${verificationLink}`);
    console.log(`======================================================\n`);

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      token,
      verificationToken: verificationRawToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({ error: error.message || 'Registration failed.' });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({ error: error.message || 'Login failed.' });
  }
};

// POST /api/admin/auth/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    // Strict role check for admin endpoint
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin role required.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('[Admin Login Error]:', error);
    return res.status(500).json({ error: error.message || 'Admin login failed.' });
  }
};

// POST /api/auth/verify-email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const record = await EmailVerificationToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() }
    });

    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    const user = await User.findById(record.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.isEmailVerified = true;
    await user.save();

    // Clean up used token
    await EmailVerificationToken.deleteMany({ user: user._id });

    return res.status(200).json({
      message: 'Email verified successfully.',
      isEmailVerified: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true
      }
    });
  } catch (error) {
    console.error('[Verify Email Error]:', error);
    return res.status(500).json({ error: error.message || 'Email verification failed.' });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Do not reveal user non-existence to avoid email enumeration
      return res.status(200).json({
        message: 'If an account exists with that email, a password reset link has been generated.'
      });
    }

    // Clean up existing reset tokens for this user
    await PasswordResetToken.deleteMany({ user: user._id });

    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawResetToken).digest('hex');

    await PasswordResetToken.create({
      user: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    const resetLink = `${env.clientUrl}/reset-password?token=${rawResetToken}`;
    console.log(`\n======================================================`);
    console.log(`[PASSWORD RESET] Link for: ${user.email}`);
    console.log(`[RESET LINK] ${resetLink}`);
    console.log(`======================================================\n`);

    return res.status(200).json({
      message: 'If an account exists with that email, a password reset link has been generated.',
      resetToken: rawResetToken
    });
  } catch (error) {
    console.error('[Forgot Password Error]:', error);
    return res.status(500).json({ error: error.message || 'Password reset request failed.' });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const record = await PasswordResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() }
    });

    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired password reset token.' });
    }

    const user = await User.findById(record.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Clean up reset token
    await PasswordResetToken.deleteMany({ user: user._id });

    return res.status(200).json({
      message: 'Password reset successful. You can now sign in with your new password.'
    });
  } catch (error) {
    console.error('[Reset Password Error]:', error);
    return res.status(500).json({ error: error.message || 'Password reset failed.' });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        addresses: user.addresses || []
      }
    });
  } catch (error) {
    console.error('[GetMe Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch user profile.' });
  }
};

export default {
  register,
  login,
  adminLogin,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe
};
