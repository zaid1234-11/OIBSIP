import Razorpay from 'razorpay';
import env from './env.js';

export const isMock = !env.razorpay.keyId || 
                       env.razorpay.keyId.includes('placeholder') || 
                       env.razorpay.keyId === '';

let razorpayInstance = null;

if (!isMock) {
  try {
    razorpayInstance = new Razorpay({
      key_id: env.razorpay.keyId,
      key_secret: env.razorpay.keySecret
    });
    console.log('[Razorpay] Initialized with key:', env.razorpay.keyId);
  } catch (err) {
    console.error('[Razorpay Init Error]:', err);
  }
} else {
  console.log('[Razorpay] Running in simulated MOCK Mode.');
}

export const razorpay = razorpayInstance;
export default {
  razorpay,
  isMock
};
