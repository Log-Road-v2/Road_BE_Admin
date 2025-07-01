import express from 'express';
import auth from './auth';
import student from './student';
import project from './project';
import contest from './contest';

const app = express();

app.use('/auth', auth);
app.use('/project', project);
app.use('/student', student);
app.use('/contest', contest);

export default app;
