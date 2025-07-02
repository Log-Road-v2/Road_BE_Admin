import express from 'express';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import project from '../service/project';

const router = express.Router();

router.get('/detail/:projectId', getApiLimit, verifyJWT, checkRight, project.projectDetailHandler);
router.get('/:contestId', getApiLimit, verifyJWT, checkRight, project.projectListHandler);
router.patch('/:projectId', apiLimit, verifyJWT, checkRight, project.changeProjectStateHandler);
router.delete('/:projectId', apiLimit, verifyJWT, checkRight, project.removeProjectHandler);

export default router;
