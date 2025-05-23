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
    const newGeneration = (Math.max(0, ...generationsNum) + 1).toString();

    const workbook = read(req.file.buffer, { type: 'buffer' });

    await prisma.$transaction(async (tx) => {
      for (const sheetName of workbook.SheetNames) {
        const [grade, classNumber] = sheetName.split('-');
        const numGrade = Number(grade);

        const data = utils.sheet_to_json(workbook.Sheets[sheetName], {
          range: 3,
          defval: '',
          header: grade === '1' ? ['studentNum', 'name'] : ['studentNum', 'name', 'gender', 'beforeStudentNum', 'etc']
        });

        if (grade === '1') {
          const studentsData = (data as FileFirstGradeStudentData[]).map((d) => ({
            generation: newGeneration,
            name: d.name,
            grade: '1',
            classNumber: classNumber,
            studentNumber: (d.studentNum % 100).toString()
          }));

          await tx.student.createMany({
            data: studentsData,
            skipDuplicates: true
          });
        } else {
          await Promise.all(
            (data as FileStudentData[]).map(async (d) => {
              const prev = await tx.student.findFirst({
                where: {
                  grade: (numGrade - 1).toString(),
                  classNumber: classNumber,
                  studentNumber: (d.beforeStudentNum % 100).toString()
                }
              });
              if (prev) {
                // await tx.student.update({
                //   where: {id: prev.id},
                //   data: {
                //     grade:
                //   }
                // })
              }
            })
          );

          for (const student of data as FileStudentData[]) {
            const existing = await prisma.student.findFirst({
              where: {
                grade: grade,
                classNumber: classNumber,
                studentNumber: (student.studentNum % 100).toString()
              }
            });
            if (!existing) {
              await prisma.student.create({
                data: {
                  generation: (Number(newGeneration) - Number(grade)).toString(),
                  name: student.name,
                  grade: grade,
                  classNumber: classNumber,
                  studentNumber: (student.studentNum % 100).toString()
                }
              });
            } else {
              await prisma.student.update({
                where: { id: existing.id },
                data: {
                  grade: grade,
                  classNumber: classNumber,
                  studentNumber: (student.beforeStudentNum % 100).toString()
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
