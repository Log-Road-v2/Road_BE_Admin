import { NextFunction, Response } from 'express';
import { prisma, Role } from '../config/prisma';
import { BasicResponse, AuthenticatedRequest } from '../types';

export const checkRight = async (req: AuthenticatedRequest, res: Response<BasicResponse>, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({
        message: '토큰 검증 실패'
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({
        message: '존재하지 않는 사용자'
      });
      return;
    }
    if (user.role !== Role.ADMIN) {
      res.status(403).json({
        message: '권한 없음'
      });
      return;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: '서버 오류 발생'
    });
    return;
  }
};
