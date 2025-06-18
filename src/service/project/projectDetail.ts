import { AuthenticatedRequest, BasicResponse } from '../../types';
import { Response } from 'express';
import { ProjectDetailResponse } from '../../types/project';
import { prisma } from '../../config/prisma';

export const projectDetail = async (
  req: AuthenticatedRequest,
  res: Response<ProjectDetailResponse | BasicResponse>
) => {
  try {
    const projectId = BigInt(req.params.projectId);
    const project = await prisma.project.findUnique({
      select: {
        contest: {
          select: { name: true }
        },
        projectName: true,
        authorCategory: true,
        teamName: true,
        member: { select: { student: { select: { name: true } } } },
        skills: true,
        introduction: true,
        description: true,
        startDate: true,
        endDate: true,
        image: true,
        video: true,
        state: true
      },
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        message: '존재하지 않는 프로젝트'
      });
    }

    const members = project.member.map((m) => (m.student ? m.student.name : ''));
    const skills = project.skills ? project.skills?.split(',') : [];

    return res.status(200).json({
      contestName: project.contest.name,
      projectName: project.projectName,
      authorCategory: project.authorCategory,
      teamName: project.teamName,
      member: members,
      skills: skills,
      introduction: project.introduction || '',
      description: project.description || '',
      startDate: project.startDate,
      endDate: project.endDate,
      image: project.image,
      video: project.video,
      state: project.state
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
