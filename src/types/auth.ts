import { Request } from 'express';
import { Role } from '../config/prisma';

export interface SignUpRequest {
  role: Role;
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedRequest extends Request {
  payload?: PayloadData;
}

export interface PayloadData {
  id: string;
  type: 'access' | 'refresh';
  iat: number;
}
