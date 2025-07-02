import { Request, RequestHandler, Response } from 'express';
import { WaitContestListData, WaitContestListReponse } from '../../types/award';
import { BasicResponse } from '../../types';
import { prisma } from '../../config/prisma';

export const waitContestListHandler: RequestHandler = async (req, res) => {
  await waitContestList(req, res);
};

const waitContestList = async (req: Request, res: Response<WaitContestListReponse | BasicResponse>) => {
  try {
    const contests = await prisma.contest.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        award: {
          select: {
            id: true,
            name: true,
            awardCount: true
          }
        }
      },
      where: { state: 'PENDING' }
    });

    const result: WaitContestListData[] = contests.map((contest) => ({
      id: contest.id.toString(),
      name: contest.name,
      startDate: contest.startDate,
      endDate: contest.endDate,
      awards: contest.award.map((a) => ({
        id: a.id.toString(),
        name: a.name,
        awardCount: a.awardCount
      }))
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
