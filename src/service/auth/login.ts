import { prisma, Role } from '../../config/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import redis from '../../config/redis';
import crypto from 'crypto';
import { LoginRequest, TokenResponse } from '../../types/auth';
import { BasicResponse, REDIS_KEY } from '../../types';
import { generateToken } from '../../utils/jwt';
import { parseEnvToInt } from '../../utils/parseEnv';

const ACCESS_EXPIRY_SECOND = parseEnvToInt(process.env.ACCESS_TOKEN_EXPIRY_SECOND, 3600);
const REFRESH_EXPIRY_SECOND = parseEnvToInt(process.env.REFRESH_TOKEN_EXPIRY_SECOND, 604800);

export const login = async (
  req: Request<Record<string, never>, TokenResponse | BasicResponse, LoginRequest>,
  res: Response<TokenResponse | BasicResponse>
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: '올바르지 않은 입력값'
    });
  }

  try {
    const thisUser = await prisma.user.findUnique({ where: { email } });
    if (!thisUser) {
      return res.status(404).json({
        message: '존재하지 않는 이메일'
      });
    }
    if (!(await bcrypt.compare(password, thisUser.password))) {
      return res.status(409).json({
        message: '비밀번호 불일치'
      });
    }
    if (thisUser.role !== Role.ADMIN) {
      return res.status(403).json({
        message: '접근 권한 없음'
      });
    }

    const accessToken = generateToken(thisUser.id.toString(), crypto.randomUUID(), true);
    const refreshToken = generateToken(crypto.randomUUID(), thisUser.id.toString(), false);

    await redis.set(`${REDIS_KEY.ACCESS_TOKEN} ${thisUser.id}`, accessToken, 'EX', ACCESS_EXPIRY_SECOND);
    await redis.set(`${REDIS_KEY.REFRESH_TOKEN} ${thisUser.id}`, refreshToken, 'EX', REFRESH_EXPIRY_SECOND);

    return res.status(200).json({
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
