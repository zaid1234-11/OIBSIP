import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const seedAdminUser = async () => {
  try {
    const adminEmail = 'admin@crustpizza.com';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const passwordHash = await bcrypt.hash('Admin@12345', 10);
      await User.create({
        name: 'CRUST Master Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isEmailVerified: true
      });
      console.log(`[Seed] Created default admin account: ${adminEmail} / Admin@12345`);
    }
  } catch (err) {
    console.warn(`[Seed notice]: ${err.message}`);
  }
};

export default seedAdminUser;
