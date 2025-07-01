import { ContestState } from '../config/prisma';

export interface ContestListData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
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
  startDate: Date;
  endDate: Date;
  purpose: string;
  award: {
    name: string;
  }[];
}

export interface ContestRequest {
  name: string;
  startDate: Date;
  endDate: Date;
  purpose: string;
  award: {
    name: string;
    awardCount: number;
  }[];
}

export interface ChangeContestStateRequest {
  state: ContestState;
}
