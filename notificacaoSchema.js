const { z } = require('zod');

const criarNotificacaoSchema = z.object({
  usuarioId: z.coerce
    .number()
    .int('O ID do usuário deve ser um número inteiro.')
    .positive('O ID do usuário deve ser positivo.'),

  emprestimoId: z.coerce
    .number()
    .int('O ID do empréstimo deve ser um número inteiro.')
    .positive('O ID do empréstimo deve ser positivo.')
    .nullable()
    .optional(),

  titulo: z
    .string()
    .trim()
    .min(2, 'O título deve ter pelo menos 2 caracteres.'),

  mensagem: z
    .string()
    .trim()
    .min(2, 'A mensagem deve ter pelo menos 2 caracteres.'),
});

const atualizarNotificacaoSchema = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(2, 'O título deve ter pelo menos 2 caracteres.')
      .optional(),

    mensagem: z
      .string()
      .trim()
      .min(2, 'A mensagem deve ter pelo menos 2 caracteres.')
      .optional(),

    lida: z.boolean().optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Informe pelo menos um campo para atualizar.',
  });

module.exports = {
  criarNotificacaoSchema,
  atualizarNotificacaoSchema,
};