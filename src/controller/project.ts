import express from 'express';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import project from '../service/project';

const app = express.Router();

app.get('/detail/:projectId', getApiLimit, verifyJWT, checkRight, project.projectDetailHandler);
app.get('/:contestId', getApiLimit, verifyJWT, checkRight, project.projectListHandler);

export default app;
