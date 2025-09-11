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

module.exports = {
    listarTodasAsTurmas
};
