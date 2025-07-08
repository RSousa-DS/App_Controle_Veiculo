import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase, signInWithEmail, signOut as signOutUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há um usuário logado
    const checkUser = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email, password) => {
    try {
      const userData = await signInWithEmail(email, password);
      
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Login realizado com sucesso!');
        navigate('/');
        return true;
      }
      
      throw new Error('Credenciais inválidas');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
      return false;
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.perfil === 'admin',
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
