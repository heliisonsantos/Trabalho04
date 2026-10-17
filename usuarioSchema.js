const { z } = require('zod');

const criarUsuarioSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.'),

  email: z
    .string()
    .trim()
    .email('Informe um e-mail válido.'),

  tipo: z
    .enum(['ESTUDANTE', 'RESPONSAVEL'])
    .optional(),
});

const atualizarUsuarioSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(2, 'O nome deve ter pelo menos 2 caracteres.')
      .optional(),

    email: z
      .string()
      .trim()
      .email('Informe um e-mail válido.')
      .optional(),

    tipo: z
      .enum(['ESTUDANTE', 'RESPONSAVEL'])
      .optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Informe pelo menos um campo para atualizar.',
  });

module.exports = {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
};