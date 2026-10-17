
const express = require('express');
const { categoriaController } = require('../config/dependencias');
const validar = require('../middlewares/validar');

const {
  criarCategoriaSchema,
  atualizarCategoriaSchema,
} = require('../schemas/categoriaSchema');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Gerenciamento de categorias
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Lista as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 */
router.get('/', categoriaController.listarTodas);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Busca uma categoria pelo ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', categoriaController.buscarPorId);

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Cadastra uma categoria
 *     tags: [Categorias]
 *     responses:
 *       201:
 *         description: Categoria cadastrada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/',
  validar(criarCategoriaSchema),
  categoriaController.criar
);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Atualiza uma categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Categoria não encontrada
 */
router.put(
  '/:id',
  validar(atualizarCategoriaSchema),
  categoriaController.atualizar
);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Exclui uma categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria excluída com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/:id', categoriaController.excluir);

module.exports = router;
