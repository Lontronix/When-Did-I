import { Router } from 'express';
import { ObjectID } from 'bson';
import bodyParser from 'body-parser';
import { Task } from '../Models/Task';

const taskRouter = Router();
var jsonParser = bodyParser.json()

/**
 * Lists all tasks
 */
taskRouter.get("/tasks/", async (req, res) => {

    const tasks = (await Task.find()).map(task => ({
        taskName: task.taskName,
        taskCompletions: task.taskCompletions, 
        id: task.id 
    }))

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(tasks));
})

/**
 * deletes a task with the id `taskID`
 */
taskRouter.delete("/tasks/:taskId", async (req, res) =>  {
    const taskID = req.params.taskId;
    if (!ObjectID.isValid(taskID)) {
        return res.sendStatus(400).end();
    }

    Task.deleteOne({_id: taskID}, (error) => {
        if (error) {
           console.error(`an error occured ${error}`) 
           return res.sendStatus(500).end();
        }
        console.log(`a task with the id ${taskID} was succesfully deleted`);
        return res.sendStatus(200).end();
    })
});

/**
 * renames a task with `taskId`
 */
taskRouter.put("/tasks/:taskId", jsonParser, async (req, res) => {
    const taskID = req.params.taskId;
    if (!ObjectID.isValid(taskID)) {
        return res.sendStatus(200).end();
    }

    const newTaskName = req.body['task-name'];

    if (typeof(newTaskName) === 'string' && newTaskName.length > 0) {
        await Task.updateOne({_id: taskID}, {taskName: newTaskName});
        return res.sendStatus(200).end()
    }

    return res.sendStatus(400).end();
});

/**
 * Creates a new task with `taskName`
 */
taskRouter.post("/tasks/create", jsonParser, async (req, res) => {
    const requestedTaskName = req.body['task-name'];

    if (typeof(requestedTaskName) === 'string' && requestedTaskName.length > 0) {
        console.log(`creating task with name: ${requestedTaskName}`);
        const task = new Task({
            taskName: requestedTaskName
        });
        await task.save();
        console.log(`succesfully created task with name: \"${requestedTaskName}\"`);
        res.sendStatus(200).end();

    } else {
        console.error("`task-name` missing or improperly formatted")
        res.sendStatus(400).end(); 
    }
});

export default taskRouter;
