import { AuthenticatedRequest, BasicResponse } from '../../types';
import { Response } from 'express';
import { prisma } from '../../config/prisma';
import { read, utils } from 'xlsx';
import { FileFirstGradeStudentData, FileStudentData } from '../../types/student';

export const uploadStudent = async (req: AuthenticatedRequest, res: Response<BasicResponse>) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: '읽을 수 없는 파일'
      });
    }

    const generations = await prisma.student.findMany({
      select: { generation: true },
      distinct: ['generation']
    });
    const generationsNum = generations.map((g) => Number(g.generation) || 0);
    const newGeneration = Math.max(0, ...generationsNum) + 1;

    const workbook = read(req.file.buffer, { type: 'buffer' });

    await prisma.$transaction(async (tx) => {
      await tx.student.updateMany({
        where: { grade: 3 },
        data: {
          grade: null,
          classNumber: null,
          studentNumber: null,
          state: 'GRADUATION'
        }
      });

      for (const sheetName of workbook.SheetNames) {
        const [grade, classNumber] = sheetName.split('-');
        const [numGrade, numClass] = [Number(grade), Number(classNumber)];

        const data = utils.sheet_to_json(workbook.Sheets[sheetName], {
          range: 3,
          defval: '',
          header: numGrade === 1 ? ['studentNum', 'name'] : ['studentNum', 'name', 'gender', 'beforeStudentNum', 'etc']
        });

        if (numGrade === 1) {
          const studentsData = (data as FileFirstGradeStudentData[]).map((d) => ({
            generation: newGeneration,
            name: d.name,
            grade: numGrade,
            classNumber: numClass,
            studentNumber: d.studentNum % 100
          }));

          await tx.student.createMany({
            data: studentsData
          });
        } else {
          for (const d of data as FileStudentData[]) {
            const beforeStudentNumStr = d.beforeStudentNum.toString().padEnd(4, '0');
            const beforeClass = parseInt(beforeStudentNumStr.slice(1, 2));
            const beforeNumber = parseInt(beforeStudentNumStr.slice(2, 4));
            const studentNum = parseInt(d.studentNum.toString().padEnd(4, '0').slice(2, 4));
            const prev = await tx.student.findFirst({
              where: {
                grade: numGrade - 1,
                classNumber: beforeClass,
                studentNumber: beforeNumber,
                name: d.name
              }
            });
            if (prev) {
              await tx.student.update({
                where: { id: prev.id },
                data: {
                  grade: numGrade,
                  classNumber: numClass,
                  studentNumber: studentNum
                }
              });
            } else {
              await tx.student.create({
                data: {
                  generation: newGeneration - numGrade + 1,
                  name: d.name,
                  grade: numGrade,
                  classNumber: numClass,
                  studentNumber: studentNum
                }
              });
            }
          }
        }
      }
    });
    return res.status(201).json({
      message: '학생 등록 완료'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};
