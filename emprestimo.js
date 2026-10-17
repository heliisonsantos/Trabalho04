
const STATUS_PERMITIDOS = [
  'PENDENTE',
  'APROVADO',
  'RETIRADO',
  'DEVOLVIDO',
  'CANCELADO',
];

function validarStatus(status) {
  return STATUS_PERMITIDOS.includes(status);
}

function podeAlterarStatus(statusAtual, novoStatus) {
  if (!validarStatus(novoStatus)) {
    return false;
  }

  if (
    ['DEVOLVIDO', 'CANCELADO'].includes(statusAtual) &&
    novoStatus !== statusAtual
  ) {
    return false;
  }

  return true;
}

module.exports = {
  validarStatus,
  podeAlterarStatus,
};
