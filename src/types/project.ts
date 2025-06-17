import { Author } from '../config/prisma';

export interface ProjectListData {
  id: string;
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
