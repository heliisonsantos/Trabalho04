const EmprestimoService = require('../services/emprestimoService');

class EmprestimoController {
  constructor(emprestimoService = new EmprestimoService()) {
    this.emprestimoService = emprestimoService;
  }

  listarTodos = async (req, res) => {
    try {
      const filtros = {
        pagina: req.query.pagina,
        limite: req.query.limite,
        usuarioId: req.query.usuarioId,
        equipamentoId: req.query.equipamentoId,
        status: req.query.status,
      };

      const emprestimos = await this.emprestimoService.listarTodos(filtros);

      return res.status(200).json(emprestimos);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível listar os empréstimos.',
      });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const emprestimo = await this.emprestimoService.buscarPorId(
        req.params.id
      );

      return res.status(200).json(emprestimo);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível buscar o empréstimo.',
      });
    }
  };

  criar = async (req, res) => {
    try {
      const emprestimo = await this.emprestimoService.criar(req.body);
      const io = req.app.get('io');

      if (io) {
        io.to('sala:geral').emit('emprestimo:criado', emprestimo);

        io.to(`usuario:${emprestimo.usuarioId}`).emit(
          'notificacao:nova',
          {
            emprestimoId: emprestimo.id,
            mensagem: 'Seu pedido de empréstimo foi registrado.',
          }
        );
      }

      return res.status(201).json(emprestimo);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível criar o empréstimo.',
      });
    }
  };

  atualizar = async (req, res) => {
    try {
      const emprestimo = await this.emprestimoService.atualizar(
        req.params.id,
        req.body
      );
      const io = req.app.get('io');

      if (io) {
        io.to('sala:geral').emit('emprestimo:atualizado', emprestimo);

        io.to(`usuario:${emprestimo.usuarioId}`).emit(
          'notificacao:nova',
          {
            emprestimoId: emprestimo.id,
            status: emprestimo.status,
            mensagem: 'O status do seu empréstimo foi atualizado.',
          }
        );

        if (
          ['RETIRADO', 'DEVOLVIDO', 'CANCELADO'].includes(emprestimo.status)
        ) {
          io.to('sala:geral').emit('equipamento:atualizado', {
            equipamentoId: emprestimo.equipamentoId,
            statusEmprestimo: emprestimo.status,
          });
        }
      }

      return res.status(200).json(emprestimo);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível atualizar o empréstimo.',
      });
    }
  };

  excluir = async (req, res) => {
    try {
      const emprestimo = await this.emprestimoService.buscarPorId(
        req.params.id
      );

      await this.emprestimoService.excluir(req.params.id);

      const io = req.app.get('io');

      if (io) {
        io.to('sala:geral').emit('emprestimo:excluido', {
          id: emprestimo.id,
          usuarioId: emprestimo.usuarioId,
          equipamentoId: emprestimo.equipamentoId,
        });
      }

      return res.status(204).send();
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível excluir o empréstimo.',
      });
    }
  };
}

module.exports = EmprestimoController;