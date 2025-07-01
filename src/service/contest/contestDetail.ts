import { Request, RequestHandler, Response } from 'express';
import { ContestDetailResponse, ContestParams } from '../../types/contest';
import { BasicResponse } from '../../types';
import { prisma } from '../../config/prisma';

export const contestDetailHandler: RequestHandler<ContestParams, ContestDetailResponse | BasicResponse> = async (
  req,
  res
) => {
  await contestDetail(req, res);
};

const contestDetail = async (
  req: Request<ContestParams, ContestDetailResponse | BasicResponse>,
  res: Response<ContestDetailResponse | BasicResponse>
) => {
  try {
    const contestId = BigInt(req.params.contestId);
    const contest = await prisma.contest.findUnique({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        purpose: true,
        award: { select: { name: true } }
      },
      where: { id: contestId }
    });

    if (!contest) {
      return res.status(404).json({
        message: '존재하지 않는 대회'
      });
    }

    return res.status(200).json({
      ...contest,
      id: contest.id.toString(),
      purpose: contest.purpose || ''
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
