import express, { Request, Response } from 'express';
import auth from '../service/auth';
import { postApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';

const router = express.Router();

router.post('/signup', postApiLimit, (req: Request, res: Response) => {
  auth.signUp(req, res);
});
router.post('/login', postApiLimit, (req: Request, res: Response) => {
  auth.login(req, res);
});
router.post('/refresh', postApiLimit, verifyJWT, (req: Request, res: Response) => {
  auth.refresh(req, res);
});
router.post('/logout', postApiLimit, verifyJWT, (req: Request, res: Response) => {
  auth.logout(req, res);
});

export default router;
