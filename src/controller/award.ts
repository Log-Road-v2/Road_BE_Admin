import express from 'express';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import award from '../service/award';

const app = express.Router();

app.get('/', getApiLimit, verifyJWT, checkRight, award.waitContestListHandler);
app.get('/:contestId', getApiLimit, verifyJWT, checkRight, award.projectVotePercentHandler);
app.get('/:contestId/total', getApiLimit, verifyJWT, checkRight, award.contestVotePercentHandler);

export default app;
