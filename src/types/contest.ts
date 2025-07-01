import { ContestState } from '../config/prisma';

export interface ContestListData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  state: ContestState;
}

export interface ContestListResponse {
  contests: ContestListData[];
}

export interface ContestParams {
  [key: string]: string;
  contestId: string;
}

export interface ContestDetailResponse {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  purpose: string;
  awards: {
    name: string;
  }[];
}

export interface ContestRequest {
  name: string;
  startDate: Date;
  endDate: Date;
  purpose: string;
  awards: {
    name: string;
    awardCount: number;
  }[];
}

export interface ChangeContestStateRequest {
  state: ContestState;
}
