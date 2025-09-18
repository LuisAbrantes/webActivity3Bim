const alunosModel = require('../models/alunosModel');
const turmasModel = require('../models/turmasModel');

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

const criarAluno = (req, res) => {
    const { nome, protocolo, id_turma, email } = req.body;

    // Validações básicas
    if (!nome || !protocolo || !id_turma || !email) {
        return res.status(400).json({
            erro: 'Todos os campos são obrigatórios: nome, protocolo, id_turma, email'
        });
    }

    // Verificar se a turma existe
    const turmaExiste = turmasModel.buscarTurmaPorId(id_turma);
    if (!turmaExiste) {
        return res.status(400).json({
            erro: 'Turma não encontrada'
        });
    }

    try {
        const novoAluno = alunosModel.criarAluno({
            nome,
            protocolo,
            id_turma: parseInt(id_turma),
            email
        });
        res.status(201).json(novoAluno);
    } catch (error) {
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};

const buscarAlunoPorId = (req, res) => {
    const { id } = req.params;
    const aluno = alunosModel.buscarAlunoPorId(id);

    if (!aluno) {
        return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.status(200).json(aluno);
};

const atualizarAluno = (req, res) => {
    const { id } = req.params;
    const { nome, protocolo, id_turma, email } = req.body;

    // Verificar se o aluno existe
    const alunoExistente = alunosModel.buscarAlunoPorId(id);
    if (!alunoExistente) {
        return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    // Se id_turma foi fornecido, verificar se a turma existe
    if (id_turma) {
        const turmaExiste = turmasModel.buscarTurmaPorId(id_turma);
        if (!turmaExiste) {
            return res.status(400).json({
                erro: 'Turma não encontrada'
            });
        }
    }

    const dadosAtualizados = {};
    if (nome) dadosAtualizados.nome = nome;
    if (protocolo) dadosAtualizados.protocolo = protocolo;
    if (id_turma) dadosAtualizados.id_turma = parseInt(id_turma);
    if (email) dadosAtualizados.email = email;

    try {
        const alunoAtualizado = alunosModel.atualizarAluno(
            id,
            dadosAtualizados
        );
        res.status(200).json(alunoAtualizado);
    } catch (error) {
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};

const deletarAluno = (req, res) => {
    const { id } = req.params;

    const sucesso = alunosModel.deletarAluno(id);

    if (!sucesso) {
        return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.status(200).json({ mensagem: 'Aluno deletado com sucesso' });
};

module.exports = {
    listarAlunos,
    criarAluno,
    buscarAlunoPorId,
    atualizarAluno,
    deletarAluno
};
