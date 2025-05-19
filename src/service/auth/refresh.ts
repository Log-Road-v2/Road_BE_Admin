import redis from '../../config/redis';
import { BasicResponse } from '../../types';
import { AuthenticatedRequest, TokenResponse } from '../../types/auth';
import { Response } from 'express';
import { generateToken } from '../../utils/jwt';

export const refresh = async (req: AuthenticatedRequest, res: Response<TokenResponse | BasicResponse>) => {
  try {
    const payload = req.payload;
    if (!payload) {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }
    if (payload.type !== 'refresh') {
      return res.status(400).json({
        message: 'refresh token이 아닙니다'
      });
    }
    const authorization = req.get('Authorization');
    if (!authorization) {
      return res.status(400).json({
        message: '확인할 수 없는 토큰'
      });
    }
    const token = authorization.split(' ')[1];
    const value = await redis.get(`refresh ${token}`);
    if (!value) {
      return res.status(400).json({
        message: '만료되었거나 확인할 수 없는 토큰'
      });
    }

    const accessToken = await generateToken(value, true);
    await redis.set(value, accessToken, 'EX', 3600);

    return res.status(200).json({
      accessToken: accessToken,
      refreshToken: token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};
