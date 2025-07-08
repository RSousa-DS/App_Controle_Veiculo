import jwt from 'jsonwebtoken';
import { buscarUsuarioPorId } from '../supabaseClient.js';

// Middleware para verificar se o usuário está autenticado
export const autenticar = async (req, res, next) => {
  try {
    // Verifica se o token está no header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Não autorizado. Token não fornecido.'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Busca o usuário no banco de dados
    const usuario = await buscarUsuarioPorId(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Usuário não encontrado.'
      });
    }

    // Verifica se o usuário está ativo
    if (usuario.status !== 'ativo') {
      return res.status(403).json({ 
        status: 'error',
        message: 'Usuário inativo. Entre em contato com o administrador.'
      });
    }

    // Adiciona o usuário ao objeto de requisição
    req.usuario = usuario;
    
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        status: 'error',
        message: 'Token inválido.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        status: 'error',
        message: 'Token expirado. Faça login novamente.'
      });
    }
    
    res.status(500).json({ 
      status: 'error',
      message: 'Erro na autenticação.'
    });
  }
};

// Middleware para verificar se o usuário é administrador
export const autorizarAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.perfil === 'admin') {
    return next();
  }
  
  res.status(403).json({ 
    status: 'error',
    message: 'Acesso negado. Você não tem permissão para acessar este recurso.'
  });
};

// Middleware para verificar se o usuário tem permissão para acessar o recurso
export const autorizarUsuario = (req, res, next) => {
  // Se for admin, permite o acesso
  if (req.usuario.perfil === 'admin') {
    return next();
  }
  
  // Se não for admin, só pode acessar os próprios dados
  if (req.usuario.id !== parseInt(req.params.id)) {
    return res.status(403).json({ 
      status: 'error',
      message: 'Acesso negado. Você só pode acessar seus próprios dados.'
    });
  }
  
  next();
};
