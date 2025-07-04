import { NextFunction, Request, Response } from 'express';
import { BasicResponse } from '../types';
import { prisma } from '../config/prisma';

const createEntityValidate = (paramName: string, prismaModel: any, notFoundMessage: string) => {
  return async (req: Request, res: Response<BasicResponse>, next: NextFunction) => {
    try {
      const entityId = BigInt(req.params[paramName]);
      if (!entityId || entityId < 0) {
        res.status(400).json({
          message: '올바르지 않은 파라미터'
        });
        return;
      }

      const entity = await prismaModel.findUnique({
        select: { id: true },
        where: { id: entityId }
      });
      if (!entity) {
        res.status(404).json({
          message: notFoundMessage
        });
        return;
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(400).json({
        message: '올바르지 않은 파라미터'
      });
      return;
    }
  };
};

export const validateContestId = createEntityValidate('contestId', prisma.contest, '존재하지 않는 대회');

export const validateProjectId = createEntityValidate('projectId', prisma.project, '존재하지 않는 프로젝트');

export const validateStudentId = createEntityValidate('studentId', prisma.student, '존재하지 않는 학생');
