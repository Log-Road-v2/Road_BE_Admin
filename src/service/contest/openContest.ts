import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { ContestRequest } from '../../types/contest';
import { prisma } from '../../config/prisma';

export const openContestHandler: RequestHandler<unknown, BasicResponse, ContestRequest> = async (req, res) => {
  await openContest(req, res);
};

const openContest = async (req: Request<unknown, BasicResponse, ContestRequest>, res: Response<BasicResponse>) => {
  try {
    const { name, startDate, endDate, purpose, award } = req.body;
    if (!name || !startDate || !endDate || !purpose || !award || award.length === 0) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    await prisma.$transaction(async (tx) => {
      const contest = await tx.contest.create({
        data: {
          name: name,
          startDate: startDate,
          endDate: endDate,
          purpose: purpose
        }
      });
      await tx.award.createMany({
        data: award.map((a) => ({
          name: a.name,
          awardCount: a.awardCount,
          contestId: contest.id
        }))
      });
    });

    return res.status(201).json({
      message: '대회 개최 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
