import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { ContestParams, ContestRequest } from '../../types/contest';
import { prisma } from '../../config/prisma';

export const modifyContestHandler: RequestHandler<ContestParams, BasicResponse, ContestRequest> = async (req, res) => {
  await modifyContest(req, res);
};

const modifyContest = async (
  req: Request<ContestParams, BasicResponse, ContestRequest>,
  res: Response<BasicResponse>
) => {
  try {
    const contestId = BigInt(req.params.contestId);
    const { name, startDate, endDate, purpose, awards } = req.body;
    if (!name || !startDate || !endDate || !purpose || !awards || awards.length === 0) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    if (!contest) {
      return res.status(404).json({
        message: '존재하지 않는 대회'
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.contest.update({
        where: { id: contestId },
        data: {
          name: name,
          startDate: startDate,
          endDate: endDate,
          purpose: purpose
        }
      });
      await tx.award.deleteMany({
        where: { contestId: contestId }
      });
      await tx.award.createMany({
        data: awards.map((award) => ({
          name: award.name,
          awardCount: award.awardCount,
          contestId: contestId
        }))
      });
    });

    return res.status(200).json({
      message: '대회 정보 수정 완료'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
