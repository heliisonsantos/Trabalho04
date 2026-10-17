const { z } = require('zod');

const criarCategoriaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.'),

  descricao: z
    .string()
    .trim()
    .optional()
    .nullable(),
});

const atualizarCategoriaSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(2, 'O nome deve ter pelo menos 2 caracteres.')
      .optional(),

    descricao: z
      .string()
      .trim()
      .optional()
      .nullable(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Informe pelo menos um campo para atualizar.',
  });

module.exports = {
  criarCategoriaSchema,
  atualizarCategoriaSchema,
};