const turmasModel = require('../models/turmasModel');
const alunosModel = require('../models/alunosModel');

const listarTodasAsTurmas = (req, res) => {
    const turmas = turmasModel.listarTodasAsTurmas();
    res.status(200).json(turmas);
};

const criarTurma = (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({
            erro: 'Nome da turma é obrigatório'
        });
    }

    try {
        const novaTurma = turmasModel.criarTurma({ nome });
        res.status(201).json(novaTurma);
    } catch (error) {
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};

const buscarTurmaPorId = (req, res) => {
    const { id } = req.params;
    const turma = turmasModel.buscarTurmaPorId(id);

    if (!turma) {
        return res.status(404).json({ erro: 'Turma não encontrada' });
    }

    const alunosDaTurma = alunosModel.listarAlunosPorTurma(id);
    const turmaComAlunos = {
        ...turma,
        quantidadeAlunos: alunosDaTurma.length,
        alunos: alunosDaTurma
    };

    res.status(200).json(turmaComAlunos);
};

const atualizarTurma = (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({
            erro: 'Nome da turma é obrigatório'
        });
    }

    try {
        const turmaAtualizada = turmasModel.atualizarTurma(id, { nome });

        if (!turmaAtualizada) {
            return res.status(404).json({ erro: 'Turma não encontrada' });
        }

        res.status(200).json(turmaAtualizada);
    } catch (error) {
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};

const deletarTurma = (req, res) => {
    const { id } = req.params;

    const alunosDaTurma = alunosModel.listarAlunosPorTurma(id);

    const sucesso = turmasModel.deletarTurma(id);

    if (!sucesso) {
        return res.status(404).json({ erro: 'Turma não encontrada' });
    }

    res.status(200).json({
        mensagem: 'Turma deletada com sucesso',
        alunosRemovidos: alunosDaTurma.length,
        detalhesAlunos: alunosDaTurma
    });
};

module.exports = {
    listarTodasAsTurmas,
    criarTurma,
    buscarTurmaPorId,
    atualizarTurma,
    deletarTurma
};
