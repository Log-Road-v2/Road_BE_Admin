import express, { Request, Response } from 'express';
import auth from '../service/auth';
import { apiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

router.post('/signup', apiLimit, (req: Request, res: Response) => {
  auth.signUp(req, res);
});
router.post('/login', apiLimit, (req: Request, res: Response) => {
  auth.login(req, res);
});
router.post('/refresh', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  auth.refresh(req, res);
});
router.post('/logout', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  auth.logout(req, res);
});

export default router;
