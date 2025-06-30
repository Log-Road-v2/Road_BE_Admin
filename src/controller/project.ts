import express, { Request, Response } from 'express';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import { projectListHandler } from '../service/project/projectList';

const app = express.Router();

app.get('/:contestId', getApiLimit, verifyJWT, checkRight, projectListHandler);

export default app;
