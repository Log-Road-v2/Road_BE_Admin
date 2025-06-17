import { AuthenticatedRequest, BasicResponse } from '../../types';
import { Response } from 'express';
import { ProjectListData, ProjectListResponse } from '../../types/project';
import { prisma, ProjectState } from '../../config/prisma';
import { parseEnvToInt } from '../../utils/parseEnv';

const PAGE_SIZE = parseEnvToInt(process.env.PROJECT_PAGE_SIZE, 20);

export const projectList = async (req: AuthenticatedRequest, res: Response<ProjectListResponse | BasicResponse>) => {
  try {
    const contestId = req.params.contestId;

    const state = (req.query.state as ProjectState | 'ALL') ?? 'ALL';
    const offset = Number(req.query.offset) || 1;

    if (!contestId || state === 'WRITING') {
      return res.status(400).json({
        message: '올바르지 않은 파라미터'
      });
    }

    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    if (!contest) {
      return res.status(404).json({
        message: '존재하지 않는 대회'
      });
    }

    const where = {
      contestId: contestId,
      ...(!state || state === 'ALL'
        ? { state: { in: [ProjectState.PENDING, ProjectState.APPROVAL, ProjectState.MODIFY, ProjectState.REJECTED] } }
        : { state: state })
    };

    const [projects, totalProjects] = await prisma.$transaction([
      prisma.project.findMany({
        select: {
          id: true,
          projectName: true,
          authorCategory: true,
          introduction: true,
          image: true
        },
        where: where,
        skip: PAGE_SIZE * Math.max(offset - 1, 0),
        take: PAGE_SIZE,
        orderBy: [{ projectName: 'asc' }]
      }),
      prisma.project.count({
        where: where
      })
    ]);

    const result: ProjectListData[] = projects.map((project) => ({
      ...project,
      id: project.id.toString(),
      introduction: project.introduction ?? '',
      image: project.image ?? ''
    }));

    return res.status(200).json({
      offset: offset || 1,
      totalProjects: totalProjects,
      projects: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
