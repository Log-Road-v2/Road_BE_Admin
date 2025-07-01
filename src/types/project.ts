import { Author, ProjectState } from '../config/prisma';

export interface ProjectListParams {
  [key: string]: string;
  contestId: string;
}

export interface ProjectListQuery {
  [key: string]: string | undefined;
  state?: ProjectState | 'ALL';
  offset?: string;
  keyword?: string;
}

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

export interface ProjectParams {
  [key: string]: string;
  projectId: string;
}

export interface ProjectDetailResponse {
  contestName: string;
  projectName: string;
  authorCategory: Author;
  teamName: string | null;
  member: string[];
  skills: string[];
  introduction: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string | null;
  video: string | null;
  state: ProjectState;
}

export interface ChangeProjectStateRequest {
  state: ProjectState;
  content?: string | null;
}
