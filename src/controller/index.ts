import express from 'express';
import auth from './auth';
import student from './student';

const app = express();

app.use('/auth', auth);
app.use('/student', student);

export default app;
