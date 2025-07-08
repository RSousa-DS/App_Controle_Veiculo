import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { buscarUsuarioPorEmail } from '../supabaseClient.js';

const router = express.Router();

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação dos campos
    if (!email || !senha) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, forneça email e senha.'
      });
    }

    // Busca o usuário no banco de dados
    const usuario = await buscarUsuarioPorEmail(email);

    // Verifica se o usuário existe
    if (!usuario) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciais inválidas.'
      });
    }

    // Verifica se a senha está correta
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaValida) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciais inválidas.'
      });
    }

    // Verifica se o usuário está ativo
    if (usuario.status !== 'ativo') {
      return res.status(403).json({
        status: 'error',
        message: 'Usuário inativo. Entre em contato com o administrador.'
      });
    }

    // Cria o token JWT
    const token = jwt.sign(
      { 
        id: usuario.id,
        email: usuario.email,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Remove a senha do objeto de resposta
    const { senha: _, ...usuarioSemSenha } = usuario;

    // Retorna o token e as informações do usuário
    res.status(200).json({
      status: 'success',
      token,
      usuario: usuarioSemSenha
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao realizar login. Tente novamente mais tarde.'
    });
  }
});

// Rota para verificar o token
router.get('/verificar-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Token não fornecido.'
    });
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Se chegou até aqui, o token é válido
    res.status(200).json({
      status: 'success',
      message: 'Token válido.',
      usuario: {
        id: decoded.id,
        email: decoded.email,
        perfil: decoded.perfil
      }
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expirado. Faça login novamente.'
      });
    }
    
    res.status(401).json({
      status: 'error',
      message: 'Token inválido.'
    });
  }
});

export default router;
