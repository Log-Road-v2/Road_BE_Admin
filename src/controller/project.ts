import express from 'express';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import project from '../service/project';

const app = express.Router();

app.get('/detail/:projectId', getApiLimit, verifyJWT, checkRight, project.projectDetailHandler);
app.get('/:contestId', getApiLimit, verifyJWT, checkRight, project.projectListHandler);
app.patch('/:projectId', apiLimit, verifyJWT, checkRight, project.changeProjectStateHandler);

export default app;
