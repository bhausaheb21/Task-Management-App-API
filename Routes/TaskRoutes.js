const express = require('express');
const { Task } = require('../Models');
const { TaskController } = require('../Controllers');
const { isAuth } = require('../Middlewares/isAuth');

const authRouter = express.Router()

authRouter.use(isAuth)
authRouter.get('/', TaskController.getAlltasks)
authRouter.get('/sort/:criteria', TaskController.sortby)
authRouter.post('/', TaskController.addTask)
authRouter.put('/:id', TaskController.updateTaskStatus)
authRouter.delete('/:id', TaskController.deletetask)
authRouter.get('/:filter', TaskController.filtertask)

module.exports = authRouter;