import { Request } from 'express';
import { Role } from '../config/prisma';
import { ParsedQs } from 'qs';

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

export interface AuthenticatedRequest<Params = Record<string, never>, Query = ParsedQs, Body = Record<string, never>>
  extends Request<Params, any, Body, Query> {
  payload?: PayloadData;
}

export interface PayloadData {
  id: string;
  sub: string;
  type: 'access' | 'refresh';
  iat: number;
}
