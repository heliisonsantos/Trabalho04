const EquipamentoService = require('../services/equipamentoService');

class EquipamentoController {
  constructor(equipamentoService = new EquipamentoService()) {
    this.equipamentoService = equipamentoService;
  }

  listarTodos = async (req, res) => {
    try {
      const filtros = {
        pagina: req.query.pagina,
        limite: req.query.limite,
        nome: req.query.nome,
        status: req.query.status,
        categoriaId: req.query.categoriaId,
      };

      const equipamentos = await this.equipamentoService.listarTodos(filtros);

      return res.status(200).json(equipamentos);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem:
          erro.message || 'Não foi possível listar os equipamentos.',
      });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const equipamento = await this.equipamentoService.buscarPorId(
        req.params.id
      );

      return res.status(200).json(equipamento);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível buscar o equipamento.',
      });
    }
  };

  criar = async (req, res) => {
    try {
      const equipamento = await this.equipamentoService.criar(req.body);

      return res.status(201).json(equipamento);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível criar o equipamento.',
      });
    }
  };

  atualizar = async (req, res) => {
    try {
      const equipamento = await this.equipamentoService.atualizar(
        req.params.id,
        req.body
      );

      return res.status(200).json(equipamento);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível atualizar o equipamento.',
      });
    }
  };

  excluir = async (req, res) => {
    try {
      await this.equipamentoService.excluir(req.params.id);

      return res.status(204).send();
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível excluir o equipamento.',
      });
    }
  };
}

module.exports = EquipamentoController;