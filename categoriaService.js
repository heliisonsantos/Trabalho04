
const CategoriaRepository = require('../repositories/categoriaRepository');

class CategoriaService {
  constructor(categoriaRepository = new CategoriaRepository()) {
    this.categoriaRepository = categoriaRepository;
  }

  async listarTodas(filtros = {}) {
    return this.categoriaRepository.listarTodas(filtros);
  }

  async buscarPorId(id) {
    const categoria = await this.categoriaRepository.buscarPorId(id);

    if (!categoria) {
      const erro = new Error('Categoria não encontrada.');
      erro.status = 404;
      throw erro;
    }

    return categoria;
  }

  async criar(dados) {
    if (!dados.nome || !dados.nome.trim()) {
      const erro = new Error('O nome da categoria é obrigatório.');
      erro.status = 400;
      throw erro;
    }

    const categoriaExistente =
      await this.categoriaRepository.buscarPorNome(dados.nome.trim());

    if (categoriaExistente) {
      const erro = new Error('Já existe uma categoria com esse nome.');
      erro.status = 409;
      throw erro;
    }

    return this.categoriaRepository.criar({
      nome: dados.nome.trim(),
      descricao: dados.descricao || null,
    });
  }

  async atualizar(id, dados) {
    await this.buscarPorId(id);

    const dadosAtualizados = {};

    if (dados.nome !== undefined) {
      if (!dados.nome.trim()) {
        const erro = new Error('O nome da categoria não pode ficar vazio.');
        erro.status = 400;
        throw erro;
      }

      const nome = dados.nome.trim();
      const categoriaExistente =
        await this.categoriaRepository.buscarPorNome(nome);

      if (categoriaExistente && categoriaExistente.id !== Number(id)) {
        const erro = new Error('Já existe uma categoria com esse nome.');
        erro.status = 409;
        throw erro;
      }

      dadosAtualizados.nome = nome;
    }

    if (dados.descricao !== undefined) {
      dadosAtualizados.descricao = dados.descricao || null;
    }

    return this.categoriaRepository.atualizar(id, dadosAtualizados);
  }

  async excluir(id) {
    await this.buscarPorId(id);
    return this.categoriaRepository.excluir(id);
  }
}

module.exports = CategoriaService;