import express from 'express';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import award from '../service/award';

const router = express.Router();

router.get('/:contestId/total', getApiLimit, verifyJWT, checkRight, award.contestVotePercentHandler);
router.get('/:contestId/nonvote', getApiLimit, verifyJWT, checkRight, award.nonVoteListHandler);
router.get('/:contestId', getApiLimit, verifyJWT, checkRight, award.projectVotePercentHandler);
router.get('/', getApiLimit, verifyJWT, checkRight, award.waitContestListHandler);
router.post('/:contestId', apiLimit, verifyJWT, checkRight, award.awardingHandler);

export default router;
