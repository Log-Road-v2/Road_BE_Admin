import { BasicResponse } from '../../types';
import { Request, RequestHandler, Response } from 'express';
import { prisma } from '../../config/prisma';
import { StudentParams } from '../../types/student';

export const removeStudentHandler: RequestHandler<StudentParams, BasicResponse> = async (req, res) => {
  await removeStudent(req, res);
};

const removeStudent = async (req: Request<StudentParams, BasicResponse>, res: Response<BasicResponse>) => {
  try {
    const studentIdStr = req.params.studentId;
    if (!/^\d+$/.test(studentIdStr)) {
      return res.status(400).json({
        message: '유효하지 않은 사용자 ID'
      });
    }
    const studentId = BigInt(req.params.studentId);

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({
        message: '존재하지 않는 학생'
      });
    }

    await prisma.student.delete({ where: { id: studentId } });

    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
