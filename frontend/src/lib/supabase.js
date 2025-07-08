import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções de exemplo para interagir com o Supabase
export const getReservas = async () => {
  const { data, error } = await supabase
    .from('reservas')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const createReserva = async (reserva) => {
  const { data, error } = await supabase
    .from('reservas')
    .insert([reserva])
    .select();
    
  if (error) throw error;
  return data[0];
};

export const updateReserva = async (id, updates) => {
  const { data, error } = await supabase
    .from('reservas')
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) throw error;
  return data[0];
};

// Função para upload de arquivos (ex: imagem do painel)
export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
    
  if (error) throw error;
  return data;
};

// Função para obter URL pública de um arquivo
export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  return data.publicUrl;
};
