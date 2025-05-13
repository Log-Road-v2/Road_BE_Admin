import express, { Request, Response } from 'express';
import student from '../service/student';
import { postApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';

const app = express();

app.get('/', postApiLimit, verifyJWT, (req: Request, res: Response) => {
  student.searchStudents(req, res);
});

export default app;
