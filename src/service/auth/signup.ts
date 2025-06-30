import { prisma, Role } from '../../config/prisma';
import { Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcrypt';
import { SignUpRequest, TokenResponse } from '../../types/auth';
import { generateToken } from '../../utils/jwt';
import crypto from 'crypto';
import redis from '../../config/redis';
import { BasicResponse, REDIS_KEY } from '../../types';
import { parseEnvToInt } from '../../utils/parseEnv';

const ACCESS_EXPIRY_SECOND = parseEnvToInt(process.env.ACCESS_TOKEN_EXPIRY_SECOND, 3600);
const REFRESH_EXPIRY_SECOND = parseEnvToInt(process.env.REFRESH_TOKEN_EXPIRY_SECOND, 604800);

export const signUpHandler: RequestHandler<unknown, TokenResponse | BasicResponse, SignUpRequest> = (req, res) => {
  signUp(req, res);
};

const signUp = async (
  req: Request<unknown, TokenResponse | BasicResponse, SignUpRequest>,
  res: Response<TokenResponse | BasicResponse>
) => {
  const { role, email, password, name } = req.body;

  if (!role || !email || !password || !name) {
    return res.status(400).json({
      message: '올바르지 않은 입력값'
    });
  }
  if (role !== Role.ADMIN) {
    return res.status(403).json({
      message: '회원가입 권한 없음'
    });
  }
  try {
    const existUser = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
    if (existUser) {
      return res.status(409).json({
        message: '이미 어드민 계정이 가입됨'
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hash,
        name: name,
        role: role
      }
    });

    const accessToken = generateToken(user.id.toString(), crypto.randomUUID(), true);
    const refreshToken = generateToken(crypto.randomUUID(), user.id.toString(), false);

    await redis.set(`${REDIS_KEY.ACCESS_TOKEN}:${user.id}`, accessToken, 'EX', ACCESS_EXPIRY_SECOND);
    await redis.set(`${REDIS_KEY.REFRESH_TOKEN}:${user.id}`, refreshToken, 'EX', REFRESH_EXPIRY_SECOND);

    return res.status(201).json({
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
