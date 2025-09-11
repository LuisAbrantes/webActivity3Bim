const turmasModel = require('../models/turmasModel');

const listarTodasAsTurmas = (req, res) => {
    const turmas = turmasModel.listarTodasAsTurmas();
    res.status(200).json(turmas);
};

module.exports = {
    listarTodasAsTurmas
};
