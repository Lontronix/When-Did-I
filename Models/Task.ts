import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TaskCompletionSchema = new Schema({
    date: Date
}) 

const TaskSchema = new Schema({
    taskName: String,
    taskCompletions: [TaskCompletionSchema]
});

// collection name in db: tasks
const TaskCompletion = model("Task Completion", TaskCompletionSchema);
const Task = model("Task", TaskSchema);

export { TaskCompletion, Task };
