
const socket = io();

const elementos = {
  conexao: document.getElementById('indicadorConexao'),
  textoConexao: document.getElementById('textoConexao'),
  totalEquipamentos: document.getElementById('totalEquipamentos'),
  totalPendentes: document.getElementById('totalPendentes'),
  totalAndamento: document.getElementById('totalAndamento'),
  totalNotificacoes: document.getElementById('totalNotificacoes'),
  listaEmprestimos: document.getElementById('listaEmprestimos'),
  listaNotificacoes: document.getElementById('listaNotificacoes'),
  mensagemEmprestimos: document.getElementById('mensagemEmprestimos'),
  mensagemNotificacoes: document.getElementById('mensagemNotificacoes'),
  botaoAtualizar: document.getElementById('botaoAtualizar'),
};

let usuarioId = null;

function mostrarConexao(conectado) {
  elementos.conexao.classList.toggle('online', conectado);
  elementos.conexao.classList.toggle('offline', !conectado);

  elementos.textoConexao.textContent = conectado
    ? 'Conectado em tempo real'
    : 'Desconectado';
}

async function buscarDados(url) {
  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(`Erro ao consultar ${url}: ${resposta.status}`);
  }

  return resposta.json();
}

function obterLista(resultado) {
  if (Array.isArray(resultado)) {
    return resultado;
  }

  if (resultado && Array.isArray(resultado.dados)) {
    return resultado.dados;
  }

  return [];
}

function formatarData(data) {
  if (!data) {
    return 'Não informada';
  }

  const dataFormatada = new Date(data);

  if (Number.isNaN(dataFormatada.getTime())) {
    return 'Data inválida';
  }

  return dataFormatada.toLocaleDateString('pt-BR');
}

function criarCelula(texto) {
  const celula = document.createElement('td');
  celula.textContent = texto ?? '—';
  return celula;
}

function mostrarEmprestimos(emprestimos) {
  elementos.listaEmprestimos.replaceChildren();

  if (emprestimos.length === 0) {
    elementos.mensagemEmprestimos.textContent =
      'Nenhum empréstimo encontrado.';
    return;
  }

  elementos.mensagemEmprestimos.textContent = '';

  emprestimos.forEach((emprestimo) => {
    const linha = document.createElement('tr');

    const usuario = emprestimo.usuario?.nome || 'Usuário';
    const equipamento = emprestimo.equipamento?.nome || 'Equipamento';

    linha.appendChild(criarCelula(emprestimo.id));
    linha.appendChild(criarCelula(usuario));
    linha.appendChild(criarCelula(equipamento));

    const celulaStatus = document.createElement('td');
    const etiqueta = document.createElement('span');

    etiqueta.className = 'status';
    etiqueta.textContent = emprestimo.status || 'Não informado';

    celulaStatus.appendChild(etiqueta);
    linha.appendChild(celulaStatus);

    linha.appendChild(
      criarCelula(formatarData(emprestimo.dataPrevistaDevolucao))
    );

    elementos.listaEmprestimos.appendChild(linha);
  });
}

function mostrarNotificacoes(notificacoes) {
  elementos.listaNotificacoes.replaceChildren();

  if (notificacoes.length === 0) {
    elementos.mensagemNotificacoes.textContent =
      'Nenhuma notificação encontrada.';
    return;
  }

  elementos.mensagemNotificacoes.textContent = '';

  notificacoes.slice(0, 10).forEach((notificacao) => {
    const item = document.createElement('li');
    const mensagem = document.createElement('p');

    mensagem.textContent =
      `${notificacao.lida ? 'Lida' : 'Não lida'}: ${
        notificacao.mensagem || 'Nova notificação'
      }`;

    item.appendChild(mensagem);

    if (!notificacao.lida) {
      const botao = document.createElement('button');

      botao.type = 'button';
      botao.textContent = 'Marcar como lida';

      botao.addEventListener('click', async () => {
        botao.disabled = true;
        botao.textContent = 'Salvando...';

        try {
          const resposta = await fetch(
            `/notificacoes/${notificacao.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ lida: true }),
            }
          );

          if (!resposta.ok) {
            const detalhe = await resposta.text();
            throw new Error(
              `Erro HTTP ${resposta.status}: ${detalhe}`
            );
          }

          // Atualiza o painel com os dados salvos na API.
          await carregarPainel();

        } catch (erro) {
          console.error(
            'Erro ao marcar notificação como lida:',
            erro
          );

          alert(
            'Não foi possível marcar a notificação como lida. Verifique o terminal da API.'
          );

          botao.disabled = false;
          botao.textContent = 'Marcar como lida';
        }
      });

      item.appendChild(botao);
    }

    elementos.listaNotificacoes.appendChild(item);
  });
}

async function carregarPainel() {
  elementos.mensagemEmprestimos.textContent =
    'Carregando empréstimos...';

  elementos.mensagemNotificacoes.textContent =
    'Carregando notificações...';

  try {
    const [
      resultadoEquipamentos,
      resultadoEmprestimos,
      resultadoNotificacoes,
    ] = await Promise.all([
      buscarDados('/equipamentos?pagina=1&limite=100'),
      buscarDados('/emprestimos?pagina=1&limite=100'),
      buscarDados('/notificacoes?pagina=1&limite=100'),
    ]);

    const equipamentos = obterLista(resultadoEquipamentos);
    const emprestimos = obterLista(resultadoEmprestimos);
    const notificacoes = obterLista(resultadoNotificacoes);

    elementos.totalEquipamentos.textContent =
      resultadoEquipamentos.paginacao?.total ??
      equipamentos.length;

    elementos.totalPendentes.textContent =
      emprestimos.filter(
        (emprestimo) => emprestimo.status === 'PENDENTE'
      ).length;

    elementos.totalAndamento.textContent =
      emprestimos.filter(
        (emprestimo) => emprestimo.status === 'RETIRADO'
      ).length;

    elementos.totalNotificacoes.textContent =
      notificacoes.filter(
        (notificacao) => !notificacao.lida
      ).length;

    mostrarEmprestimos(emprestimos);
    mostrarNotificacoes(notificacoes);

  } catch (erro) {
    console.error('Erro ao carregar o painel:', erro);

    elementos.mensagemEmprestimos.textContent =
      'Não foi possível carregar os dados. Verifique se a API está funcionando.';

    elementos.mensagemNotificacoes.textContent =
      'Não foi possível carregar as notificações.';
  }
}

socket.on('connect', () => {
  mostrarConexao(true);

  if (usuarioId) {
    socket.emit('entrar:usuario', { usuarioId });
  }

  socket.emit('sincronizar:solicitar', (resposta) => {
    if (resposta?.sucesso) {
      carregarPainel();
    }
  });
});

socket.on('disconnect', () => {
  mostrarConexao(false);
});

socket.on('connect_error', (erro) => {
  console.error(
    'Erro na conexão em tempo real:',
    erro.message
  );

  mostrarConexao(false);
});

socket.on('emprestimo:criado', carregarPainel);
socket.on('emprestimo:atualizado', carregarPainel);
socket.on('emprestimo:excluido', carregarPainel);
socket.on('equipamento:atualizado', carregarPainel);
socket.on('notificacao:nova', carregarPainel);
socket.on('notificacao:lida', carregarPainel);

elementos.botaoAtualizar.addEventListener(
  'click',
  carregarPainel
);

// Carrega os dados antes mesmo de o WebSocket conectar.
carregarPainel();
