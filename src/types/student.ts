import { StudentState } from '../config/prisma';

export interface SearchStudentQuery {
  grade?: number;
  classNumber?: number;
  keyword?: string;
  offset?: number;
}

export interface SearchStudentResponse {
  offset: number;
  totalStudent: number;
  students: StudentInfo[];
}

export interface StudentInfo {
  id: string;
  generation: number;
  grade?: number | null;
  classNumber?: number | null;
  studentNumber?: number | null;
  name: string;
  state: StudentState;
}

export interface FileFirstGradeStudentData {
  studentNum: number;
  name: string;
}

export interface FileStudentData {
  studentNum: number;
  name: string;
  gender: string;
  beforeStudentNum: number;
  etc: string;
}

export interface StudentParams {
  [key: string]: string;
  studentId: string;
}

export interface ModifyStudentRequest {
  state: StudentState;
  name: string;
  generation: number;
  grade: number;
  classNumber: number;
  studentNumber: number;
}
