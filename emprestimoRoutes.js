
const express = require('express');
const { emprestimoController } = require('../config/dependencias');
const validar = require('../middlewares/validar');

const {
  criarEmprestimoSchema,
  atualizarEmprestimoSchema,
} = require('../schemas/emprestimoSchema');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Empréstimos
 *   description: Gerenciamento de empréstimos de equipamentos
 */

/**
 * @swagger
 * /emprestimos:
 *   get:
 *     summary: Lista os empréstimos
 *     tags: [Empréstimos]
 *     responses:
 *       200:
 *         description: Lista de empréstimos retornada com sucesso
 */
router.get('/', emprestimoController.listarTodos);

/**
 * @swagger
 * /emprestimos/{id}:
 *   get:
 *     summary: Busca um empréstimo pelo ID
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empréstimo encontrado
 *       404:
 *         description: Empréstimo não encontrado
 */
router.get('/:id', emprestimoController.buscarPorId);

/**
 * @swagger
 * /emprestimos:
 *   post:
 *     summary: Registra um empréstimo
 *     tags: [Empréstimos]
 *     responses:
 *       201:
 *         description: Empréstimo registrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/',
  validar(criarEmprestimoSchema),
  emprestimoController.criar
);

/**
 * @swagger
 * /emprestimos/{id}:
 *   put:
 *     summary: Atualiza um empréstimo
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empréstimo atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Empréstimo não encontrado
 */
router.put(
  '/:id',
  validar(atualizarEmprestimoSchema),
  emprestimoController.atualizar
);

/**
 * @swagger
 * /emprestimos/{id}:
 *   delete:
 *     summary: Exclui um empréstimo
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empréstimo excluído com sucesso
 *       404:
 *         description: Empréstimo não encontrado
 */
router.delete('/:id', emprestimoController.excluir);

module.exports = router;
