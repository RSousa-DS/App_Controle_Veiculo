import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Mostrar um loader enquanto verifica a autenticação
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    toast.info('Você precisa fazer login para acessar esta página.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se a rota requer permissão de admin e o usuário não for admin, redireciona para a página inicial
  if (adminOnly && !isAdmin) {
    toast.error('Acesso negado. Você não tem permissão para acessar esta página.');
    return <Navigate to="/" replace />;
  }

  // Se estiver tudo certo, renderiza o componente filho
  return children;
};

export default PrivateRoute;
