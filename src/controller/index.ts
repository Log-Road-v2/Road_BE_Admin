import express from 'express';
import auth from './auth';
import student from './student';
import project from './project';

const app = express();

app.use('/auth', auth);
app.use('/student', student);
app.use('/project', project);

export default app;
