import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Cria e exporta a instância do cliente Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Função para buscar usuário por email
export const buscarUsuarioPorEmail = async (email) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Erro ao buscar usuário');
  }

  return data || null;
};

// Função para buscar usuário por ID
export const buscarUsuarioPorId = async (id) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nome, email, departamento, status, perfil, data_cadastro')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    throw new Error('Erro ao buscar usuário');
  }

  return data || null;
};

// Função para listar usuários (com paginação)
export const listarUsuarios = async (pagina = 1, limite = 10) => {
  const inicio = (pagina - 1) * limite;
  const fim = inicio + limite - 1;

  const { data, error, count } = await supabase
    .from('usuarios')
    .select('id, nome, email, departamento, status, perfil, data_cadastro', { count: 'exact' })
    .order('nome', { ascending: true })
    .range(inicio, fim);

  if (error) {
    console.error('Erro ao listar usuários:', error);
    throw new Error('Erro ao listar usuários');
  }

  return {
    usuarios: data || [],
    total: count || 0,
    totalPaginas: Math.ceil((count || 0) / limite),
    paginaAtual: pagina
  };
};

// Função para criar um novo usuário
export const criarUsuario = async (usuario) => {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([usuario])
    .select('id, nome, email, departamento, status, perfil, data_cadastro')
    .single();

  if (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error(error.message || 'Erro ao criar usuário');
  }

  return data;
};

// Função para atualizar um usuário
export const atualizarUsuario = async (id, dadosAtualizacao) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update(dadosAtualizacao)
    .eq('id', id)
    .select('id, nome, email, departamento, status, perfil, data_cadastro')
    .single();

  if (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error(error.message || 'Erro ao atualizar usuário');
  }

  return data;
};

// Função para inativar um usuário
export const inativarUsuario = async (id) => {
  return await atualizarUsuario(id, { status: 'inativo' });
};

// Função para ativar um usuário
export const ativarUsuario = async (id) => {
  return await atualizarUsuario(id, { status: 'ativo' });
};

// Função para atualizar a senha de um usuário
export const atualizarSenha = async (id, novaSenha) => {
  return await atualizarUsuario(id, { senha: novaSenha });
};
