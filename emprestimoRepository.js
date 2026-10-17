
const prismaCompartilhado = require('../config/prisma');

class EmprestimoRepository {
  constructor(prismaClient = prismaCompartilhado) {
    this.prisma = prismaClient;
  }

  async executarTransacao(callback) {
    return this.prisma.$transaction(callback);
  }

  async listarTodos(filtros = {}) {
    const pagina = Math.max(1, Number(filtros.pagina) || 1);
    const limite = Math.min(
      100,
      Math.max(1, Number(filtros.limite) || 10)
    );

    const where = {};

    if (filtros.usuarioId) {
      where.usuarioId = Number(filtros.usuarioId);
    }

    if (filtros.equipamentoId) {
      where.equipamentoId = Number(filtros.equipamentoId);
    }

    if (filtros.status) {
      where.status = filtros.status;
    }

    const [emprestimos, total] = await this.prisma.$transaction([
      this.prisma.emprestimo.findMany({
        where,
        include: {
          usuario: true,
          equipamento: {
            include: {
              categoria: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.emprestimo.count({ where }),
    ]);

    return {
      dados: emprestimos,
      paginacao: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async buscarPorId(id) {
    return this.prisma.emprestimo.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        usuario: true,
        equipamento: {
          include: {
            categoria: true,
          },
        },
      },
    });
  }

  async criar(dados, transacao = this.prisma) {
    return transacao.emprestimo.create({
      data: dados,
      include: {
        usuario: true,
        equipamento: true,
      },
    });
  }

  async atualizar(id, dados, transacao = this.prisma) {
    return transacao.emprestimo.update({
      where: {
        id: Number(id),
      },
      data: dados,
      include: {
        usuario: true,
        equipamento: true,
      },
    });
  }

  async excluir(id) {
    return this.prisma.emprestimo.delete({
      where: {
        id: Number(id),
      },
    });
  }
}

module.exports = EmprestimoRepository;