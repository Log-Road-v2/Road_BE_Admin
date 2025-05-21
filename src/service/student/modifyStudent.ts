import { BasicResponse } from '../../types';
import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';

export const modifyStudent = async (req: Request, res: Response<BasicResponse>) => {
  try {
    const studentId = Number(req.params.studentId);
    const { state, name, generation, grade, classNumber, studentNumber } = req.body;

    if (!state || !name || !generation || !grade || !classNumber || !studentNumber) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
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
