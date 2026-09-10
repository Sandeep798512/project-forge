import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import User, { RbacRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
    rbacRole: RbacRole;
    name: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const decoded: TokenPayload = verifyToken(token);
    const user = await User.findById(decoded.userId).select('name email role rbacRole isVerified isSuspended');

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
      return;
    }

    if (user.isSuspended) {
      res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
      return;
    }

    req.user = {
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      rbacRole: user.rbacRole || (user.role === 'admin' ? 'SUPER_ADMIN' : 'USER'),
      name: user.name,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Authentication failed. Invalid token.' });
  }
};

export const optionalAuthenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded: TokenPayload = verifyToken(token);
      const user = await User.findById(decoded.userId).select('name email role rbacRole isVerified isSuspended');

      if (user && !user.isSuspended) {
        req.user = {
          id: (user._id as any).toString(),
          email: user.email,
          role: user.role,
          rbacRole: user.rbacRole || (user.role === 'admin' ? 'SUPER_ADMIN' : 'USER'),
          name: user.name,
        };
      }
    }
  } catch (error) {
    // Silently continue for optional auth
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
    return;
  }
  next();
};

export const requireRbacRole = (allowedRoles: RbacRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    // SUPER_ADMIN has access to everything
    if (req.user.rbacRole === 'SUPER_ADMIN' || req.user.role === 'admin') {
      next();
      return;
    }

    if (!allowedRoles.includes(req.user.rbacRole)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};
