import express from 'express';
import bcrypt from 'bcryptjs';
import { 
  buscarUsuarioPorId, 
  listarUsuarios, 
  criarUsuario, 
  atualizarUsuario, 
  inativarUsuario, 
  ativarUsuario, 
  atualizarSenha 
} from '../supabaseClient.js';
import { autenticar, autorizarAdmin, autorizarUsuario } from '../middlewares/auth.js';

const router = express.Router();

// Aplica o middleware de autenticação em todas as rotas
router.use(autenticar);

// Rota para listar usuários (apenas admin)
router.get('/', autorizarAdmin, async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    const resultado = await listarUsuarios(parseInt(pagina), parseInt(limite));
    
    res.status(200).json({
      status: 'success',
      data: resultado
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar usuários. Tente novamente mais tarde.'
    });
  }
});

// Rota para buscar um usuário específico
router.get('/:id', autorizarUsuario, async (req, res) => {
  try {
    const usuario = await buscarUsuarioPorId(parseInt(req.params.id));
    
    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: usuario
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar usuário. Tente novamente mais tarde.'
    });
  }
});

// Rota para criar um novo usuário (apenas admin)
router.post('/', autorizarAdmin, async (req, res) => {
  try {
    const { nome, email, departamento, senha, perfil = 'comum' } = req.body;
    
    // Validação dos campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, preencha todos os campos obrigatórios.'
      });
    }
    
    // Verifica se o email já está em uso
    const usuarioExistente = await buscarUsuarioPorEmail(email);
    
    if (usuarioExistente) {
      return res.status(400).json({
        status: 'error',
        message: 'Este email já está em uso.'
      });
    }
    
    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    
    // Cria o novo usuário
    const novoUsuario = {
      nome,
      email: email.toLowerCase(),
      departamento: departamento || null,
      senha: senhaHash,
      perfil: perfil === 'admin' ? 'admin' : 'comum',
      status: 'ativo',
      data_cadastro: new Date().toISOString()
    };
    
    const usuarioCriado = await criarUsuario(novoUsuario);
    
    res.status(201).json({
      status: 'success',
      message: 'Usuário criado com sucesso!',
      data: usuarioCriado
    });
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao criar usuário. Tente novamente mais tarde.'
    });
  }
});

// Rota para atualizar um usuário
router.put('/:id', autorizarUsuario, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, departamento, perfil } = req.body;
    
    // Verifica se o usuário existe
    const usuarioExistente = await buscarUsuarioPorId(parseInt(id));
    
    if (!usuarioExistente) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.'
      });
    }
    
    // Verifica se o email já está em uso por outro usuário
    if (email && email !== usuarioExistente.email) {
      const usuarioComEmail = await buscarUsuarioPorEmail(email);
      
      if (usuarioComEmail && usuarioComEmail.id !== parseInt(id)) {
        return res.status(400).json({
          status: 'error',
          message: 'Este email já está em uso por outro usuário.'
        });
      }
    }
    
    // Prepara os dados para atualização
    const dadosAtualizacao = {};
    
    if (nome) dadosAtualizacao.nome = nome;
    if (email) dadosAtualizacao.email = email.toLowerCase();
    if (departamento !== undefined) dadosAtualizacao.departamento = departamento;
    
    // Apenas admin pode alterar o perfil
    if (req.usuario.perfil === 'admin' && perfil) {
      dadosAtualizacao.perfil = perfil === 'admin' ? 'admin' : 'comum';
    }
    
    // Atualiza o usuário
    const usuarioAtualizado = await atualizarUsuario(parseInt(id), dadosAtualizacao);
    
    res.status(200).json({
      status: 'success',
      message: 'Usuário atualizado com sucesso!',
      data: usuarioAtualizado
    });
    
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar usuário. Tente novamente mais tarde.'
    });
  }
});

// Rota para atualizar a senha do usuário
router.put('/:id/senha', autorizarUsuario, async (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;
    
    // Validação dos campos
    if (!senhaAtual || !novaSencao) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, forneça a senha atual e a nova senha.'
      });
    }
    
    // Busca o usuário com a senha
    const { data: usuarioComSenha, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !usuarioComSenha) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.'
      });
    }
    
    // Verifica se o usuário logado é o dono da conta ou um admin
    if (req.usuario.id !== usuarioComSenha.id && req.usuario.perfil !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para alterar a senha deste usuário.'
      });
    }
    
    // Se não for admin, verifica a senha atual
    if (req.usuario.perfil !== 'admin') {
      const senhaValida = await bcrypt.compare(senhaAtual, usuarioComSenha.senha);
      
      if (!senhaValida) {
        return res.status(400).json({
          status: 'error',
          message: 'Senha atual incorreta.'
        });
      }
    }
    
    // Criptografa a nova senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);
    
    // Atualiza a senha
    await atualizarSenha(parseInt(id), senhaHash);
    
    res.status(200).json({
      status: 'success',
      message: 'Senha atualizada com sucesso!'
    });
    
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar senha. Tente novamente mais tarde.'
    });
  }
});

// Rota para inativar um usuário (apenas admin)
router.put('/:id/inativar', autorizarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se o usuário existe
    const usuarioExistente = await buscarUsuarioPorId(parseInt(id));
    
    if (!usuarioExistente) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.'
      });
    }
    
    // Não permite inativar a si mesmo
    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({
        status: 'error',
        message: 'Você não pode inativar sua própria conta.'
      });
    }
    
    // Inativa o usuário
    await inativarUsuario(parseInt(id));
    
    res.status(200).json({
      status: 'success',
      message: 'Usuário inativado com sucesso!'
    });
    
  } catch (error) {
    console.error('Erro ao inativar usuário:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao inativar usuário. Tente novamente mais tarde.'
    });
  }
});

// Rota para ativar um usuário (apenas admin)
router.put('/:id/ativar', autorizarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se o usuário existe
    const usuarioExistente = await buscarUsuarioPorId(parseInt(id));
    
    if (!usuarioExistente) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado.'
      });
    }
    
    // Ativa o usuário
    await ativarUsuario(parseInt(id));
    
    res.status(200).json({
      status: 'success',
      message: 'Usuário ativado com sucesso!'
    });
    
  } catch (error) {
    console.error('Erro ao ativar usuário:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao ativar usuário. Tente novamente mais tarde.'
    });
  }
});

export default router;
