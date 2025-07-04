import { BasicResponse } from '../../types';
import { Request, RequestHandler, Response } from 'express';
import { prisma, StudentState } from '../../config/prisma';
import { StudentParams, ModifyStudentRequest } from '../../types/student';

export const modifyStudentHandler: RequestHandler<StudentParams, BasicResponse, ModifyStudentRequest> = async (
  req,
  res
) => {
  await modifyStudent(req, res);
};

const modifyStudent = async (
  req: Request<StudentParams, BasicResponse, ModifyStudentRequest>,
  res: Response<BasicResponse>
) => {
  try {
    const studentId = BigInt(req.params.studentId);

    const { state, name, generation, grade, classNumber, studentNumber } = req.body;
    if (!state || !name || !generation || !grade || !classNumber || !studentNumber) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    if (isNaN(generation) || generation < 1) {
      return res.status(400).json({
        message: '기수는 양수여야 합니다'
      });
    }
    if (isNaN(grade) || grade < 1 || grade > 3) {
      return res.status(400).json({
        message: '학년은 1 ~ 3 사이여야 합니다'
      });
    }
    if (isNaN(classNumber) || classNumber < 1 || classNumber > 4) {
      return res.status(400).json({
        message: '반은 1 ~ 4 사이여야 합니다'
      });
    }
    if (isNaN(studentNumber) || studentNumber < 1) {
      return res.status(400).json({
        message: '번호는 양수여야 합니다'
      });
    }

    if (state === StudentState.SCHOOL) {
      await prisma.student.update({
        where: { id: studentId },
        data: {
          state: state,
          name: name,
          generation: generation,
          grade: grade,
          classNumber: classNumber,
          studentNumber: studentNumber
        }
      });
    } else {
      await prisma.student.update({
        where: { id: studentId },
        data: {
          state: state,
          name: name,
          grade: null,
          classNumber: null,
          studentNumber: null
        }
      });
    }

    return res.status(200).json({
      message: '학생 정보 수정 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
