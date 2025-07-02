import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { NonVoteListData, NonVoteListResponse } from '../../types/award';
import { ContestParams } from '../../types/contest';
import { prisma } from '../../config/prisma';

export const nonVoteListHandler: RequestHandler<ContestParams, NonVoteListResponse | BasicResponse> = async (
  req,
  res
) => {
  await nonVoteList(req, res);
};

const nonVoteList = async (
  req: Request<ContestParams, NonVoteListResponse | BasicResponse>,
  res: Response<NonVoteListResponse | BasicResponse>
) => {
  try {
    const contestId = BigInt(req.params.contestId);

    const contestProjects = await prisma.project.findMany({
      select: { id: true },
      where: { contestId: contestId }
    });
    if (contestProjects.length === 0) {
      return res.status(404).json({
        message: '해당 대회에 등록된 프로젝트가 없습니다'
      });
    }

    const projectIdList = contestProjects.map((p) => p.id);

    const nonVoteUsers = await prisma.user.findMany({
      select: {
        name: true,
        student: {
          select: {
            grade: true,
            classNumber: true,
            studentNumber: true
          }
        }
      },
      where: {
        vote: {
          none: {
            projectId: { in: projectIdList }
          }
        }
      }
    });

    const result: NonVoteListData[] = nonVoteUsers.map((user) => ({
      name: user.name,
      grade: user.student ? user.student.grade : null,
      classNumber: user.student ? user.student.classNumber : null,
      studentNumber: user.student ? user.student.studentNumber : null
    }));

    return res.status(200).json({
      nonVotes: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
