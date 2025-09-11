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

module.exports = {
    listarTodosOsAlunos
};
