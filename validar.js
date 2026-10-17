function validar(esquema) {
  return (req, res, next) => {
    const resultado = esquema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        erro: 'DADOS_INVALIDOS',
        mensagem: 'Verifique os dados enviados.',
        detalhes: resultado.error.issues.map((item) => ({
          campo: item.path.join('.'),
          mensagem: item.message,
        })),
      });
    }

    req.body = resultado.data;
    next();
  };
}

module.exports = validar;