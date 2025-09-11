const express = require('express');
const router = express.Router();

const initialController = require('../controllers/initialController');

// Definindo as rotas para as operações CRUD

router.get('/', initialController.paginaInicial);

module.exports = router;
