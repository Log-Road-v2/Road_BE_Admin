import express from 'express';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import contest from '../service/contest';

const app = express.Router();

app.get('/', getApiLimit, verifyJWT, checkRight, contest.contestListHandler);
app.get('/:contestId', getApiLimit, verifyJWT, checkRight, contest.contestDetailHandler);

export default app;
