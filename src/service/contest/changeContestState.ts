import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { ChangeContestStateRequest, ContestParams } from '../../types/contest';
import { prisma } from '../../config/prisma';

export const changeContestStateHandler: RequestHandler<
  ContestParams,
  BasicResponse,
  ChangeContestStateRequest
> = async (req, res) => {
  await changeContestState(req, res);
};

const changeContestState = async (
  req: Request<ContestParams, BasicResponse, ChangeContestStateRequest>,
  res: Response<BasicResponse>
) => {
  try {
    const contestId = BigInt(req.params.contestId);
    const state = req.body.state;
    if (!contestId || !state) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    const contest = await prisma.contest.findUnique({
      select: { id: true },
      where: { id: contestId }
    });
    if (!contest) {
      return res.status(404).json({
        message: '존재하지 않는 대회'
      });
    }

    await prisma.contest.update({
      where: { id: contestId },
      data: { state: state }
    });

    return res.status(200).json({
      message: '대회 상태 변경 완료'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
