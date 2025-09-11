const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);
router.get('/task/:id', taskController.getTaskId);
router.get('/completed', taskController.getTaskCompleted);
router.post('/create', taskController.createTask);

module.exports = router;
