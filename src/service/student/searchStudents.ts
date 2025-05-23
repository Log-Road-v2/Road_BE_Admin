import { Response } from 'express';
import { prisma } from '../../config/prisma';
import { BasicResponse, AuthenticatedRequest } from '../../types';
import { SearchStudentQuery, SearchStudentResponse } from '../../types/student';

export const searchStudents = async (
  req: AuthenticatedRequest<{}, BasicResponse, {}, SearchStudentQuery>,
  res: Response<SearchStudentResponse | BasicResponse>
) => {
  const pageSize = 10;

  try {
    const { grade, classNumber, keyword, offset } = req.query;

    const where = keyword
      ? /^\d{1,4}$/.test(keyword.toString())
        ? {
            grade: (() => {
              const gradeNum = Number(keyword[0]);
              return gradeNum >= 1 && gradeNum <= 3 ? gradeNum : undefined;
            })(),
            ...(keyword[1] &&
              (() => {
                const classNum = Number(keyword[1]);
                return classNum >= 1 && classNum <= 4 ? { classNumber: classNum } : {};
              })),
            ...(keyword.slice(2) && {
              studentNumber: (() => {
                const studentNum = Number(keyword.slice(2));
                if (isNaN(studentNum)) {
                  return undefined;
                }
                keyword.slice(2).length === -1
                  ? { gte: Number(keyword[2]) * 10, lte: Number(keyword[2]) * 10 + 9 }
                  : Number(keyword.slice(2));
              })()
            })
          }
        : { name: { contains: keyword } }
      : {
          ...(grade && { grade: Number(grade) }),
          ...(classNumber && { classNumber: Number(classNumber) })
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
