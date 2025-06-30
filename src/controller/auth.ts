import express, { Request, Response } from 'express';
import auth from '../service/auth';
import { apiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { loginHandler } from '../service/auth/login';

const router = express.Router();

router.post('/signup', apiLimit, auth.signUpHandler);
router.post('/login', apiLimit, loginHandler);
router.post('/refresh', apiLimit, verifyJWT, auth.refreshHandler);
router.post('/logout', apiLimit, verifyJWT, auth.logoutHandler);

export default router;
