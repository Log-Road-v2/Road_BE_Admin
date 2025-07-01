import express from 'express';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import contest from '../service/contest';

const app = express.Router();

app.get('/', getApiLimit, verifyJWT, checkRight, contest.contestListHandler);
app.post('/', apiLimit, verifyJWT, checkRight, contest.openContestHandler);
app.get('/:contestId', getApiLimit, verifyJWT, checkRight, contest.contestDetailHandler);
app.patch('/:contestId', apiLimit, verifyJWT, checkRight, contest.modifyContestHandler);

export default app;
