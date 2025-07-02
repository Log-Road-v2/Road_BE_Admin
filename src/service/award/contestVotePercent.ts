import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { ContestParams } from '../../types/contest';
import { ContestVotePercentResponse } from '../../types/award';
import { prisma } from '../../config/prisma';

export const contestVotePercentHandler: RequestHandler<
  ContestParams,
  ContestVotePercentResponse | BasicResponse
> = async (req, res) => {
  await contestVotePercent(req, res);
};

const contestVotePercent = async (
  req: Request<ContestParams, ContestVotePercentResponse | BasicResponse>,
  res: Response<ContestVotePercentResponse | BasicResponse>
) => {
  try {
    const contestId = BigInt(req.params.contestId);
    const contestProjects = await prisma.project.findMany({
      select: { id: true },
      where: { contestId: contestId }
    });
    const projectIdList = contestProjects.map((p) => p.id);
    if (projectIdList.length === 0) {
      return res.status(404).json({
        message: '해당 대회에 등록된 프로젝트가 없습니다'
      });
    }

    const votedUsers = await prisma.vote.findMany({
      select: { userId: true },
      where: { projectId: { in: projectIdList } },
      distinct: ['userId']
    });
    const votedUserIdList = votedUsers.map((v) => v.userId);

    const allUser = await prisma.user.findMany({
      select: { id: true }
    });

    const voteRate = Number((votedUserIdList.length / allUser.length) * 100).toFixed(1);

    return res.status(200).json({
      totalPercent: voteRate
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
