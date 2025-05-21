import { AuthenticatedRequest, BasicResponse } from '../../types';
import { Response } from 'express';
import { prisma } from '../../config/prisma';

export const modifyStudent = async (req: AuthenticatedRequest, res: Response<BasicResponse>) => {
  try {
    const studentId = Number(req.params.studentId);
    if (isNaN(studentId)) {
      return res.status(400).json({
        message: '유효하지 않은 학생 ID'
      });
    }

    const { state, name, generation, grade, classNumber, studentNumber } = req.body;
    if (!state || !name || !generation || !grade || !classNumber || !studentNumber) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    const numGeneration = Number(generation);
    const numGrade = Number(grade);
    const numClassNumber = Number(classNumber);
    const numStudentNumber = Number(studentNumber);
    if (isNaN(numGeneration) || numGeneration < 1) {
      return res.status(400).json({
        message: '기수는 양수여야 합니다'
      });
    }
    if (isNaN(numGrade) || numGrade < 1 || numGrade > 3) {
      return res.status(400).json({
        message: '학년은 1 ~ 3 사이여야 합니다'
      });
    }
    if (isNaN(numClassNumber) || numClassNumber < 1 || numClassNumber > 4) {
      return res.status(400).json({
        message: '반은 1 ~ 4 사이여야 합니다'
      });
    }
    if (isNaN(numStudentNumber) || numStudentNumber < 1) {
      return res.status(400).json({
        message: '번호는 양수여야 합니다'
      });
    }

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({
        message: '존재하지 않는 학생'
      });
    }

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
