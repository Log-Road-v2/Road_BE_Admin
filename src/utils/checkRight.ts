import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { prisma, Role } from '../config/prisma';

export const checkRight = async (req: AuthenticatedRequest<{}, {}, {}>, res: Response) => {
  const payload = req.payload;

  if (!payload) {
    return res.status(400).json({
      message: '토큰 검증 실패'
    });
  }
  if (payload.type !== 'access') {
    return res.status(400).json({
      message: '유효하지 않은 토큰'
    });
  }
  const userId = Number(payload.id);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({
      message: '존재하지 않는 사용지'
    });
  }
  if (user.role !== Role.ADMIN) {
    return res.status(403).json({
      message: '권한 없음'
    });
  }
  return true;
};
