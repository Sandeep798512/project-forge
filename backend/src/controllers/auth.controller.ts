import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/passwords';
import { generateToken } from '../utils/jwt';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator';
import { AuthRequest } from '../middlewares/auth.middleware';

const generateReferralCode = (name: string): string => {
  const prefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase() || 'FORGE';
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${randomStr}`;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, errors: parseResult.error.flatten().fieldErrors });
      return;
    }

    const { name, email, password, referralCode } = parseResult.data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const userReferralCode = generateReferralCode(name);

    // If first user, make admin, otherwise user
    const totalUsers = await User.countDocuments();
    const role = totalUsers === 0 ? 'admin' : 'user';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      isVerified: true, // Auto-verified for smooth developer experience
      referralCode: userReferralCode,
      referredBy: referralCode,
      acceptedTermsAt: new Date(),
      acceptedTermsVersion: '2026-09-10',
    });

    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        referralCode: user.referralCode,
      },
    });
  } catch (error: any) {
    console.error('[AUTH REGISTER ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, errors: parseResult.error.flatten().fieldErrors });
      return;
    }

    const { email, password } = parseResult.data;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        referralCode: user.referralCode,
      },
    });
  } catch (error: any) {
    console.error('[AUTH LOGIN ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving user profile.' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = forgotPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, errors: parseResult.error.flatten().fieldErrors });
      return;
    }

    const { email } = parseResult.data;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't leak user existence
      res.status(200).json({ success: true, message: 'If that email exists in our records, a reset token has been issued.' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully.',
      ...(process.env.NODE_ENV === 'development' ? { resetToken } : {}),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error processing forgot password request.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, errors: parseResult.error.flatten().fieldErrors });
      return;
    }

    const { token, newPassword } = parseResult.data;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
      return;
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully! You can now log in.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error resetting password.' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const userId = req.user.id;
    const user = await User.findById(userId).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User account not found.' });
      return;
    }

    const { password } = req.body;
    if (password && user.password) {
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Incorrect password. Account deletion canceled.' });
        return;
      }
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully.',
    });
  } catch (error: any) {
    console.error('[AUTH DELETE ACCOUNT ERROR]', error);
    res.status(500).json({ success: false, message: 'Server error during account deletion.' });
  }
};
