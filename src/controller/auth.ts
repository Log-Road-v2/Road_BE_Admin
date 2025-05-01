import express, { Request, Response } from 'express';
import auth from '../service/auth';

const app = express();

app.post('/signup', (req: Request, res: Response) => {
  auth.signUp(req, res);
});
app.post('/login', (req: Request, res: Response) => {
  auth.login(req, res);
});
app.post('/refresh', (req: Request, res: Response) => {
  auth.refresh(req, res);
});

export default app;
