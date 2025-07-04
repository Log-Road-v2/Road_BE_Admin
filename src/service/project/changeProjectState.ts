import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { ChangeProjectStateRequest, ProjectParams } from '../../types/project';
import { prisma, ProjectState } from '../../config/prisma';

export const changeProjectStateHandler: RequestHandler<
  ProjectParams,
  BasicResponse,
  ChangeProjectStateRequest
> = async (req, res) => {
  await changeProjectState(req, res);
};

const changeProjectState = async (
  req: Request<ProjectParams, BasicResponse, ChangeProjectStateRequest>,
  res: Response<BasicResponse>
) => {
  try {
    const projectId = BigInt(req.params.projectId);
    const { state, content } = req.body;
    if (!state) {
      return res.status(400).json({
        message: '유효하지 않은 입력값'
      });
    }

    const project = await prisma.project.findUnique({
      select: {
        id: true,
        state: true
      },
      where: { id: projectId }
    });
    if (!project) {
      return res.status(404).json({
        message: '존재하지 않는 프로젝트'
      });
    }

    await prisma.$transaction(async (tx) => {
      if (project.state === ProjectState.REJECTED && state !== ProjectState.REJECTED) {
        await tx.feedback.delete({
          where: { projectId: project.id }
        });
      } else if (project.state === ProjectState.REJECTED && state === ProjectState.REJECTED) {
        await tx.feedback.update({
          where: { projectId: project.id },
          data: { content: content || '' }
        });
      } else if (state === ProjectState.REJECTED) {
        await tx.feedback.create({
          data: {
            projectId: project.id,
            content: content || ''
          }
        });
      }
      await tx.project.update({
        where: { id: project.id },
        data: {
          state: state
        }
      });
    });

    return res.status(200).json({
      message: `프로젝트 상태 변경 완료`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
