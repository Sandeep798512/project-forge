export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  referralCode?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  resetToken?: string;
  user?: User;
  errors?: Record<string, string[]>;
}
