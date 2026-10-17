const { z } = require('zod');

const criarEmprestimoSchema = z.object({
  usuarioId: z.coerce
    .number()
    .int('O ID do usuário deve ser um número inteiro.')
    .positive('O ID do usuário deve ser positivo.'),

  equipamentoId: z.coerce
    .number()
    .int('O ID do equipamento deve ser um número inteiro.')
    .positive('O ID do equipamento deve ser positivo.'),

  dataPrevistaDevolucao: z
    .string()
    .trim()
    .min(1, 'A data prevista de devolução é obrigatória.')
    .refine((data) => !Number.isNaN(Date.parse(data)), {
      message: 'Informe uma data válida.',
    }),
});

const atualizarEmprestimoSchema = z
  .object({
    usuarioId: z.coerce
      .number()
      .int()
      .positive()
      .optional(),

    equipamentoId: z.coerce
      .number()
      .int()
      .positive()
      .optional(),

    dataPrevistaDevolucao: z
      .string()
      .trim()
      .refine((data) => !Number.isNaN(Date.parse(data)), {
        message: 'Informe uma data válida.',
      })
      .optional(),

    status: z
      .enum([
        'PENDENTE',
        'APROVADO',
        'RETIRADO',
        'DEVOLVIDO',
        'CANCELADO',
      ])
      .optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Informe pelo menos um campo para atualizar.',
  });

module.exports = {
  criarEmprestimoSchema,
  atualizarEmprestimoSchema,
};