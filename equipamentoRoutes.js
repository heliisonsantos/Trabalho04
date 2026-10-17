
const express = require('express');
const { equipamentoController } = require('../config/dependencias');
const validar = require('../middlewares/validar');

const {
  criarEquipamentoSchema,
  atualizarEquipamentoSchema,
} = require('../schemas/equipamentoSchema');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Equipamentos
 *   description: Gerenciamento de equipamentos
 */

/**
 * @swagger
 * /equipamentos:
 *   get:
 *     summary: Lista os equipamentos
 *     tags: [Equipamentos]
 *     responses:
 *       200:
 *         description: Lista de equipamentos retornada com sucesso
 */
router.get('/', equipamentoController.listarTodos);

/**
 * @swagger
 * /equipamentos/{id}:
 *   get:
 *     summary: Busca um equipamento pelo ID
 *     tags: [Equipamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipamento encontrado
 *       404:
 *         description: Equipamento não encontrado
 */
router.get('/:id', equipamentoController.buscarPorId);

/**
 * @swagger
 * /equipamentos:
 *   post:
 *     summary: Cadastra um equipamento
 *     tags: [Equipamentos]
 *     responses:
 *       201:
 *         description: Equipamento cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/',
  validar(criarEquipamentoSchema),
  equipamentoController.criar
);

/**
 * @swagger
 * /equipamentos/{id}:
 *   put:
 *     summary: Atualiza um equipamento
 *     tags: [Equipamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipamento atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Equipamento não encontrado
 */
router.put(
  '/:id',
  validar(atualizarEquipamentoSchema),
  equipamentoController.atualizar
);

/**
 * @swagger
 * /equipamentos/{id}:
 *   delete:
 *     summary: Exclui um equipamento
 *     tags: [Equipamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipamento excluído com sucesso
 *       404:
 *         description: Equipamento não encontrado
 */
router.delete('/:id', equipamentoController.excluir);

module.exports = router;
