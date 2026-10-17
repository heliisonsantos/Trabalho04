
const UsuarioRepository = require('../repositories/usuarioRepository');

class UsuarioService {
  constructor(usuarioRepository = new UsuarioRepository()) {
    this.usuarioRepository = usuarioRepository;
  }

  async listarTodos(filtros = {}) {
    return this.usuarioRepository.listarTodos(filtros);
  }

  async buscarPorId(id) {
    const usuario = await this.usuarioRepository.buscarPorId(id);

    if (!usuario) {
      const erro = new Error('Usuário não encontrado.');
      erro.status = 404;
      throw erro;
    }

    return usuario;
  }

  async criar(dados) {
    const usuarioExistente =
      await this.usuarioRepository.buscarPorEmail(dados.email);

    if (usuarioExistente) {
      const erro = new Error('Este e-mail já está cadastrado.');
      erro.status = 409;
      throw erro;
    }

    return this.usuarioRepository.criar({
      nome: dados.nome,
      email: dados.email,
      tipo: dados.tipo || 'ESTUDANTE',
    });
  }

  async atualizar(id, dados) {
    await this.buscarPorId(id);

    if (dados.email) {
      const usuarioComEmail =
        await this.usuarioRepository.buscarPorEmail(dados.email);

      if (usuarioComEmail && usuarioComEmail.id !== Number(id)) {
        const erro = new Error('Este e-mail já está cadastrado.');
        erro.status = 409;
        throw erro;
      }
    }

    return this.usuarioRepository.atualizar(id, dados);
  }

  async excluir(id) {
    await this.buscarPorId(id);
    return this.usuarioRepository.excluir(id);
  }
}

module.exports = UsuarioService;