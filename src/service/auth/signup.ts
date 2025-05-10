import { prisma, Role } from '../../config/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { SignUpRequest } from '../../types/auth';

export const signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response) => {
  const { role, email, password, name } = req.body;

  if (!role || !email || !password || !name) {
    return res.status(400).json({
      message: '올바르지 않은 입력값'
    });
  }
  if (role !== Role.ADMIN) {
    return res.status(403).json({
      message: '로그인 권한 없음'
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
    await prisma.user.create({
      data: {
        email: email,
        password: hash,
        name: name,
        role: role
      }
    });
    return res.status(201).json({
      message: '회원가입 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
