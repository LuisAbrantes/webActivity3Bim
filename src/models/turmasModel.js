let turmas = [
    { id: 1, nome: 'INFO1' },
    { id: 2, nome: 'ADS2' },
    { id: 3, nome: 'INFO2' }
];

const alunosModel = require('./alunosModel');

const listarTodasAsTurmas = () => {
    const todosAlunos = alunosModel.listarTodosOsAlunos();
    return turmas.map(turma => {
        const quantidadeAlunos = todosAlunos.filter(
            aluno => aluno.id_turma === turma.id
        ).length;
        return { ...turma, quantidadeAlunos };
    });
};

const criarTurma = dadosTurma => {
    const novoId = Math.max(...turmas.map(t => t.id)) + 1;
    const novaTurma = { id: novoId, ...dadosTurma };
    turmas.push(novaTurma);
    return novaTurma;
};

const buscarTurmaPorId = id => {
    return turmas.find(turma => turma.id === parseInt(id));
};

const atualizarTurma = (id, dadosAtualizados) => {
    const index = turmas.findIndex(turma => turma.id === parseInt(id));
    if (index === -1) return null;

    turmas[index] = { ...turmas[index], ...dadosAtualizados };
    return turmas[index];
};

const deletarTurma = id => {
    const index = turmas.findIndex(turma => turma.id === parseInt(id));
    if (index === -1) return false;

    // Antes de deletar a turma, deletamos todos os alunos dessa turma
    alunosModel.deletarAlunosPorTurma(id);

    turmas.splice(index, 1);
    return true;
};

module.exports = {
    listarTodasAsTurmas,
    criarTurma,
    buscarTurmaPorId,
    atualizarTurma,
    deletarTurma
};
