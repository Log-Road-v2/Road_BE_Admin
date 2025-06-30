import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';
import { BasicResponse } from '../../types';
import { SearchStudentQuery, SearchStudentResponse, StudentInfo } from '../../types/student';
import { parseEnvToInt } from '../../utils/parseEnv';

const PAGE_SIZE = parseEnvToInt(process.env.STUDENT_PAGE_SIZE, 10);

export const searchStudents = async (
  req: Request<Record<string, never>, BasicResponse | SearchStudentResponse, Record<string, never>, SearchStudentQuery>,
  res: Response<SearchStudentResponse | BasicResponse>
) => {
  try {
    const { grade, classNumber, keyword, offset } = req.query;
    const offsetNumber = Number(offset) || 1;

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
              })()),
            ...(keyword.slice(2) && {
              studentNumber: (() => {
                const studentNum = Number(keyword.slice(2));
                if (isNaN(studentNum)) {
                  return undefined;
                }
                return keyword.slice(2).length === 1 ? { gte: studentNum * 10, lte: studentNum * 10 + 9 } : studentNum;
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
        skip: PAGE_SIZE * Math.max(offsetNumber - 1, 0),
        take: PAGE_SIZE,
        orderBy: [{ grade: 'asc' }, { classNumber: 'asc' }, { studentNumber: 'asc' }, { name: 'asc' }]
      }),
      prisma.student.count({
        where: where
      })
    ]);

    const result: StudentInfo[] = students.map((student) => ({
      ...student,
      id: student.id.toString()
    }));
    return res.status(200).json({
      offset: offsetNumber,
      totalStudent: totalStudents,
      students: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};
