import express, { Request, Response } from 'express';
import auth from '../service/auth';
import { apiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { loginHandler } from '../service/auth/login';

const router = express.Router();

router.post('/signup', apiLimit, (req: Request, res: Response) => {
  auth.signUp(req, res);
});
router.post('/login', apiLimit, loginHandler);
router.post('/refresh', apiLimit, verifyJWT, (req: Request, res: Response) => {
  auth.refresh(req, res);
});
router.post('/logout', apiLimit, verifyJWT, (req: Request, res: Response) => {
  auth.logout(req, res);
});

export default router;
