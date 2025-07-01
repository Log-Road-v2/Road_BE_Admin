import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { ContestListData, ContestListResponse } from '../../types/contest';
import { prisma } from '../../config/prisma';

export const contestListHandler: RequestHandler = async (req, res) => {
  await contestList(req, res);
};

const contestList = async (req: Request, res: Response<ContestListResponse | BasicResponse>) => {
  try {
    const contests = await prisma.contest.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        state: true
      }
    });

    const result: ContestListData[] = contests.map((contest) => ({
      ...contest,
      id: contest.id.toString()
    }));

    return res.status(200).json({
      contests: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
