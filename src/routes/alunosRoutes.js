const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosController');

router.get('/', alunosController.listarAlunos);
router.post('/', alunosController.criarAluno);
router.get('/:id', alunosController.buscarAlunoPorId);
router.put('/:id', alunosController.atualizarAluno);
router.delete('/:id', alunosController.deletarAluno);

module.exports = router;
