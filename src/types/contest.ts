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
