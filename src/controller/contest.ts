import express from 'express';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import contest from '../service/contest';
import { validateContestId } from '../middleware/validation';

const router = express.Router();

router.patch(
  '/:contestId/state',
  apiLimit,
  validateContestId,
  verifyJWT,
  checkRight,
  contest.changeContestStateHandler
);
router.get('/:contestId', getApiLimit, validateContestId, verifyJWT, checkRight, contest.contestDetailHandler);
router.patch('/:contestId', apiLimit, validateContestId, verifyJWT, checkRight, contest.modifyContestHandler);
router.get('/', getApiLimit, verifyJWT, checkRight, contest.contestListHandler);
router.post('/', apiLimit, verifyJWT, checkRight, contest.openContestHandler);

export default router;
