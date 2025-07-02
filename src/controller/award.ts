import express from 'express';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import award from '../service/award';

const app = express.Router();

app.get('/', getApiLimit, verifyJWT, checkRight, award.waitContestListHandler);

export default app;
