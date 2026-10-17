const CategoriaService = require('../services/categoriaService');

class CategoriaController {
  constructor(categoriaService = new CategoriaService()) {
    this.categoriaService = categoriaService;
  }

  listarTodas = async (req, res) => {
    try {
      const filtros = {
        pagina: req.query.pagina,
        limite: req.query.limite,
        nome: req.query.nome,
      };

      const categorias = await this.categoriaService.listarTodas(filtros);

      return res.status(200).json(categorias);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível listar as categorias.',
      });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const categoria = await this.categoriaService.buscarPorId(req.params.id);

      return res.status(200).json(categoria);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível buscar a categoria.',
      });
    }
  };

  criar = async (req, res) => {
    try {
      const categoria = await this.categoriaService.criar(req.body);

      return res.status(201).json(categoria);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível criar a categoria.',
      });
    }
  };

  atualizar = async (req, res) => {
    try {
      const categoria = await this.categoriaService.atualizar(
        req.params.id,
        req.body
      );

      return res.status(200).json(categoria);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível atualizar a categoria.',
      });
    }
  };

  excluir = async (req, res) => {
    try {
      await this.categoriaService.excluir(req.params.id);

      return res.status(204).send();
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível excluir a categoria.',
      });
    }
  };
}

module.exports = CategoriaController;