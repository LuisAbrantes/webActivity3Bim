async function buscarTurmas() {
    try {
        const response = await fetch('/turmas');
        if (!response.ok) {
            throw new Error('A resposta da rede não foi bem-sucedida');
        }
        const turmas = await response.json();

        const selectTurma = document.getElementById('turmaAluno');
        selectTurma.innerHTML = '<option value="">Todas as turmas</option>';
        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = turma.nome;
            selectTurma.appendChild(option);
        });

        let tabelaHtml = `
            <h3>Resultados - Turmas</h3>
            <table border="1" width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome da Turma</th>
                        <th>Nº de Alunos</th>
                    </tr>
                </thead>
                <tbody>`;

        turmas.forEach(turma => {
            tabelaHtml += `
                <tr>
                    <td>${turma.id}</td>
                    <td>${turma.nome}</td>
                    <td>${turma.quantidadeAlunos}</td>
                </tr>`;
        });

        tabelaHtml += '</tbody></table>';
        document.getElementById('resultadosTurmas').innerHTML = tabelaHtml;
    } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        document.getElementById('resultadosTurmas').innerHTML =
            '<p style="color: red;">Falha ao carregar as turmas.</p>';
    }
}

async function buscarAlunos(event) {
    if (event) {
        event.preventDefault();
    }

    const nome = document.getElementById('nomeAluno').value;
    const turmaId = document.getElementById('turmaAluno').value;

    // Constrói a URL da API com os parâmetros de busca (query params)
    const params = new URLSearchParams();
    if (nome) {
        params.append('nome', nome);
    }
    if (turmaId) {
        params.append('turma', turmaId);
    }
    const url = `/alunos?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('A resposta da rede não foi bem-sucedida');
        }
        const alunos = await response.json();

        // Monta o HTML da tabela de resultados dos alunos
        let tabelaHtml = `
            <h3>Resultados - Alunos</h3>
            <table border="1" width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Protocolo</th>
                        <th>Email</th>
                        <th>ID da Turma</th>
                    </tr>
                </thead>
                <tbody>`;

        if (alunos.length > 0) {
            alunos.forEach(aluno => {
                tabelaHtml += `
                    <tr>
                        <td>${aluno.id}</td>
                        <td>${aluno.nome}</td>
                        <td>${aluno.protocolo}</td>
                        <td>${aluno.email}</td>
                        <td>${aluno.id_turma}</td>
                    </tr>`;
            });
        } else {
            tabelaHtml +=
                '<tr><td colspan="5">Nenhum aluno encontrado com os filtros aplicados.</td></tr>';
        }

        tabelaHtml += '</tbody></table>';
        document.getElementById('resultadosAlunos').innerHTML = tabelaHtml;
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        document.getElementById('resultadosAlunos').innerHTML =
            '<p style="color: red;">Falha ao carregar os alunos.</p>';
    }
}

// "Escutador de eventos": Garante que o código só será executado depois que o HTML for completamente carregado.
document.addEventListener('DOMContentLoaded', () => {
    // Busca os dados iniciais assim que a página carrega
    buscarTurmas();
    buscarAlunos();

    // Adiciona as funções aos elementos HTML corretos
    document
        .getElementById('btnListarTurmas')
        .addEventListener('click', buscarTurmas);
    document
        .getElementById('formFiltroAlunos')
        .addEventListener('submit', buscarAlunos);
});
