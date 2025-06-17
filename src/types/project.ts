import { Author } from '../config/prisma';

export interface ProjectListData {
  id: bigint;
  projectName: string;
  authorCategory: Author;
  introduction: string;
  image: string;
}

export interface ProjectListResponse {
  offset: number;
  totalProjects: number;
  projects: ProjectListData[];
}
