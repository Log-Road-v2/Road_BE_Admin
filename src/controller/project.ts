import express from 'express';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import project from '../service/project';
import { validateContestId, validateProjectId } from '../middleware/validation';

const router = express.Router();

router.get('/detail/:projectId', getApiLimit, validateProjectId, verifyJWT, checkRight, project.projectDetailHandler);
router.get('/:contestId', getApiLimit, validateContestId, verifyJWT, checkRight, project.projectListHandler);
router.patch('/:projectId', apiLimit, validateProjectId, verifyJWT, checkRight, project.changeProjectStateHandler);
router.delete('/:projectId', apiLimit, validateProjectId, verifyJWT, checkRight, project.removeProjectHandler);

export default router;
