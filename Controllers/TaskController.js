const { default: mongoose } = require("mongoose");
const { Task, User } = require("../Models");


class TaskController {
    static async getAlltasks(req, res, next) {
        try {
            const user = req.user;
            const tasks = await User.findById(user._id).populate('tasks');
            return res.status(200).json({ message: "Task Fetched Successfully", tasks: tasks.tasks })
        } catch (error) {
            next(error)
        }
    }

    static async addTask(req, res, next) {
        try {
            const { title, description, priority, due_date } = req.body;
            const task = new Task({ title, description, priority, due_date });
            const newtask = await task.save();
            const user = req.user;
            user.tasks.push(newtask._id);
            await user.save()
            return res.status(201).json({ message: "Task added Successfully", task: newtask })
        } catch (error) {
            next(error)
        }
    }

    static async updateTaskStatus(req, res, next) {
        try {
            const id = req.params.id;
            const tasks = req.user.tasks;
            if (!tasks.includes(id)) {
                const error = new Error("Not Authorized");
                error.status = 401;
                throw error;
            }

            const task = await Task.findById(id);
            if (task.status == "Completed") {
                const error = new Error("Already Completed");
                error.status = 200;
                throw error;
            }
            task.status = "Completed";
            task.completed_time = new Date()
            const updatedtask = await task.save();
            return res.status(201).json({ message: "Task Updated Successfully", task: updatedtask })
        } catch (error) {
            next(error)
        }
    }


    static async deletetask(req, res, next) {
        try {
            const id = req.params.id;
            const tasks = req.user.tasks;
            if (!tasks.includes(id)) {
                const error = new Error("Not Authorized");
                error.status = 401;
                throw error;
            }

            const task = await Task.findById(id);
            if (!task) {
                const error = new Error("Task not Found");
                error.status = 404;
                throw error;
            }
            const result = await Task.findByIdAndDelete(task._id);
            req.user.tasks.pop(task._id);
            await req.user.save();
            return res.status(200).json({ message: "Deleted Successfully", result })
        } catch (error) {
            next(error)
        }
    }

    static async filtertask(req, res, next) {
        try {
            const filter = req.params.filter;
            const tasks = await Task.find({ _id: { $in: req.user.tasks }, status: filter })
            return res.status(200).json({ message: "Filtered Successfully", tasks })
        }
        catch (err) {
            next(err);
        }
    }

    static async sortby(req, res, next) {
        try {
            const criteria = req.params.criteria;
            let sortCriteria = {};
            if (criteria === 'due_date') {
                sortCriteria = { dueDate: 1 };
            } else if (criteria === 'priority') {
                sortCriteria = { priority: -1 };
            }
            const tasks = await Task.find({ _id: { $in: req.user.tasks } }).sort(sortCriteria);
            return res.status(200).json({ message: "Fetched Successfully", tasks })
        } catch (error) {
            next(error);
        }
    }
}
module.exports = TaskController