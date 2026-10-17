
const NotificacaoRepository = require('../repositories/notificacaoRepository');
const UsuarioRepository = require('../repositories/usuarioRepository');
const EmprestimoRepository = require('../repositories/emprestimoRepository');

class NotificacaoService {
  constructor(
    notificacaoRepository = new NotificacaoRepository(),
    usuarioRepository = new UsuarioRepository(),
    emprestimoRepository = new EmprestimoRepository()
  ) {
    this.notificacaoRepository = notificacaoRepository;
    this.usuarioRepository = usuarioRepository;
    this.emprestimoRepository = emprestimoRepository;
  }

  async listarTodas(filtros = {}) {
    return this.notificacaoRepository.listarTodas(filtros);
  }

  async buscarPorId(id) {
    const notificacao = await this.notificacaoRepository.buscarPorId(id);

    if (!notificacao) {
      const erro = new Error('Notificação não encontrada.');
      erro.status = 404;
      throw erro;
    }

    return notificacao;
  }

  async buscarPorUsuario(usuarioId) {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      const erro = new Error('Usuário não encontrado.');
      erro.status = 404;
      throw erro;
    }

    return this.notificacaoRepository.buscarPorUsuario(usuarioId);
  }

  async criar(dados) {
    if (!dados.usuarioId || !dados.titulo || !dados.mensagem) {
      const erro = new Error(
        'Usuário, título e mensagem são obrigatórios.'
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

    if (dados.emprestimoId !== undefined && dados.emprestimoId !== null) {
      const emprestimo = await this.emprestimoRepository.buscarPorId(
        dados.emprestimoId
      );

      if (!emprestimo) {
        const erro = new Error('Empréstimo não encontrado.');
        erro.status = 404;
        throw erro;
      }
    }

    return this.notificacaoRepository.criar({
      usuarioId: Number(dados.usuarioId),
      emprestimoId:
        dados.emprestimoId !== undefined && dados.emprestimoId !== null
          ? Number(dados.emprestimoId)
          : null,
      titulo: dados.titulo.trim(),
      mensagem: dados.mensagem.trim(),
      lida: false,
    });
  }

  async atualizar(id, dados) {
    await this.buscarPorId(id);

    const dadosAtualizados = {};

    if (dados.titulo !== undefined) {
      if (!dados.titulo.trim()) {
        const erro = new Error('O título não pode ficar vazio.');
        erro.status = 400;
        throw erro;
      }

      dadosAtualizados.titulo = dados.titulo.trim();
    }

    if (dados.mensagem !== undefined) {
      if (!dados.mensagem.trim()) {
        const erro = new Error('A mensagem não pode ficar vazia.');
        erro.status = 400;
        throw erro;
      }

      dadosAtualizados.mensagem = dados.mensagem.trim();
    }

    if (dados.lida !== undefined) {
      if (typeof dados.lida !== 'boolean') {
        const erro = new Error(
          'O campo lida deve ser verdadeiro ou falso.'
        );
        erro.status = 400;
        throw erro;
      }

      dadosAtualizados.lida = dados.lida;
    }

    return this.notificacaoRepository.atualizar(id, dadosAtualizados);
  }

  async excluir(id) {
    await this.buscarPorId(id);

    return this.notificacaoRepository.excluir(id);
  }
}

module.exports = NotificacaoService;