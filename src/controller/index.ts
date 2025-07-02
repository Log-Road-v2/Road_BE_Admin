import express from 'express';
import auth from './auth';
import award from './award';
import contest from './contest';
import project from './project';
import student from './student';

const app = express();

app.use('/auth', auth);
app.use('/award', award);
app.use('/contest', contest);
app.use('/project', project);
app.use('/student', student);

export default app;
