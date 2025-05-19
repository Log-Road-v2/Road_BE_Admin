import express, { Request, Response } from 'express';
import student from '../service/student';
import { postApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';

const router = express.Router();

router.get('/', postApiLimit, verifyJWT, checkRight, (req: Request, res: Response) => {
  student.searchStudents(req, res);
});

export default router;
