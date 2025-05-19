import { Response } from 'express';
import { prisma } from '../../config/prisma';
import { AuthenticatedRequest } from '../../types/auth';
import { BasicResponse } from '../../types';
import { SearchStudentQuery, SearchStudentResponse } from '../../types/student';

export const searchStudents = async (req: AuthenticatedRequest<{}, SearchStudentQuery, {}>, res: Response<SearchStudentResponse | BasicResponse>) => {
  const pageSize = 10;

  try {
    const { grade, classNumber, keyword, offset } = req.query;
    const where = keyword
      ? /^\d{1,4}$/.test(keyword.toString())
        ? {
            grade: keyword[0],
            ...(keyword[1] && { classNumber: keyword[1] }),
            ...(keyword.slice(2) && { studentNumber: { startsWith: keyword.slice(2) } })
          }
        : { name: { contains: keyword } }
      : {
          ...(grade && { grade: grade }),
          ...(classNumber && { classNumber: classNumber })
        };

    const [students, totalStudents] = await prisma.$transaction([
      prisma.student.findMany({
        select: {
          id: true,
          generation: true,
          grade: true,
          classNumber: true,
          studentNumber: true,
          name: true,
          state: true
        },
        where: where,
        skip: pageSize * Math.max(Number(offset || 0) - 1, 0),
        take: pageSize,
        orderBy: [{ grade: 'asc' }, { classNumber: 'asc' }, { studentNumber: 'asc' }, { name: 'asc' }]
      }),
      prisma.student.count({
        where: where
      })
    ]);
    return res.status(200).json({
      offset: offset || 1,
      totalStudent: totalStudents,
      students: students
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
