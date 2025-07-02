import express from 'express';
import student from '../service/student';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { checkRight } from '../middleware/checkRight';
import { upload } from '../middleware/upload';
import { validateStudentId } from '../middleware/validation';

const router = express.Router();

router.get('/', getApiLimit, verifyJWT, checkRight, student.searchStudentsHandler);
router.post('/', apiLimit, verifyJWT, checkRight, upload.single('file'), student.uploadStudentHandler);
router.patch('/:studentId', apiLimit, validateStudentId, verifyJWT, checkRight, student.modifyStudentHandler);
router.delete('/:studentId', apiLimit, validateStudentId, verifyJWT, checkRight, student.removeStudentHandler);

export default router;
