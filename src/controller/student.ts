import express, { Request, Response } from 'express';
import student from '../service/student';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';

const router = express.Router();

router.get('/', getApiLimit, verifyJWT, checkRight, (req: Request, res: Response) => {
  student.searchStudents(req, res);
});

export default router;
