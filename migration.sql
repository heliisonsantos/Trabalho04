/*
  Warnings:

  - You are about to drop the `categorias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emprestimos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estudantes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `livro_categorias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `livros` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusEquipamento" AS ENUM ('DISPONIVEL', 'EMPRESTADO', 'MANUTENCAO');

-- CreateEnum
CREATE TYPE "StatusEmprestimo" AS ENUM ('PENDENTE', 'APROVADO', 'RETIRADO', 'DEVOLVIDO', 'CANCELADO');

-- DropForeignKey
ALTER TABLE "emprestimos" DROP CONSTRAINT "emprestimos_estudante_id_fkey";

-- DropForeignKey
ALTER TABLE "emprestimos" DROP CONSTRAINT "emprestimos_livro_id_fkey";

-- DropForeignKey
ALTER TABLE "livro_categorias" DROP CONSTRAINT "livro_categorias_categoria_id_fkey";

-- DropForeignKey
ALTER TABLE "livro_categorias" DROP CONSTRAINT "livro_categorias_livro_id_fkey";

-- DropTable
DROP TABLE "categorias";

-- DropTable
DROP TABLE "emprestimos";

-- DropTable
DROP TABLE "estudantes";

-- DropTable
DROP TABLE "livro_categorias";

-- DropTable
DROP TABLE "livros";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'ESTUDANTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "codigoPatrimonio" TEXT NOT NULL,
    "status" "StatusEquipamento" NOT NULL DEFAULT 'DISPONIVEL',
    "categoriaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emprestimo" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "equipamentoId" INTEGER NOT NULL,
    "dataSolicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPrevistaDevolucao" TIMESTAMP(3) NOT NULL,
    "dataDevolucao" TIMESTAMP(3),
    "status" "StatusEmprestimo" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Emprestimo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "emprestimoId" INTEGER,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Equipamento_codigoPatrimonio_key" ON "Equipamento"("codigoPatrimonio");

-- CreateIndex
CREATE INDEX "Equipamento_nome_idx" ON "Equipamento"("nome");

-- CreateIndex
CREATE INDEX "Equipamento_categoriaId_idx" ON "Equipamento"("categoriaId");

-- CreateIndex
CREATE INDEX "Equipamento_status_idx" ON "Equipamento"("status");

-- CreateIndex
CREATE INDEX "Emprestimo_usuarioId_idx" ON "Emprestimo"("usuarioId");

-- CreateIndex
CREATE INDEX "Emprestimo_equipamentoId_idx" ON "Emprestimo"("equipamentoId");

-- CreateIndex
CREATE INDEX "Emprestimo_status_idx" ON "Emprestimo"("status");

-- CreateIndex
CREATE INDEX "Emprestimo_dataSolicitacao_idx" ON "Emprestimo"("dataSolicitacao");

-- CreateIndex
CREATE INDEX "Notificacao_usuarioId_lida_idx" ON "Notificacao"("usuarioId", "lida");

-- CreateIndex
CREATE INDEX "Notificacao_createdAt_idx" ON "Notificacao"("createdAt");

-- AddForeignKey
ALTER TABLE "Equipamento" ADD CONSTRAINT "Equipamento_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emprestimo" ADD CONSTRAINT "Emprestimo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emprestimo" ADD CONSTRAINT "Emprestimo_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_emprestimoId_fkey" FOREIGN KEY ("emprestimoId") REFERENCES "Emprestimo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
