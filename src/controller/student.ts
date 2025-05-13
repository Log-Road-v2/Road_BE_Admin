import express, { Request, Response } from 'express';
import student from '../service/student';
import { postApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';

const router = express.Router();

router.get('/', postApiLimit, verifyJWT, (req: Request, res: Response) => {
  student.searchStudents(req, res);
});

export default router;
