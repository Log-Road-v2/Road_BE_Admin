import { StudentState } from '../config/prisma';

export interface SearchStudentQuery {
  grade?: string;
  classNumber?: string;
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
  generation: string;
  grade?: string | null;
  classNumber?: string | null;
  studentNumber?: string | null;
  name: string;
  state: StudentState;
}
