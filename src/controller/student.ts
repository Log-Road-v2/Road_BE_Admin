import express, { Response } from 'express';
import student from '../service/student';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import { AuthenticatedRequest } from '../types';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/', getApiLimit, verifyJWT, checkRight, (req: AuthenticatedRequest, res: Response) => {
  student.searchStudents(req, res);
});
router.post('/', apiLimit, verifyJWT, checkRight, upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  student.uploadStudent(req, res);
});
router.patch('/:studentId', apiLimit, verifyJWT, checkRight, (req: AuthenticatedRequest, res: Response) => {
  student.modifyStudent(req, res);
});
router.delete('/:studentId', apiLimit, verifyJWT, checkRight, (req: AuthenticatedRequest, res: Response) => {
  student.removeStudent(req, res);
});

export default router;
