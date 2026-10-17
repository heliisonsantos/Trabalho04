
const prismaCompartilhado = require('../config/prisma');

class UsuarioRepository {
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

    if (filtros.email) {
      where.email = {
        contains: filtros.email,
        mode: 'insensitive',
      };
    }

    if (filtros.tipo) {
      where.tipo = filtros.tipo;
    }

    const [usuarios, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        where,
        orderBy: {
          id: 'asc',
        },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return {
      dados: usuarios,
      paginacao: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async buscarPorId(id) {
    return this.prisma.usuario.findUnique({
      where: { id: Number(id) },
    });
  }

  async buscarPorEmail(email) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async criar(dados) {
    return this.prisma.usuario.create({
      data: dados,
    });
  }

  async atualizar(id, dados) {
    return this.prisma.usuario.update({
      where: { id: Number(id) },
      data: dados,
    });
  }

  async excluir(id) {
    return this.prisma.usuario.delete({
      where: { id: Number(id) },
    });
  }
}

module.exports = UsuarioRepository;