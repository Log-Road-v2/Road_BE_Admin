import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { ProjectParams } from '../../types/project';
import { prisma } from '../../config/prisma';

export const removeProjectHandler: RequestHandler<ProjectParams, BasicResponse> = async (req, res) => {
  await removeProject(req, res);
};

const removeProject = async (req: Request<ProjectParams, BasicResponse>, res: Response<BasicResponse>) => {
  try {
    const projectId = BigInt(req.params.projectId);

    await prisma.project.delete({ where: { id: projectId } });

    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
