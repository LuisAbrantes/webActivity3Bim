const express = require('express');
const router = express.Router();
const turmasController = require('../controllers/turmasController');

router.get('/', turmasController.listarTodasAsTurmas);
router.post('/', turmasController.criarTurma);
router.get('/:id', turmasController.buscarTurmaPorId);
router.put('/:id', turmasController.atualizarTurma);
router.delete('/:id', turmasController.deletarTurma);

module.exports = router;
