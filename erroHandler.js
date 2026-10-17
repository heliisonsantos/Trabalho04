function erroHandler(erro, req, res, next) {
  console.error('Erro na aplicação:', erro.message);

  const status = erro.status || erro.statusCode || 500;

  res.status(status).json({
    erro: {
      codigo: erro.codigo || 'ERRO_INTERNO',
      mensagem:
        status === 500
          ? 'Ocorreu um erro interno no servidor.'
          : erro.message,
    },
  });
}

module.exports = erroHandler;