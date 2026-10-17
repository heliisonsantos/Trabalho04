
const prismaCompartilhado = require('../config/prisma');

class CategoriaRepository {
  constructor(prismaClient = prismaCompartilhado) {
    this.prisma = prismaClient;
  }

  async listarTodas(filtros = {}) {
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

    const [categorias, total] = await this.prisma.$transaction([
      this.prisma.categoria.findMany({
        where,
        orderBy: {
          id: 'asc',
        },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.categoria.count({ where }),
    ]);

    return {
      dados: categorias,
      paginacao: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async buscarPorId(id) {
    return this.prisma.categoria.findUnique({
      where: { id: Number(id) },
    });
  }

  async buscarPorNome(nome) {
    return this.prisma.categoria.findUnique({
      where: { nome },
    });
  }

  async criar(dados) {
    return this.prisma.categoria.create({
      data: dados,
    });
  }

  async atualizar(id, dados) {
    return this.prisma.categoria.update({
      where: { id: Number(id) },
      data: dados,
    });
  }

  async excluir(id) {
    return this.prisma.categoria.delete({
      where: { id: Number(id) },
    });
  }
}

module.exports = CategoriaRepository;