import { ObjectID } from 'bson';
import { Router } from 'express';
import { Task, TaskCompletion } from '../Models/Task';

const taskCompletionRouter = Router();

/**
 * Completes a task with `taskId`
 */
 taskCompletionRouter.put("/tasks/:taskId/complete", async (req, res) => {
    const taskID = req.params.taskId;

    if (!ObjectID.isValid(taskID)) {
        console.log("Invalid task id")
        return res.sendStatus(400).end();
    }

    const requestedTask = await Task.findById(taskID).exec();

    if (requestedTask !== null) {
        requestedTask.taskCompletions.addToSet(
            new TaskCompletion({
                date: Date()
            })
        )
        await requestedTask.save();
        return res.status(200).end(JSON.stringify(requestedTask));
    } else {
        console.log(`unable to find task with id ${taskID}`);
        return res.sendStatus(404).end()
    }
});

/**
 * Deletes a completion with `completionId` that is associated with a task with `taskId`
 */
 taskCompletionRouter.delete("/tasks/:taskId/completion/:completionId", async (req, res) => {
    const taskID = req.params.taskId;
    const completionID = req.params.completionId;

    await Task.updateOne({_id: taskID}, {
        $pull: {
            taskCompletions: {_id: completionID}
        }
    });
    res.end();
});

export default taskCompletionRouter;
