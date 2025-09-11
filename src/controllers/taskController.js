const taskModel = require('../models/taskModel');

const getAllTasks = (req, res) => {
    const tasks = taskModel.getAllTasks();
    res.status(200).json(tasks);
};

const getTaskId = (req, res) => {
    const id = parseInt(req.params.id);
    const task = taskModel.getTaskId(id);

    if (!task) {
        res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.json(task);
};

const getTaskCompleted = (req, res) => {
    const tasks = taskModel.getCompleted();
    res.status(200).json(tasks);
};

const createTask = (req, res) => {
    const newTask = taskModel.createTask(req.body);
    res.status(201).json(newTask);
};

module.exports = {
    getAllTasks,
    getTaskId,
    getTaskCompleted,
    createTask
};
