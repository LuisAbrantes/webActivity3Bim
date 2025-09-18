const API_BASE = '';

let turmas = [];
let alunos = [];

async function handleResponse(response) {
    if (!response.ok) {
        const text = await response.text();
        let error = 'Erro no servidor';
        try {
            const json = JSON.parse(text);
            error = json.error || json.erro || error;
        } catch (e) {
            error = `Erro ${response.status}: ${text}`;
        }
        throw new Error(error);
    }

    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error('Resposta inválida do servidor');
    }
}

window.addEventListener('load', function () {
    carregarTurmas();
    carregarAlunos();
});

// === TURMAS ===

async function criarTurma() {
    const nome = document.getElementById('turmaNome').value.trim();

    if (!nome) {
        mostrarMensagem(
            'turmaMessage',
            'Por favor, digite o nome da turma',
            'error'
        );
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/turmas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome })
        });

        await handleResponse(response);
        mostrarMensagem('turmaMessage', 'Turma criada com sucesso!', 'success');
        document.getElementById('turmaNome').value = '';
        carregarTurmas();
    } catch (error) {
        mostrarMensagem('turmaMessage', error.message, 'error');
    }
}

async function carregarTurmas() {
    try {
        const response = await fetch(`${API_BASE}/turmas`);
        turmas = (await handleResponse(response)) || [];

        exibirTurmas();
        atualizarSelectTurmas();
    } catch (error) {
        console.error('Erro ao carregar turmas:', error);
        turmas = [];
    }
}
function exibirTurmas() {
    const tabela = document.getElementById('turmasTable');

    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }

    turmas.forEach(turma => {
        const row = tabela.insertRow();
        row.innerHTML = `
            <td>${turma.id}</td>
            <td>${turma.nome}</td>
            <td>
                <button onclick="editarTurma(${turma.id})">Editar</button>
                <button onclick="excluirTurma(${turma.id})">Excluir</button>
            </td>
        `;
    });
}

async function carregarAlunos() {
    try {
        const response = await fetch(`${API_BASE}/alunos`);
        alunos = (await handleResponse(response)) || [];

        exibirAlunos();
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        alunos = [];
    }
}
function exibirAlunos() {
    const tabela = document.getElementById('alunosTable');

    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }

    alunos.forEach(aluno => {
        const turma = turmas.find(t => t.id === aluno.id_turma);
        const nomeTurma = turma ? turma.nome : 'N/A';

        const row = tabela.insertRow();
        row.innerHTML = `
            <td>${aluno.id}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.protocolo}</td>
            <td>${aluno.email}</td>
            <td>${nomeTurma}</td>
            <td>
                <button onclick="editarAluno(${aluno.id})">Editar</button>
                <button onclick="excluirAluno(${aluno.id})">Excluir</button>
            </td>
        `;
    });
}

function atualizarSelectTurmas() {
    const select = document.getElementById('alunoTurma');

    select.innerHTML = '<option value="">Selecione uma turma</option>';

    turmas.forEach(turma => {
        const option = document.createElement('option');
        option.value = turma.id;
        option.textContent = turma.nome;
        select.appendChild(option);
    });
}

function mostrarMensagem(elementId, mensagem, tipo) {
    const elemento = document.getElementById(elementId);
    elemento.textContent = mensagem;
    elemento.style.color = tipo === 'success' ? 'green' : 'red';
    elemento.style.fontWeight = 'bold';

    setTimeout(() => {
        elemento.textContent = '';
    }, 3000);
}

function atualizarSelectsTurma(turmas) {
    const selects = ['turmaAluno', 'turmaAlunoModal'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const isModalSelect = selectId === 'turmaAlunoModal';

        select.innerHTML = isModalSelect
            ? '<option value="">Selecione uma turma</option>'
            : '<option value="">Todas as turmas</option>';

        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = turma.nome;
            select.appendChild(option);
        });
    });
}

async function salvarTurma(event) {
    event.preventDefault();

    const nome = document.getElementById('nomeTurma').value;

    try {
        const url = turmaEditandoId ? `/turmas/${turmaEditandoId}` : '/turmas';
        const method = turmaEditandoId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome })
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar turma');
        }

        fecharModalTurma();
        buscarTurmas();

        alert(
            turmaEditandoId
                ? 'Turma atualizada com sucesso!'
                : 'Turma criada com sucesso!'
        );
    } catch (error) {
        console.error('Erro ao salvar turma:', error);
        alert('Erro ao salvar turma. Tente novamente.');
    }
}

function novaTurma() {
    turmaEditandoId = null;
    document.getElementById('tituloModalTurma').textContent = 'Nova Turma';
    document.getElementById('nomeTurma').value = '';
    document.getElementById('modalTurma').style.display = 'block';
}

function editarTurma(id, nome) {
    turmaEditandoId = id;
    document.getElementById('tituloModalTurma').textContent = 'Editar Turma';
    document.getElementById('nomeTurma').value = nome;
    document.getElementById('modalTurma').style.display = 'block';
}

async function deletarTurma(id, nome) {
    if (
        confirm(
            `Tem certeza que deseja excluir a turma "${nome}"?\n\nATENÇÃO: Todos os alunos desta turma também serão removidos!`
        )
    ) {
        try {
            const response = await fetch(`/turmas/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar turma');
            }

            const resultado = await response.json();
            buscarTurmas();
            buscarAlunos();

            alert(
                `Turma deletada com sucesso!\nAlunos removidos: ${resultado.alunosRemovidos}`
            );
        } catch (error) {
            console.error('Erro ao deletar turma:', error);
            alert('Erro ao deletar turma. Tente novamente.');
        }
    }
}

function fecharModalTurma() {
    document.getElementById('modalTurma').style.display = 'none';
    turmaEditandoId = null;
}

// ============== ALUNOS ==============

async function buscarAlunos(event) {
    if (event) {
        event.preventDefault();
    }

    const nome = document.getElementById('nomeAluno').value;
    const turmaId = document.getElementById('turmaAluno').value;

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

        let tabelaHtml = `
            <h3>Alunos Cadastrados</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Protocolo</th>
                        <th>Email</th>
                        <th>Turma</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>`;

        if (alunos.length > 0) {
            alunos.forEach(aluno => {
                const nomeTurma =
                    todasAsTurmas.find(t => t.id === aluno.id_turma)?.nome ||
                    'Turma não encontrada';
                tabelaHtml += `
                    <tr>
                        <td>${aluno.id}</td>
                        <td>${aluno.nome}</td>
                        <td>${aluno.protocolo}</td>
                        <td>${aluno.email}</td>
                        <td>${nomeTurma}</td>
                        <td>
                            <button class="btn-warning" onclick="editarAluno(${aluno.id})">Editar</button>
                            <button class="btn-danger" onclick="deletarAluno(${aluno.id}, '${aluno.nome}')">Excluir</button>
                        </td>
                    </tr>`;
            });
        } else {
            tabelaHtml +=
                '<tr><td colspan="6">Nenhum aluno encontrado com os filtros aplicados.</td></tr>';
        }

        tabelaHtml += '</tbody></table>';
        document.getElementById('resultadosAlunos').innerHTML = tabelaHtml;
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        document.getElementById('resultadosAlunos').innerHTML =
            '<p style="color: red;">Falha ao carregar os alunos.</p>';
    }
}

async function salvarAluno(event) {
    event.preventDefault();

    const nome = document.getElementById('nomeAlunoModal').value;
    const protocolo = document.getElementById('protocoloAluno').value;
    const email = document.getElementById('emailAluno').value;
    const id_turma = parseInt(document.getElementById('turmaAlunoModal').value);

    try {
        const url = alunoEditandoId ? `/alunos/${alunoEditandoId}` : '/alunos';
        const method = alunoEditandoId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, protocolo, email, id_turma })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.erro || 'Erro ao salvar aluno');
        }

        fecharModalAluno();
        buscarAlunos();
        buscarTurmas();
        alert(
            alunoEditandoId
                ? 'Aluno atualizado com sucesso!'
                : 'Aluno criado com sucesso!'
        );
    } catch (error) {
        console.error('Erro ao salvar aluno:', error);
        alert('Erro ao salvar aluno: ' + error.message);
    }
}

function novoAluno() {
    alunoEditandoId = null;
    document.getElementById('tituloModalAluno').textContent = 'Novo Aluno';
    document.getElementById('formAluno').reset();
    document.getElementById('modalAluno').style.display = 'block';
}

async function editarAluno(id) {
    try {
        const response = await fetch(`/alunos/${id}`);
        if (!response.ok) {
            throw new Error('Aluno não encontrado');
        }

        const aluno = await response.json();

        alunoEditandoId = id;
        document.getElementById('tituloModalAluno').textContent =
            'Editar Aluno';
        document.getElementById('nomeAlunoModal').value = aluno.nome;
        document.getElementById('protocoloAluno').value = aluno.protocolo;
        document.getElementById('emailAluno').value = aluno.email;
        document.getElementById('turmaAlunoModal').value = aluno.id_turma;
        document.getElementById('modalAluno').style.display = 'block';
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        alert('Erro ao carregar dados do aluno.');
    }
}

async function deletarAluno(id, nome) {
    if (confirm(`Tem certeza que deseja excluir o aluno "${nome}"?`)) {
        try {
            const response = await fetch(`/alunos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar aluno');
            }

            buscarAlunos();
            buscarTurmas(); // Atualizar contagem

            alert('Aluno deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar aluno:', error);
            alert('Erro ao deletar aluno. Tente novamente.');
        }
    }
}

function fecharModalAluno() {
    document.getElementById('modalAluno').style.display = 'none';
    alunoEditandoId = null;
}

// ========= LISTENERS ==============

async function criarAluno() {
    const nome = document.getElementById('alunoNome').value.trim();
    const protocolo = document.getElementById('alunoProtocolo').value.trim();
    const email = document.getElementById('alunoEmail').value.trim();
    const turmaId = document.getElementById('alunoTurma').value;

    if (!nome || !protocolo || !email || !turmaId) {
        mostrarMensagem(
            'alunoMessage',
            'Por favor, preencha todos os campos',
            'error'
        );
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/alunos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome,
                protocolo,
                email,
                id_turma: parseInt(turmaId)
            })
        });

        await handleResponse(response);
        mostrarMensagem('alunoMessage', 'Aluno criado com sucesso!', 'success');
        document.getElementById('alunoNome').value = '';
        document.getElementById('alunoProtocolo').value = '';
        document.getElementById('alunoEmail').value = '';
        document.getElementById('alunoTurma').value = '';
        carregarAlunos();
    } catch (error) {
        mostrarMensagem('alunoMessage', error.message, 'error');
    }
}

function editarTurma(id) {
    const turma = turmas.find(t => t.id === id);
    if (!turma) return;

    document.getElementById('editTurmaId').value = turma.id;
    document.getElementById('editTurmaNome').value = turma.nome;
    document.getElementById('editTurmaModal').style.display = 'block';
}

async function atualizarTurma() {
    const id = document.getElementById('editTurmaId').value;
    const nome = document.getElementById('editTurmaNome').value.trim();

    if (!nome) {
        alert('Por favor, digite o nome da turma');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/turmas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome })
        });

        const result = await response.json();

        if (response.ok) {
            mostrarMensagem(
                'turmaMessage',
                'Turma atualizada com sucesso!',
                'success'
            );
            fecharModal('editTurmaModal');
            carregarTurmas();
        } else {
            alert(result.error || 'Erro ao atualizar turma');
        }
    } catch (error) {
        alert('Erro de conexão: ' + error.message);
    }
}

async function excluirTurma(id) {
    if (
        !confirm(
            'Tem certeza que deseja excluir esta turma? Todos os alunos desta turma também serão excluídos!'
        )
    ) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/turmas/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            mostrarMensagem(
                'turmaMessage',
                'Turma excluída com sucesso!',
                'success'
            );
            carregarTurmas();
            carregarAlunos();
        } else {
            mostrarMensagem(
                'turmaMessage',
                result.error || 'Erro ao excluir turma',
                'error'
            );
        }
    } catch (error) {
        mostrarMensagem(
            'turmaMessage',
            'Erro de conexão: ' + error.message,
            'error'
        );
    }
}

function editarAluno(id) {
    const aluno = alunos.find(a => a.id === id);
    if (!aluno) return;

    document.getElementById('editAlunoId').value = aluno.id;
    document.getElementById('editAlunoNome').value = aluno.nome;
    document.getElementById('editAlunoProtocolo').value = aluno.protocolo;
    document.getElementById('editAlunoEmail').value = aluno.email;

    atualizarSelectTurmasModal();
    document.getElementById('editAlunoTurma').value = aluno.id_turma;

    document.getElementById('editAlunoModal').style.display = 'block';
}

async function atualizarAluno() {
    const id = document.getElementById('editAlunoId').value;
    const nome = document.getElementById('editAlunoNome').value.trim();
    const protocolo = document
        .getElementById('editAlunoProtocolo')
        .value.trim();
    const email = document.getElementById('editAlunoEmail').value.trim();
    const turmaId = document.getElementById('editAlunoTurma').value;

    if (!nome || !protocolo || !email || !turmaId) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/alunos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome,
                protocolo,
                email,
                id_turma: parseInt(turmaId)
            })
        });

        const result = await response.json();

        if (response.ok) {
            mostrarMensagem(
                'alunoMessage',
                'Aluno atualizado com sucesso!',
                'success'
            );
            fecharModal('editAlunoModal');
            carregarAlunos();
        } else {
            alert(result.error || 'Erro ao atualizar aluno');
        }
    } catch (error) {
        alert('Erro de conexão: ' + error.message);
    }
}

async function excluirAluno(id) {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/alunos/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            mostrarMensagem(
                'alunoMessage',
                'Aluno excluído com sucesso!',
                'success'
            );
            carregarAlunos();
        } else {
            mostrarMensagem(
                'alunoMessage',
                result.error || 'Erro ao excluir aluno',
                'error'
            );
        }
    } catch (error) {
        mostrarMensagem(
            'alunoMessage',
            'Erro de conexão: ' + error.message,
            'error'
        );
    }
}

function atualizarSelectTurmasModal() {
    const select = document.getElementById('editAlunoTurma');

    select.innerHTML = '<option value="">Selecione uma turma</option>';

    turmas.forEach(turma => {
        const option = document.createElement('option');
        option.value = turma.id;
        option.textContent = turma.nome;
        select.appendChild(option);
    });
}

function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
