import { Response } from 'express';
import redis from '../../config/redis';
import { AuthenticatedRequest } from '../../types/auth';
import { BasicResponse } from '../../types';

export const logout = async (req: AuthenticatedRequest, res: Response<BasicResponse>) => {
  try {
    const payload = req.payload;
    if (!payload) {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }
    const userId = payload.id;
    const keys = await redis.keys('refresh *');
    for (const key of keys) {
      const storedUserId = await redis.get(key);
      if (storedUserId === userId) {
        await redis.del(key);
        break;
      }
    }
    await redis.del(userId);

    return res.status(200).json({
      message: '로그아웃 완료'
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: '로그아웃 실패'
    });
  }
};
