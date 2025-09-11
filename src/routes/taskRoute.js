const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');

// Definindo as rotas para as operações CRUD

router.get('/tasks', taskController.getAllTasks);
router.get('/task/:id', taskController.getTaskId);
router.get('/tasksCompleted', taskController.getTaskCompleted );
router.post('/createTask', taskController.createTask );
router.get('/', taskController.paginaInicial);

module.exports = router;
