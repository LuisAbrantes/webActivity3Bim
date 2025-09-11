const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');

// Definindo as rotas para as operações CRUD

router.get('/', taskController.getAllTasks);
router.get('/task/:id', taskController.getTaskId);
router.get('/completed', taskController.getTaskCompleted );
router.post('/create', taskController.createTask ); // falta implementar

module.exports = router;
