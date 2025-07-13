import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  FaCar, FaExchangeAlt, FaHistory, FaUsers,
  FaSignOutAlt, FaBars, FaTimes, FaUserCircle, 
  FaCarAlt, FaHome
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const NavbarContainer = styled.nav`
  background: #1a73e8;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    position: relative;
    
    @media (max-width: 768px) {
      padding: 0 15px;
      height: 56px;
    }
  }
  
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    
    @media (max-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  
  .nav-logo {
    display: flex;
    align-items: center;
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    
    svg {
      margin-right: 10px;
      font-size: 1.3rem;
    }
    
    .logo-text {
      @media (max-width: 400px) {
        display: none;
      }
    }
  }
  
  .nav-menu {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    
    @media (max-width: 768px) {
      position: fixed;
      top: 56px;
      left: -100%;
      width: 80%;
      max-width: 280px;
      height: calc(100vh - 56px);
      flex-direction: column;
      align-items: stretch;
      background: white;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      transition: left 0.3s ease;
      z-index: 1000;
      overflow-y: auto;
      padding: 20px 0;
      
      &.open {
        left: 0;
      }
    }
    
    li {
      margin: 0;
      padding: 0;
      
      @media (max-width: 768px) {
        width: 100%;
      }
    }
    
    a {
      color: white;
      text-decoration: none;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      transition: background-color 0.2s;
      border-radius: 4px;
      margin: 0 5px;
      
      @media (max-width: 768px) {
        color: #333;
        padding: 12px 20px;
        margin: 0;
        border-radius: 0;
        
        &:hover {
          background-color: #f5f5f5;
        }
      }
      
      svg {
        margin-right: 8px;
        font-size: 1.1em;
      }
      
      &.active {
        background-color: rgba(255, 255, 255, 0.2);
        font-weight: 500;
        
        @media (max-width: 768px) {
          background-color: #e8f0fe;
          color: #1a73e8;
        }
      }
    }
  }
  
  .user-menu {
    display: flex;
    align-items: center;
    margin-left: 10px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      padding: 15px 20px;
      border-top: 1px solid #eee;
      margin-top: 10px;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      margin-right: 15px;
      
      @media (max-width: 768px) {
        margin-bottom: 15px;
        width: 100%;
      }
      
      .user-avatar {
        font-size: 2rem;
        margin-right: 10px;
        color: white;
        
        @media (max-width: 768px) {
          color: #555;
        }
      }
      
      .user-details {
        display: flex;
        flex-direction: column;
        
        .user-name {
          font-weight: 500;
          color: white;
          
          @media (max-width: 768px) {
            color: #333;
          }
        }
        
        .user-role {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          
          @media (max-width: 768px) {
            color: #666;
          }
        }
      }
    }
    
    .sign-out-btn {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s;
      font-size: 0.9rem;
      
      @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
        background-color: #f8f9fa;
        color: #dc3545;
        border-color: #f8d7da;
        padding: 10px;
      }
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        
        @media (max-width: 768px) {
          background-color: #f1f1f1;
        }
      }
      
      svg {
        margin-right: 6px;
      }
    }
  }
`;

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Você saiu com sucesso!');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao sair. Tente novamente.');
    }
  };

  if (!user) return null;

  return (
    <NavbarContainer>
      <div className="navbar-container">
        <button 
          className="menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <Link to="/" className="nav-logo">
          <FaCar />
          <span className="logo-text">Controle de Veículos</span>
        </Link>
        
        <ul className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`} ref={menuRef}>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={toggleMobileMenu}
            >
              <FaHome /> Início
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/devolucao" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={toggleMobileMenu}
            >
              <FaExchangeAlt /> Devolução
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/historico" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={toggleMobileMenu}
            >
              <FaHistory /> Histórico
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/veiculos" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={toggleMobileMenu}
            >
              <FaCarAlt /> Veículos
            </NavLink>
          </li>
          
          {user.isAdmin && (
            <li>
              <NavLink 
                to="/usuarios" 
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={toggleMobileMenu}
              >
                <FaUsers /> Usuários
              </NavLink>
            </li>
          )}
          
          <li className="user-menu">
            <div className="user-info">
              <FaUserCircle className="user-avatar" />
              <div className="user-details">
                <div className="user-name">{user.nome || user.email.split('@')[0]}</div>
                <div className="user-role">{user.isAdmin ? 'Administrador' : 'Usuário'}</div>
              </div>
            </div>
            <button className="sign-out-btn" onClick={handleSignOut}>
              <FaSignOutAlt /> Sair
            </button>
          </li>
        </ul>
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
