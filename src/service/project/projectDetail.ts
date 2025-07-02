import { BasicResponse } from '../../types';
import { Request, RequestHandler, Response } from 'express';
import { ProjectDetailResponse, ProjectParams } from '../../types/project';
import { prisma } from '../../config/prisma';

const IMAGE_SERVER_URL = process.env.IMAGE_SERVER_URL;
if (!IMAGE_SERVER_URL) {
  throw Error('image server url get failed from env');
}

export const projectDetailHandler: RequestHandler<ProjectParams, ProjectDetailResponse | BasicResponse> = async (
  req,
  res
) => {
  await projectDetail(req, res);
};

const projectDetail = async (
  req: Request<ProjectParams, ProjectDetailResponse | BasicResponse>,
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
      image: project.image ? `${IMAGE_SERVER_URL}${project.image}` : null,
      video: project.video ? `${IMAGE_SERVER_URL}${project.video}` : null,
      state: project.state
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
