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

export interface WaitContestListReponse {
  contests: WaitContestListData[];
}
