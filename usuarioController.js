const UsuarioService = require('../services/usuarioService');

class UsuarioController {
  constructor(usuarioService = new UsuarioService()) {
    this.usuarioService = usuarioService;
  }

  listarTodos = async (req, res) => {
    try {
      const filtros = {
        pagina: req.query.pagina,
        limite: req.query.limite,
        nome: req.query.nome,
        email: req.query.email,
        tipo: req.query.tipo,
      };

      const usuarios = await this.usuarioService.listarTodos(filtros);

      return res.status(200).json(usuarios);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível listar os usuários.',
      });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const usuario = await this.usuarioService.buscarPorId(req.params.id);

      return res.status(200).json(usuario);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível buscar o usuário.',
      });
    }
  };

  criar = async (req, res) => {
    try {
      const usuario = await this.usuarioService.criar(req.body);

      return res.status(201).json(usuario);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível criar o usuário.',
      });
    }
  };

  atualizar = async (req, res) => {
    try {
      const usuario = await this.usuarioService.atualizar(
        req.params.id,
        req.body
      );

      return res.status(200).json(usuario);
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível atualizar o usuário.',
      });
    }
  };

  excluir = async (req, res) => {
    try {
      await this.usuarioService.excluir(req.params.id);

      return res.status(204).send();
    } catch (erro) {
      return res.status(erro.status || 500).json({
        erro: erro.status ? 'ERRO_REQUISICAO' : 'ERRO_INTERNO',
        mensagem: erro.message || 'Não foi possível excluir o usuário.',
      });
    }
  };
}

module.exports = UsuarioController;