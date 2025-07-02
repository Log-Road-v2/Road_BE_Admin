import { NextFunction, Request, Response } from 'express';
import { BasicResponse } from '../types';
import { prisma } from '../config/prisma';

export const validateContestId = async (req: Request, res: Response<BasicResponse>, next: NextFunction) => {
  try {
    const contestId = BigInt(req.params.contestId);
    if (!contestId) {
      res.status(400).json({
        message: '올바르지 않은 파라미터'
      });
      return;
    }
    const contest = await prisma.contest.findUnique({
      select: { id: true },
      where: { id: contestId }
    });
    if (!contest) {
      res.status(404).json({
        message: '존재하지 않는 대회'
      });
      return;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: '올바르지 않은 파라미터'
    });
    return;
  }
};
