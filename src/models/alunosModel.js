let alunos = [
    {
        id: 1,
        nome: 'Luis Abrantes',
        protocolo: '112233',
        id_turma: 1,
        email: 'luis.abrantes@email.com'
    },
    {
        id: 2,
        nome: 'Ana Clara',
        protocolo: '445566',
        id_turma: 2,
        email: 'ana.clara@email.com'
    },
    {
        id: 3,
        nome: 'Pedro Silva',
        protocolo: '778899',
        id_turma: 1,
        email: 'pedro.silva@email.com'
    },
    {
        id: 4,
        nome: 'Mariana Costa',
        protocolo: '101112',
        id_turma: 3,
        email: 'mariana.costa@email.com'
    },
    {
        id: 5,
        nome: 'Luis Pereira',
        protocolo: '131415',
        id_turma: 2,
        email: 'luis.pereira@email.com'
    }
];

const listarTodosOsAlunos = () => alunos;

const criarAluno = dadosAluno => {
    const novoId = Math.max(...alunos.map(a => a.id)) + 1;
    const novoAluno = { id: novoId, ...dadosAluno };
    alunos.push(novoAluno);
    return novoAluno;
};

const buscarAlunoPorId = id => {
    return alunos.find(aluno => aluno.id === parseInt(id));
};

const atualizarAluno = (id, dadosAtualizados) => {
    const index = alunos.findIndex(aluno => aluno.id === parseInt(id));
    if (index === -1) return null;

    alunos[index] = { ...alunos[index], ...dadosAtualizados };
    return alunos[index];
};

const deletarAluno = id => {
    const index = alunos.findIndex(aluno => aluno.id === parseInt(id));
    if (index === -1) return false;

    alunos.splice(index, 1);
    return true;
};

const deletarAlunosPorTurma = id_turma => {
    const alunosRemovidos = alunos.filter(
        aluno => aluno.id_turma === parseInt(id_turma)
    );
    alunos = alunos.filter(aluno => aluno.id_turma !== parseInt(id_turma));
    return alunosRemovidos;
};

const listarAlunosPorTurma = id_turma => {
    return alunos.filter(aluno => aluno.id_turma === parseInt(id_turma));
};

module.exports = {
    listarTodosOsAlunos,
    criarAluno,
    buscarAlunoPorId,
    atualizarAluno,
    deletarAluno,
    deletarAlunosPorTurma,
    listarAlunosPorTurma
};
