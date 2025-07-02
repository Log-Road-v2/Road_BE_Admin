import express from 'express';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import contest from '../service/contest';

const router = express.Router();

router.get('/:contestId', getApiLimit, verifyJWT, checkRight, contest.contestDetailHandler);
router.get('/', getApiLimit, verifyJWT, checkRight, contest.contestListHandler);
router.post('/', apiLimit, verifyJWT, checkRight, contest.openContestHandler);
router.patch('/:contestId/state', apiLimit, verifyJWT, checkRight, contest.changeContestStateHandler);
router.patch('/:contestId', apiLimit, verifyJWT, checkRight, contest.modifyContestHandler);

export default router;
