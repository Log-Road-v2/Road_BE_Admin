import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { ProjectVotePercentData, ProjectVotePercentQuery, ProjectVotePercentResponse } from '../../types/award';
import { ContestParams } from '../../types/contest';
import { prisma, Role } from '../../config/prisma';
import { parseEnvToInt } from '../../utils/parseEnv';
import { buildFileUrl } from '../../utils/buildFileUrl';

const PAGE_SIZE = parseEnvToInt(process.env.AWARD_PAGE_SIZE, 10);

export const projectVotePercentHandler: RequestHandler<
  ContestParams,
  ProjectVotePercentResponse | BasicResponse,
  unknown,
  ProjectVotePercentQuery
> = async (req, res) => {
  await projectVotePercent(req, res);
};

const projectVotePercent = async (
  req: Request<ContestParams, ProjectVotePercentResponse | BasicResponse, unknown, ProjectVotePercentQuery>,
  res: Response<ProjectVotePercentResponse | BasicResponse>
) => {
  try {
    const contestId = BigInt(req.params.contestId);
    const orderBy = req.query.orderBy;
    const offset = parseInt(req.query.offset ?? '1');

    const where = { contestId: contestId };

    const [projects, totalProjects] = await prisma.$transaction([
      prisma.project.findMany({
        select: {
          id: true,
          projectName: true,
          introduction: true,
          image: true,
          vote: { select: { user: { select: { role: true } } } }
        },
        where: where,
        skip: PAGE_SIZE * Math.max(offset - 1, 0),
        take: PAGE_SIZE,
        orderBy: orderBy === 'UPLOAD' ? { id: 'asc' } : { vote: { _count: 'desc' } }
      }),
      prisma.project.count({
        where: where
      })
    ]);

    const totalStudentVote = projects.reduce(
      (acc, project) => acc + project.vote.filter((v) => v.user.role === Role.STUDENT).length,
      0
    );
    const totalTeacherVote = projects.reduce(
      (acc, project) => acc + project.vote.filter((v) => v.user.role === Role.TEACHER).length,
      0
    );

    const projectList: ProjectVotePercentData[] = projects.map((project) => {
      const studentVote = project.vote.filter((v) => v.user.role === Role.STUDENT).length;
      const teacherVote = project.vote.filter((v) => v.user.role === Role.TEACHER).length;

      return {
        id: project.id.toString(),
        projectName: project.projectName,
        introduction: project.introduction || '',
        image: buildFileUrl(project.image),
        studentPercent: totalStudentVote > 0 ? Number((studentVote / totalStudentVote) * 100) : 0.0,
        teacherPercent: totalTeacherVote > 0 ? Number((teacherVote / totalTeacherVote) * 100) : 0.0
      };
    });

    return res.status(200).json({
      offset: offset,
      totalProjects: totalProjects,
      projects: projectList
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
