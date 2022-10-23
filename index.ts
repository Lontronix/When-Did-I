import express from 'express';
import mongoose from "mongoose";
import taskCompletionRouter from './routes/TaskCompletion';
import taskRouter from './routes/Task';

require('dotenv').config();
require('./routes/Task');
require('./routes/TaskCompletion');

const port = process.env.EXPRESS_PORT;
const app = express();
app.use(taskCompletionRouter);
app.use(taskRouter);
mongoose.connect(process.env.MONGO_DB_URI || "");

console.log(`Connected to: ${process.env.MONGO_DB_URI}`);

type item = {
    taskName: String,
    taskCompletions: [String],
    id: string
};

app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});
