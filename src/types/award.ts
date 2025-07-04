export interface WaitContestListData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  awards: AwardData[];
}

export interface AwardData {
  id: string;
  name: string;
  awardCount: number;
}

export interface WaitContestListResponse {
  contests: WaitContestListData[];
}

export interface ProjectVotePercentQuery {
  [key: string]: string | undefined;
  orderBy?: 'UPLOAD' | 'VOTE';
  offset?: string;
}

export interface ProjectVotePercentData {
  id: string;
  projectName: string;
  introduction: string;
  image: string | null;
  studentPercent: number;
  teacherPercent: number;
}

export interface ProjectVotePercentResponse {
  offset: number;
  totalProjects: number;
  projects: ProjectVotePercentData[];
}

export interface ContestVotePercentResponse {
  totalPercent: number;
}

export interface NonVoteListData {
  name: string;
  grade: number | null;
  classNumber: number | null;
  studentNumber: number | null;
}

export interface NonVoteListResponse {
  nonVotes: NonVoteListData[];
}

export interface AwardingRequest {
  awards: {
    id: string;
    projects: string[];
  }[];
}
