import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { ContestListData, ContestListResponse } from '../../types/contest';
import { prisma } from '../../config/prisma';
import { formatDate } from '../../utils/format';

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
      id: contest.id.toString(),
      name: contest.name,
      startDate: formatDate(contest.startDate),
      endDate: formatDate(contest.endDate),
      state: contest.state
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
