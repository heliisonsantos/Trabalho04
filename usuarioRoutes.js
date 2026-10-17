
const express = require('express');
const { usuarioController } = require('../config/dependencias');
const validar = require('../middlewares/validar');
const {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
} = require('../schemas/usuarioSchema');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', usuarioController.listarTodos);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um usuário
 *     tags: [Usuários]
 *     responses:
 *       201:
 *         description: Usuário cadastrado
 */
router.post('/', validar(criarUsuarioSchema), usuarioController.criar);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', usuarioController.buscarPorId);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
router.put(
  '/:id',
  validar(atualizarUsuarioSchema),
  usuarioController.atualizar
);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário excluído
 */
router.delete('/:id', usuarioController.excluir);

module.exports = router;