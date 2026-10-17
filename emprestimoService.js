
const EmprestimoRepository = require('../repositories/emprestimoRepository');
const UsuarioRepository = require('../repositories/usuarioRepository');
const EquipamentoRepository = require('../repositories/equipamentoRepository');
const NotificacaoRepository = require('../repositories/notificacaoRepository');
const EmprestimoDomain = require('../domain/emprestimo');

class EmprestimoService {
  constructor(
    emprestimoRepository = new EmprestimoRepository(),
    usuarioRepository = new UsuarioRepository(),
    equipamentoRepository = new EquipamentoRepository(),
    notificacaoRepository = new NotificacaoRepository()
  ) {
    this.emprestimoRepository = emprestimoRepository;
    this.usuarioRepository = usuarioRepository;
    this.equipamentoRepository = equipamentoRepository;
    this.notificacaoRepository = notificacaoRepository;
  }

  async listarTodos(filtros = {}) {
    return this.emprestimoRepository.listarTodos(filtros);
  }

  async buscarPorId(id) {
    const emprestimo = await this.emprestimoRepository.buscarPorId(id);

    if (!emprestimo) {
      const erro = new Error('Empréstimo não encontrado.');
      erro.status = 404;
      throw erro;
    }

    return emprestimo;
  }

  async criar(dados) {
    if (
      !dados.usuarioId ||
      !dados.equipamentoId ||
      !dados.dataPrevistaDevolucao
    ) {
      const erro = new Error(
        'Usuário, equipamento e data prevista de devolução são obrigatórios.'
      );
      erro.status = 400;
      throw erro;
    }

    const usuario = await this.usuarioRepository.buscarPorId(
      dados.usuarioId
    );

    if (!usuario) {
      const erro = new Error('Usuário não encontrado.');
      erro.status = 404;
      throw erro;
    }

    const equipamento = await this.equipamentoRepository.buscarPorId(
      dados.equipamentoId
    );

    if (!equipamento) {
      const erro = new Error('Equipamento não encontrado.');
      erro.status = 404;
      throw erro;
    }

    if (equipamento.status !== 'DISPONIVEL') {
      const erro = new Error(
        'O equipamento não está disponível para empréstimo.'
      );
      erro.status = 409;
      throw erro;
    }

    const dataPrevista = new Date(dados.dataPrevistaDevolucao);

    if (Number.isNaN(dataPrevista.getTime())) {
      const erro = new Error('Data prevista de devolução inválida.');
      erro.status = 400;
      throw erro;
    }

    return this.emprestimoRepository.executarTransacao(async (transacao) => {
      const emprestimo = await this.emprestimoRepository.criar(
        {
          usuarioId: Number(dados.usuarioId),
          equipamentoId: Number(dados.equipamentoId),
          dataPrevistaDevolucao: dataPrevista,
          status: 'PENDENTE',
        },
        transacao
      );

      await this.notificacaoRepository.criar(
        {
          usuarioId: Number(dados.usuarioId),
          emprestimoId: emprestimo.id,
          titulo: 'Empréstimo registrado',
          mensagem: `Seu pedido de empréstimo do equipamento ${equipamento.nome} foi registrado e está pendente.`,
          lida: false,
        },
        transacao
      );

      return emprestimo;
    });
  }

  async atualizar(id, dados) {
    const emprestimoAtual = await this.buscarPorId(id);
    const dadosAtualizados = {};

    if (dados.dataPrevistaDevolucao !== undefined) {
      const dataPrevista = new Date(dados.dataPrevistaDevolucao);

      if (Number.isNaN(dataPrevista.getTime())) {
        const erro = new Error('Data prevista de devolução inválida.');
        erro.status = 400;
        throw erro;
      }

      dadosAtualizados.dataPrevistaDevolucao = dataPrevista;
    }

    if (dados.status !== undefined) {
      if (!EmprestimoDomain.validarStatus(dados.status)) {
        const erro = new Error('Status do empréstimo inválido.');
        erro.status = 400;
        throw erro;
      }

      if (
        !EmprestimoDomain.podeAlterarStatus(
          emprestimoAtual.status,
          dados.status
        )
      ) {
        const erro = new Error(
          'Não é possível alterar um empréstimo já finalizado.'
        );
        erro.status = 400;
        throw erro;
      }

      dadosAtualizados.status = dados.status;

      if (dados.status === 'DEVOLVIDO') {
        dadosAtualizados.dataDevolucao = new Date();
      }
    }

    if (dados.usuarioId !== undefined) {
      const usuario = await this.usuarioRepository.buscarPorId(
        dados.usuarioId
      );

      if (!usuario) {
        const erro = new Error('Usuário não encontrado.');
        erro.status = 404;
        throw erro;
      }

      dadosAtualizados.usuarioId = Number(dados.usuarioId);
    }

    if (dados.equipamentoId !== undefined) {
      const equipamento = await this.equipamentoRepository.buscarPorId(
        dados.equipamentoId
      );

      if (!equipamento) {
        const erro = new Error('Equipamento não encontrado.');
        erro.status = 404;
        throw erro;
      }

      dadosAtualizados.equipamentoId = Number(dados.equipamentoId);
    }

    return this.emprestimoRepository.executarTransacao(async (transacao) => {
      const emprestimoAtualizado =
        await this.emprestimoRepository.atualizar(
          id,
          dadosAtualizados,
          transacao
        );

      if (
        dados.status !== undefined &&
        dados.status !== emprestimoAtual.status
      ) {
        const equipamentoId =
          dadosAtualizados.equipamentoId ?? emprestimoAtual.equipamentoId;

        if (dados.status === 'RETIRADO') {
          const equipamento =
            await this.equipamentoRepository.buscarPorId(
              equipamentoId,
              transacao
            );

          if (!equipamento) {
            const erro = new Error('Equipamento não encontrado.');
            erro.status = 404;
            throw erro;
          }

          if (equipamento.status !== 'DISPONIVEL') {
            const erro = new Error(
              'O equipamento não está disponível para retirada.'
            );
            erro.status = 409;
            throw erro;
          }

          await this.equipamentoRepository.atualizar(
            equipamentoId,
            { status: 'EMPRESTADO' },
            transacao
          );
        }

        if (
          ['DEVOLVIDO', 'CANCELADO'].includes(dados.status) &&
          emprestimoAtual.status === 'RETIRADO'
        ) {
          await this.equipamentoRepository.atualizar(
            equipamentoId,
            { status: 'DISPONIVEL' },
            transacao
          );
        }

        const mensagens = {
          APROVADO: 'Seu pedido de empréstimo foi aprovado.',
          RETIRADO:
            'O equipamento foi retirado e o empréstimo está em andamento.',
          DEVOLVIDO: 'A devolução do equipamento foi registrada.',
          CANCELADO: 'O empréstimo foi cancelado.',
          PENDENTE: 'O empréstimo voltou para o status pendente.',
        };

        await this.notificacaoRepository.criar(
          {
            usuarioId: emprestimoAtualizado.usuarioId,
            emprestimoId: emprestimoAtualizado.id,
            titulo: 'Atualização do empréstimo',
            mensagem: mensagens[dados.status],
            lida: false,
          },
          transacao
        );
      }

      return emprestimoAtualizado;
    });
  }

  async excluir(id) {
    const emprestimo = await this.buscarPorId(id);

    if (emprestimo.status === 'RETIRADO') {
      const erro = new Error(
        'Não é possível excluir um empréstimo enquanto o equipamento estiver retirado.'
      );
      erro.status = 409;
      throw erro;
    }

    return this.emprestimoRepository.excluir(id);
  }
}

module.exports = EmprestimoService;
