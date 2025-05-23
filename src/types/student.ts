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
  id: bigint;
  generation: number;
  grade?: number | null;
  classNumber?: number | null;
  studentNumber?: number | null;
  name: string;
  state: StudentState;
}
