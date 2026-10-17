
const prismaCompartilhado = require('../config/prisma');

class EquipamentoRepository {
  constructor(prismaClient = prismaCompartilhado) {
    this.prisma = prismaClient;
  }

  async listarTodos(filtros = {}) {
    const pagina = Math.max(1, Number(filtros.pagina) || 1);
    const limite = Math.min(
      100,
      Math.max(1, Number(filtros.limite) || 10)
    );

    const where = {};

    if (filtros.nome) {
      where.nome = {
        contains: filtros.nome,
        mode: 'insensitive',
      };
    }

    if (filtros.status) {
      where.status = filtros.status;
    }

    if (filtros.categoriaId) {
      where.categoriaId = Number(filtros.categoriaId);
    }

    const [equipamentos, total] = await this.prisma.$transaction([
      this.prisma.equipamento.findMany({
        where,
        include: {
          categoria: true,
        },
        orderBy: {
          id: 'asc',
        },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.equipamento.count({ where }),
    ]);

    return {
      dados: equipamentos,
      paginacao: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async buscarPorId(id, transacao = this.prisma) {
    return transacao.equipamento.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        categoria: true,
      },
    });
  }

  async buscarPorCodigoPatrimonio(codigoPatrimonio) {
    return this.prisma.equipamento.findUnique({
      where: {
        codigoPatrimonio,
      },
    });
  }

  async criar(dados) {
    return this.prisma.equipamento.create({
      data: dados,
      include: {
        categoria: true,
      },
    });
  }

  async atualizar(id, dados, transacao = this.prisma) {
    return transacao.equipamento.update({
      where: {
        id: Number(id),
      },
      data: dados,
      include: {
        categoria: true,
      },
    });
  }

  async excluir(id) {
    return this.prisma.equipamento.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async temEmprestimos(id) {
    const quantidade = await this.prisma.emprestimo.count({
      where: {
        equipamentoId: Number(id),
      },
    });

    return quantidade > 0;
  }
}

module.exports = EquipamentoRepository;