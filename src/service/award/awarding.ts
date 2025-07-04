import { Request, RequestHandler, Response } from 'express';
import { BasicResponse } from '../../types';
import { ContestParams } from '../../types/contest';
import { AwardingRequest } from '../../types/award';
import { prisma } from '../../config/prisma';

export const awardingHandler: RequestHandler<ContestParams, BasicResponse, AwardingRequest> = async (req, res) => {
  await awarding(req, res);
};

const awarding = async (req: Request<ContestParams, BasicResponse, AwardingRequest>, res: Response<BasicResponse>) => {
  try {
    const { awards } = req.body;
    if (!awards) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }
    const awardData: { awardId: bigint; projectId: bigint }[] = awards.flatMap((award) =>
      award.projects.map((projectId) => ({
        awardId: BigInt(award.id),
        projectId: BigInt(projectId)
      }))
    );
    await prisma.awardProject.createMany({
      data: awardData,
      skipDuplicates: true
    });

    return res.status(200).json({
      message: '시상 완료'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
