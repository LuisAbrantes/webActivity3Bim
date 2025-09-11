const express = require('express');
const router = express.Router();
const turmasController = require('../controllers/turmasController');

router.get('/', turmasController.listarTodasAsTurmas);

module.exports = router;
