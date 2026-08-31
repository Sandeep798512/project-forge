import api from './api';
import { AuthResponse } from '../types/auth';

export const authService = {
  register: async (payload: { name: string; email: string; password: string; referralCode?: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  login: async (payload: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  getMe: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (payload: { token: string; newPassword: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/reset-password', payload);
    return response.data;
  },
};
