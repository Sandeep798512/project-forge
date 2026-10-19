import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import Entitlement from '../models/Entitlement';
import AuditLog from '../models/AuditLog';
import PasswordResetAttempt from '../models/PasswordResetAttempt';
import LoginAttempt from '../models/LoginAttempt';
import { hashPassword, comparePassword } from '../utils/passwords';
import { generateToken } from '../utils/jwt';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendPasswordResetEmail, sendPasswordChangedConfirmationEmail } from '../utils/email.service';

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
    const cleanEmail = email.toLowerCase().trim();

    // Extract client IP safely
    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress =
      (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') ||
      (req.headers['cf-connecting-ip'] as string)?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const lockoutWindow = 15 * 60 * 1000; // 15-minute lockout window
    const windowStart = new Date(Date.now() - lockoutWindow);

    // 1. Check if this email is already locked out (5 or more failed attempts in the last 15 minutes)
    const failedAttemptsCount = await LoginAttempt.countDocuments({
      email: cleanEmail,
      createdAt: { $gte: windowStart },
    });

    if (failedAttemptsCount >= 5) {
      const latestAttempt = await LoginAttempt.findOne({
        email: cleanEmail,
        createdAt: { $gte: windowStart },
      }).sort({ createdAt: -1 });

      const elapsed = latestAttempt ? Date.now() - new Date(latestAttempt.createdAt).getTime() : 0;
      const remainingSeconds = Math.max(1, Math.ceil((lockoutWindow - elapsed) / 1000));
      const remainingMinutes = Math.ceil(remainingSeconds / 60);

      res.status(429).json({
        success: false,
        code: 'ACCOUNT_LOCKED',
        remainingSeconds,
        message: `Too many failed login attempts for this email address. For security, login is locked for ${remainingMinutes} minute(s). Please try again later or use 'Forgot Password'.`,
      });
      return;
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user || !user.password) {
      // Record failed attempt
      await LoginAttempt.create({ email: cleanEmail, ipAddress });
      const currentFailed = failedAttemptsCount + 1;
      const attemptsRemaining = Math.max(0, 5 - currentFailed);
      const message =
        attemptsRemaining > 0
          ? `Invalid email or password. You have ${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining before account lockout.`
          : 'Invalid email or password. Maximum 5 attempts reached. Your account has been temporarily locked for 15 minutes.';

      res.status(401).json({
        success: false,
        attemptsRemaining,
        message,
      });
      return;
    }

    if (user.isSuspended) {
      res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      // Record failed attempt
      await LoginAttempt.create({ email: cleanEmail, ipAddress });
      const currentFailed = failedAttemptsCount + 1;
      const attemptsRemaining = Math.max(0, 5 - currentFailed);
      const message =
        attemptsRemaining > 0
          ? `Invalid email or password. You have ${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining before account lockout.`
          : 'Invalid email or password. Maximum 5 attempts reached. Your account has been temporarily locked for 15 minutes.';

      res.status(401).json({
        success: false,
        attemptsRemaining,
        message,
      });
      return;
    }

    // Login successful: Clear failed login attempts for this email
    await LoginAttempt.deleteMany({ email: cleanEmail });

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
    const cleanEmail = email.toLowerCase().trim();

    // Extract client IP safely (supports proxies, reverse proxy headers, and local direct)
    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress =
      (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') ||
      (req.headers['cf-connecting-ip'] as string)?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const deviceId =
      (req.headers['x-device-id'] as string)?.trim() ||
      (parseResult.data.deviceId ? parseResult.data.deviceId.trim() : '') ||
      '';

    const sevenMinutesAgo = new Date(Date.now() - 7 * 60 * 1000);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 1. Rate Limit Check: Cooldown (1 bar send krne ke baad 7 minutes bad send kr sake)
    const recentEmailAttempt = await PasswordResetAttempt.findOne({
      email: cleanEmail,
      createdAt: { $gte: sevenMinutesAgo },
    }).sort({ createdAt: -1 });

    if (recentEmailAttempt) {
      const elapsedMs = Date.now() - new Date(recentEmailAttempt.createdAt).getTime();
      const cooldownMs = 7 * 60 * 1000;
      const remainingSeconds = Math.max(1, Math.ceil((cooldownMs - elapsedMs) / 1000));
      const remainingMinutes = Math.ceil(remainingSeconds / 60);

      res.status(429).json({
        success: false,
        code: 'COOLDOWN_ACTIVE',
        remainingSeconds,
        message: `Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} (${remainingSeconds}s) before requesting another reset link for this email. (Minimum 7-minute wait required between requests).`,
      });
      return;
    }

    // 2. Rate Limit Check: 24-hour limit per email (Maximum 2 attempts in 24 hours)
    const emailAttempts24h = await PasswordResetAttempt.countDocuments({
      email: cleanEmail,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (emailAttempts24h >= 2) {
      res.status(429).json({
        success: false,
        code: 'DAILY_EMAIL_LIMIT_REACHED',
        message: 'Daily password reset limit reached for this email address (maximum 2 requests per 24 hours). Please check your email inbox/spam or try again after 24 hours.',
      });
      return;
    }

    // 3. Rate Limit Check: Per Device / Network Distinct Email Limit (Maximum 3 different email accounts in 24 hours)
    const deviceConditions: any[] = [];
    if (deviceId) {
      deviceConditions.push({ deviceId });
    }
    if (ipAddress && ipAddress !== '127.0.0.1') {
      deviceConditions.push({ ipAddress });
    }
    if (deviceConditions.length === 0) {
      deviceConditions.push({ ipAddress });
    }

    const distinctEmailsFromDevice = await PasswordResetAttempt.distinct('email', {
      $or: deviceConditions,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (distinctEmailsFromDevice.length >= 3 && !distinctEmailsFromDevice.includes(cleanEmail)) {
      res.status(429).json({
        success: false,
        code: 'DEVICE_EMAIL_LIMIT_REACHED',
        message: 'Security limit reached: Maximum 3 different email accounts can request password resets from this device/network within 24 hours. Please wait 24 hours or contact support.',
      });
      return;
    }

    // 4. Rate Limit Check: Maximum total attempts from same device/network in 24 hours (Max 6 total attempts)
    const totalDeviceAttempts = await PasswordResetAttempt.countDocuments({
      $or: deviceConditions,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (totalDeviceAttempts >= 6) {
      res.status(429).json({
        success: false,
        code: 'DEVICE_TOTAL_LIMIT_REACHED',
        message: 'Security limit: Too many password reset requests from this device/network today. Please wait 24 hours before trying again.',
      });
      return;
    }

    // Log this attempt in MongoDB (will automatically expire after 24 hours via TTL index)
    await PasswordResetAttempt.create({
      email: cleanEmail,
      ipAddress,
      ...(deviceId ? { deviceId } : {}),
    });

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Don't leak user existence (Security Best Practice)
      res.status(200).json({
        success: true,
        message: 'If that email exists in our records, a password reset link has been sent.',
      });
      return;
    }

    // 1. Generate secure crypto reset token (32 bytes = 64 hex chars)
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
    await user.save();

    // 2. Resolve frontend client origin dynamically (Ensures real production link in emails)
    let clientUrl = '';
    const rawOrigin = req.headers.origin || req.headers.referer;
    if (rawOrigin) {
      try {
        const parsed = new URL(rawOrigin);
        if (parsed.protocol.startsWith('http') && !parsed.hostname.includes('localhost')) {
          clientUrl = parsed.origin;
        }
      } catch {}
    }

    if (!clientUrl && process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('localhost')) {
      clientUrl = process.env.CLIENT_URL;
    }

    // Default to official live production domain
    if (!clientUrl) {
      clientUrl = 'https://campusget.vercel.app';
    }

    const resetUrl = `${clientUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

    // 3. Dispatch email via Brevo API, Resend API, or SMTP
    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
      expiresInMinutes: 30,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email address.',
      emailDelivered: emailResult.success,
    });
  } catch (error: any) {
    console.error('[AUTH FORGOT PASSWORD ERROR]', error);
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
      res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link. Please request a new one.',
      });
      return;
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send confirmation email asynchronously (fire-and-forget)
    sendPasswordChangedConfirmationEmail({
      to: user.email,
      name: user.name,
    }).catch((err) => console.error('[CONFIRMATION EMAIL ERROR]', err));

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully! You can now log in.',
    });
  } catch (error: any) {
    console.error('[AUTH RESET PASSWORD ERROR]', error);
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

    // Revoke entitlements so download links immediately stop working
    await Entitlement.updateMany({ user: userId }, { isRevoked: true });
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

export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Both currentPassword and newPassword are required.' });
      return;
    }

    if (newPassword.length < 6 || newPassword.length > 50) {
      res.status(400).json({ success: false, message: 'New password must be between 6 and 50 characters long.' });
      return;
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user || !user.password) {
      res.status(404).json({ success: false, message: 'User account not found.' });
      return;
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Incorrect current password.' });
      return;
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    try {
      await AuditLog.create({
        user: req.user.id,
        action: 'PASSWORD_UPDATED',
        details: { userEmail: user.email },
      });
    } catch (auditErr) {
      // Audit log non-critical
    }

    res.status(200).json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (error: any) {
    console.error('[UPDATE PASSWORD ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to update password. Server error.' });
  }
};

