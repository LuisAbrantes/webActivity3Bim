const alunosModel = require('../models/alunosModel');

const listarAlunos = (req, res) => {
    const { nome, turma } = req.query;

    let alunos = alunosModel.listarTodosOsAlunos();

    if (nome) {
        alunos = alunos.filter(aluno =>
            aluno.nome.toLowerCase().includes(nome.toLowerCase())
        );
    }

    if (turma) {
        alunos = alunos.filter(aluno => aluno.id_turma === parseInt(turma));
    }

    res.status(200).json(alunos);
};

module.exports = {
    listarAlunos
};
