 const taskModel = require('../models/taskModel');

 // GET /tasks - Listar todas as tarefas
 const getAllTasks = (req, res) => {
    const tasks = taskModel.getAllTasks();
    res.status(200).json(tasks);
 };

 // GET /tasks/:id - Obter uma tarefa específica
 const getTaskId = (req, res) => {
    const id = parseInt(req.params.id);
    const task = taskModel.getTaskId(id);
    
    if (!task) {
      // status é fundamental na API RESTful - código padronizado, confiável e profissional
      // define o código status HTTP que será enviado junto com a resposta
      /* Códigos HTTP
         200 OK -> requisição bem-sucedida (GET, PUT, DELETE bem feitos)
         201 Created -> Recurso criado com sucesso (POST)
         204 No Content -> Exclusão bem-sucedida, sem corpo de resposta
         400 Bad request -> Cliente enviou dados inválidos
         404 Not found -> Recurso não encontrado
         500 Internet Server Error -> Erro inesperado no servidor
      */
        res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.json(task);
 }

// GET /tasksCompleted - Listar as tarefas Feitas
const getTaskCompleted = (req, res) => {
   const tasks = taskModel.getCompleted();
   res.status(200).json(tasks);
};

//GET /
const paginaInicial = (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'))
};

// POST /createTask - Criar uma nova tarefa
const createTask = (req, res) => {
   const newTask = taskModel.createTask(req.body);
   res.status(201).json(newTask);
};

module.exports = {
   getAllTasks ,
   getTaskId,
   getTaskCompleted,
   createTask,
   paginaInicial
};
 