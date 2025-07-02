import express from 'express';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import award from '../service/award';
import { validateContestId } from '../middleware/validation';

const router = express.Router();

router.get('/:contestId/total', getApiLimit, validateContestId, verifyJWT, checkRight, award.contestVotePercentHandler);
router.get('/:contestId/nonvote', validateContestId, getApiLimit, verifyJWT, checkRight, award.nonVoteListHandler);
router.get('/:contestId', getApiLimit, validateContestId, verifyJWT, checkRight, award.projectVotePercentHandler);
router.get('/', getApiLimit, verifyJWT, checkRight, award.waitContestListHandler);
router.post('/:contestId', apiLimit, validateContestId, verifyJWT, checkRight, award.awardingHandler);

export default router;
