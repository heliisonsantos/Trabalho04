const UsuarioRepository = require('../repositories/usuarioRepository');
const CategoriaRepository = require('../repositories/categoriaRepository');
const EquipamentoRepository = require('../repositories/equipamentoRepository');
const EmprestimoRepository = require('../repositories/emprestimoRepository');
const NotificacaoRepository = require('../repositories/notificacaoRepository');

const UsuarioService = require('../services/usuarioService');
const CategoriaService = require('../services/categoriaService');
const EquipamentoService = require('../services/equipamentoService');
const EmprestimoService = require('../services/emprestimoService');
const NotificacaoService = require('../services/notificacaoService');

const UsuarioController = require('../controllers/usuarioController');
const CategoriaController = require('../controllers/categoriaController');
const EquipamentoController = require('../controllers/equipamentoController');
const EmprestimoController = require('../controllers/emprestimoController');
const NotificacaoController = require('../controllers/notificacaoController');

// Repositórios
const usuarioRepository = new UsuarioRepository();
const categoriaRepository = new CategoriaRepository();
const equipamentoRepository = new EquipamentoRepository();
const emprestimoRepository = new EmprestimoRepository();
const notificacaoRepository = new NotificacaoRepository();

// Serviços
const usuarioService = new UsuarioService(usuarioRepository);
const categoriaService = new CategoriaService(categoriaRepository);

const equipamentoService = new EquipamentoService(
  equipamentoRepository,
  categoriaRepository
);

const emprestimoService = new EmprestimoService(
  emprestimoRepository,
  usuarioRepository,
  equipamentoRepository,
  notificacaoRepository
);

const notificacaoService = new NotificacaoService(
  notificacaoRepository,
  usuarioRepository,
  emprestimoRepository
);

// Controllers
const usuarioController = new UsuarioController(usuarioService);
const categoriaController = new CategoriaController(categoriaService);
const equipamentoController = new EquipamentoController(equipamentoService);
const emprestimoController = new EmprestimoController(emprestimoService);
const notificacaoController = new NotificacaoController(notificacaoService);

module.exports = {
  usuarioController,
  categoriaController,
  equipamentoController,
  emprestimoController,
  notificacaoController,
};