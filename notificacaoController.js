const NotificacaoService = require('../services/notificacaoService');

class NotificacaoController {
  constructor(notificacaoService = new NotificacaoService()) {
    this.notificacaoService = notificacaoService;
  }

  listarTodas = async (req, res) => {
    try {
      const filtros = {
        pagina: req.query.pagina,
        limite: req.query.limite,
        usuarioId: req.query.usuarioId,
        lida: req.query.lida,
      };

      const notificacoes = await this.notificacaoService.listarTodas(filtros);

      return res.status(200).json(notificacoes);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível listar as notificações.',
      });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const notificacao = await this.notificacaoService.buscarPorId(
        req.params.id
      );

      return res.status(200).json(notificacao);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível buscar a notificação.',
      });
    }
  };

  buscarPorUsuario = async (req, res) => {
    try {
      const notificacoes = await this.notificacaoService.buscarPorUsuario(
        req.params.usuarioId
      );

      return res.status(200).json(notificacoes);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem:
          erro.message || 'Não foi possível buscar as notificações do usuário.',
      });
    }
  };

  criar = async (req, res) => {
    try {
      const notificacao = await this.notificacaoService.criar(req.body);
      const io = req.app.get('io');

      if (io) {
        io.to('sala:geral').emit('notificacao:nova', notificacao);

        io.to(`usuario:${notificacao.usuarioId}`).emit(
          'notificacao:nova',
          notificacao
        );
      }

      return res.status(201).json(notificacao);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível criar a notificação.',
      });
    }
  };

  atualizar = async (req, res) => {
    try {
      const notificacaoAnterior =
        await this.notificacaoService.buscarPorId(req.params.id);

      const notificacao = await this.notificacaoService.atualizar(
        req.params.id,
        req.body
      );

      const io = req.app.get('io');

      if (io && notificacao.lida && !notificacaoAnterior?.lida) {
        io.to('sala:geral').emit('notificacao:lida', notificacao);

        io.to(`usuario:${notificacao.usuarioId}`).emit(
          'notificacao:lida',
          notificacao
        );
      }

      return res.status(200).json(notificacao);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível atualizar a notificação.',
      });
    }
  };

  excluir = async (req, res) => {
    try {
      await this.notificacaoService.excluir(req.params.id);

      return res.status(204).send();
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível excluir a notificação.',
      });
    }
  };
}

module.exports = NotificacaoController;