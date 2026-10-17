
const express = require('express');
const { notificacaoController } = require('../config/dependencias');
const validar = require('../middlewares/validar');

const {
  criarNotificacaoSchema,
  atualizarNotificacaoSchema,
} = require('../schemas/notificacaoSchema');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notificações
 *   description: Gerenciamento de notificações
 */

/**
 * @swagger
 * /notificacoes:
 *   get:
 *     summary: Lista as notificações
 *     tags: [Notificações]
 *     responses:
 *       200:
 *         description: Lista de notificações retornada com sucesso
 */
router.get('/', notificacaoController.listarTodas);

/**
 * @swagger
 * /notificacoes/{id}:
 *   get:
 *     summary: Busca uma notificação pelo ID
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificação encontrada
 *       404:
 *         description: Notificação não encontrada
 */
router.get('/:id', notificacaoController.buscarPorId);

/**
 * @swagger
 * /notificacoes:
 *   post:
 *     summary: Cria uma notificação
 *     tags: [Notificações]
 *     responses:
 *       201:
 *         description: Notificação criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/',
  validar(criarNotificacaoSchema),
  notificacaoController.criar
);

/**
 * @swagger
 * /notificacoes/{id}:
 *   put:
 *     summary: Atualiza uma notificação
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificação atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Notificação não encontrada
 */
router.put(
  '/:id',
  validar(atualizarNotificacaoSchema),
  notificacaoController.atualizar
);

/**
 * @swagger
 * /notificacoes/{id}:
 *   delete:
 *     summary: Exclui uma notificação
 *     tags: [Notificações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificação excluída com sucesso
 *       404:
 *         description: Notificação não encontrada
 */
router.delete('/:id', notificacaoController.excluir);

module.exports = router;
