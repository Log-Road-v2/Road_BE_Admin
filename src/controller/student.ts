import express, { Response } from 'express';
import student from '../service/student';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

router.get('/', getApiLimit, verifyJWT, checkRight, (req: AuthenticatedRequest, res: Response) => {
  student.searchStudents(req, res);
});

export default router;
