import express, { Request, Response } from 'express';
import auth from '../service/auth';
import { postApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';

const app = express();

app.post('/signup', postApiLimit, (req: Request, res: Response) => {
  auth.signUp(req, res);
});
app.post('/login', postApiLimit, (req: Request, res: Response) => {
  auth.login(req, res);
});
app.post('/refresh', postApiLimit, verifyJWT, (req: Request, res: Response) => {
  auth.refresh(req, res);
});
app.post('/logout', postApiLimit, verifyJWT, (req: Request, res: Response) => {
  auth.logout(req, res);
});

export default app;
