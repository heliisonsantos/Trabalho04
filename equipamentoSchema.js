const { z } = require('zod');

const criarEquipamentoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.'),

  descricao: z
    .string()
    .trim()
    .optional()
    .nullable(),

  codigoPatrimonio: z
    .string()
    .trim()
    .min(1, 'O código do patrimônio é obrigatório.'),

  categoriaId: z
    .coerce
    .number()
    .int('O ID da categoria deve ser um número inteiro.')
    .positive('O ID da categoria deve ser positivo.'),

  status: z
    .enum(['DISPONIVEL', 'EMPRESTADO', 'MANUTENCAO'])
    .optional(),
});

const atualizarEquipamentoSchema = z
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

    codigoPatrimonio: z
      .string()
      .trim()
      .min(1, 'O código do patrimônio é obrigatório.')
      .optional(),

    categoriaId: z
      .coerce
      .number()
      .int('O ID da categoria deve ser um número inteiro.')
      .positive('O ID da categoria deve ser positivo.')
      .optional(),

    status: z
      .enum(['DISPONIVEL', 'EMPRESTADO', 'MANUTENCAO'])
      .optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Informe pelo menos um campo para atualizar.',
  });

module.exports = {
  criarEquipamentoSchema,
  atualizarEquipamentoSchema,
};