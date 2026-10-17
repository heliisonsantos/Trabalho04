
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const equipamentoRoutes = require('./routes/equipamentoRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');
const notificacaoRoutes = require('./routes/notificacaoRoutes');
const erroHandler = require('./middlewares/erroHandler');

const app = express();
const servidor = http.createServer(app);

const io = new Server(servidor, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// Arquivos da interface web
const path = require('path');

app.use(express.static(path.join(__dirname, '../public')));

// Disponibiliza o Socket.IO para os controllers, se necessário.
app.set('io', io);

// Rotas da API
app.use('/usuarios', usuarioRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/equipamentos', equipamentoRoutes);
app.use('/emprestimos', emprestimoRoutes);
app.use('/notificacoes', notificacaoRoutes);

// Verificação de funcionamento
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mensagem: 'Sistema funcionando',
  });
});

// Configuração do Swagger
const opcoesSwagger = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Empréstimos de Equipamentos',
      version: '1.0.0',
      description:
        'API para acompanhar empréstimos de equipamentos educacionais.',
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(opcoesSwagger);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Eventos WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Sala geral para atualizações do sistema
  socket.join('sala:geral');

  // Cliente pode entrar na sala de um usuário específico
  socket.on('entrar:usuario', (dados, responder) => {
    if (
      !dados ||
      !Number.isInteger(Number(dados.usuarioId)) ||
      Number(dados.usuarioId) <= 0
    ) {
      if (typeof responder === 'function') {
        responder({
          sucesso: false,
          mensagem: 'ID de usuário inválido.',
        });
      }
      return;
    }

    const salaUsuario = `usuario:${Number(dados.usuarioId)}`;
    socket.join(salaUsuario);

    if (typeof responder === 'function') {
      responder({
        sucesso: true,
        mensagem: 'Conectado à sala do usuário.',
      });
    }
  });

  // Cliente solicita sincronização dos dados
  socket.on('sincronizar:solicitar', (responder) => {
    if (typeof responder !== 'function') {
      return;
    }

    responder({
      sucesso: true,
      mensagem: 'Conexão ativa. Consulte a API REST para sincronizar os dados.',
      eventosDisponiveis: [
        'emprestimo:criado',
        'emprestimo:atualizado',
        'equipamento:atualizado',
        'notificacao:nova',
        'notificacao:lida',
      ],
    });
  });

  socket.on('disconnect', (motivo) => {
    console.log('Cliente desconectado:', socket.id, motivo);
  });

  socket.on('error', (erro) => {
    console.error('Erro no WebSocket:', erro.message);
  });
});

// Tratamento de rotas inexistentes
app.use((req, res, next) => {
  res.status(404).json({
    erro: {
      codigo: 'ROTA_NAO_ENCONTRADA',
      mensagem: 'A rota solicitada não existe.',
    },
  });
});

// Tratamento centralizado de erros
app.use(erroHandler);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;

servidor.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

module.exports = { app, servidor, io };