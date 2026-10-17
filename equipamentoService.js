
const EquipamentoRepository = require('../repositories/equipamentoRepository');
const CategoriaRepository = require('../repositories/categoriaRepository');

class EquipamentoService {
  constructor(
    equipamentoRepository = new EquipamentoRepository(),
    categoriaRepository = new CategoriaRepository()
  ) {
    this.equipamentoRepository = equipamentoRepository;
    this.categoriaRepository = categoriaRepository;
  }

  async listarTodos(filtros = {}) {
    return this.equipamentoRepository.listarTodos(filtros);
  }

  async buscarPorId(id) {
    const equipamento = await this.equipamentoRepository.buscarPorId(id);

    if (!equipamento) {
      const erro = new Error('Equipamento não encontrado.');
      erro.status = 404;
      throw erro;
    }

    return equipamento;
  }

  async criar(dados) {
    if (
      !dados.nome ||
      !dados.nome.trim() ||
      !dados.codigoPatrimonio ||
      !dados.codigoPatrimonio.trim() ||
      !dados.categoriaId
    ) {
      const erro = new Error(
        'Nome, código do patrimônio e categoria são obrigatórios.'
      );
      erro.status = 400;
      throw erro;
    }

    const categoria = await this.categoriaRepository.buscarPorId(
      dados.categoriaId
    );

    if (!categoria) {
      const erro = new Error('Categoria não encontrada.');
      erro.status = 404;
      throw erro;
    }

    const codigoExistente =
      await this.equipamentoRepository.buscarPorCodigoPatrimonio(
        dados.codigoPatrimonio.trim()
      );

    if (codigoExistente) {
      const erro = new Error('Este código de patrimônio já está cadastrado.');
      erro.status = 409;
      throw erro;
    }

    return this.equipamentoRepository.criar({
      nome: dados.nome.trim(),
      descricao: dados.descricao || null,
      codigoPatrimonio: dados.codigoPatrimonio.trim(),
      categoriaId: Number(dados.categoriaId),
      status: dados.status || 'DISPONIVEL',
    });
  }

  async atualizar(id, dados) {
    await this.buscarPorId(id);

    const dadosAtualizados = {};

    if (dados.nome !== undefined) {
      if (!dados.nome.trim()) {
        const erro = new Error('O nome não pode ficar vazio.');
        erro.status = 400;
        throw erro;
      }

      dadosAtualizados.nome = dados.nome.trim();
    }

    if (dados.descricao !== undefined) {
      dadosAtualizados.descricao = dados.descricao || null;
    }

    if (dados.codigoPatrimonio !== undefined) {
      if (!dados.codigoPatrimonio.trim()) {
        const erro = new Error('O código do patrimônio é obrigatório.');
        erro.status = 400;
        throw erro;
      }

      const codigo = dados.codigoPatrimonio.trim();
      const equipamentoExistente =
        await this.equipamentoRepository.buscarPorCodigoPatrimonio(codigo);

      if (
        equipamentoExistente &&
        equipamentoExistente.id !== Number(id)
      ) {
        const erro = new Error(
          'Este código de patrimônio já está cadastrado.'
        );
        erro.status = 409;
        throw erro;
      }

      dadosAtualizados.codigoPatrimonio = codigo;
    }

    if (dados.categoriaId !== undefined) {
      const categoria = await this.categoriaRepository.buscarPorId(
        dados.categoriaId
      );

      if (!categoria) {
        const erro = new Error('Categoria não encontrada.');
        erro.status = 404;
        throw erro;
      }

      dadosAtualizados.categoriaId = Number(dados.categoriaId);
    }

    if (dados.status !== undefined) {
      const statusPermitidos = [
        'DISPONIVEL',
        'EMPRESTADO',
        'MANUTENCAO',
      ];

      if (!statusPermitidos.includes(dados.status)) {
        const erro = new Error('Status do equipamento inválido.');
        erro.status = 400;
        throw erro;
      }

      dadosAtualizados.status = dados.status;
    }

    return this.equipamentoRepository.atualizar(id, dadosAtualizados);
  }

  async excluir(id) {
    await this.buscarPorId(id);

    const possuiEmprestimos =
      await this.equipamentoRepository.temEmprestimos(id);

    if (possuiEmprestimos) {
      const erro = new Error(
        'Não é possível excluir um equipamento que possui empréstimos vinculados.'
      );
      erro.status = 409;
      throw erro;
    }

    return this.equipamentoRepository.excluir(id);
  }
}

module.exports = EquipamentoService;