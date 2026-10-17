
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Criar categorias
  const categorias = await Promise.all([
    prisma.categoria.upsert({
      where: { nome: 'Informática' },
      update: {},
      create: {
        nome: 'Informática',
        descricao: 'Equipamentos de informática',
      },
    }),
    prisma.categoria.upsert({
      where: { nome: 'Audiovisual' },
      update: {},
      create: {
        nome: 'Audiovisual',
        descricao: 'Equipamentos para apresentações',
      },
    }),
  ]);

  // Criar usuários
  const usuarios = await Promise.all([
    prisma.usuario.upsert({
      where: { email: 'ana@exemplo.com' },
      update: {},
      create: {
        nome: 'Ana Souza',
        email: 'ana@exemplo.com',
        tipo: 'ESTUDANTE',
      },
    }),
    prisma.usuario.upsert({
      where: { email: 'carlos@exemplo.com' },
      update: {},
      create: {
        nome: 'Carlos Lima',
        email: 'carlos@exemplo.com',
        tipo: 'RESPONSAVEL',
      },
    }),
  ]);

  // Criar equipamentos
  await Promise.all([
    prisma.equipamento.upsert({
      where: { codigoPatrimonio: 'EQ-001' },
      update: {},
      create: {
        nome: 'Notebook Dell',
        descricao: 'Notebook para atividades educacionais',
        codigoPatrimonio: 'EQ-001',
        categoriaId: categorias[0].id,
      },
    }),
    prisma.equipamento.upsert({
      where: { codigoPatrimonio: 'EQ-002' },
      update: {},
      create: {
        nome: 'Projetor Epson',
        descricao: 'Projetor para apresentações em sala',
        codigoPatrimonio: 'EQ-002',
        categoriaId: categorias[1].id,
      },
    }),
  ]);

  console.log('Seed executado com sucesso!');
  console.log(`Categorias: ${categorias.length}`);
  console.log(`Usuários: ${usuarios.length}`);
}

main()
  .catch((erro) => {
    console.error('Erro ao executar seed:', erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
