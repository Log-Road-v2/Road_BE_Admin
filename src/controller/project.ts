import express, { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import project from '../service/project';

const app = express.Router();

app.get('/:contestId', getApiLimit, verifyJWT, checkRight, (req: AuthenticatedRequest, res: Response) => {
  project.projectList(req, res);
});

export default app;
