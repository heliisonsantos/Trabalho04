
const prismaCompartilhado = require('../config/prisma');

class NotificacaoRepository {
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

    if (filtros.usuarioId) {
      where.usuarioId = Number(filtros.usuarioId);
    }

    if (filtros.lida !== undefined && filtros.lida !== '') {
      where.lida = filtros.lida === 'true';
    }

    const [notificacoes, total] = await this.prisma.$transaction([
      this.prisma.notificacao.findMany({
        where,
        include: {
          usuario: true,
          emprestimo: true,
        },
        orderBy: {
          id: 'desc',
        },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.notificacao.count({ where }),
    ]);

    return {
      dados: notificacoes,
      paginacao: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async buscarPorId(id) {
    return this.prisma.notificacao.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        usuario: true,
        emprestimo: true,
      },
    });
  }

  async buscarPorUsuario(usuarioId) {
    return this.prisma.notificacao.findMany({
      where: {
        usuarioId: Number(usuarioId),
      },
      include: {
        emprestimo: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async criar(dados, transacao = this.prisma) {
    return transacao.notificacao.create({
      data: dados,
      include: {
        usuario: true,
        emprestimo: true,
      },
    });
  }

  async atualizar(id, dados) {
    return this.prisma.notificacao.update({
      where: {
        id: Number(id),
      },
      data: dados,
      include: {
        usuario: true,
        emprestimo: true,
      },
    });
  }

  async excluir(id) {
    return this.prisma.notificacao.delete({
      where: {
        id: Number(id),
      },
    });
  }
}

module.exports = NotificacaoRepository;