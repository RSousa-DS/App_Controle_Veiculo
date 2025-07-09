import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  FaCar, FaCalendarAlt, FaHistory, FaUserCog, 
  FaSignOutAlt, FaBars, FaTimes, FaUserCircle, FaUser,
  FaPlus, FaCog, FaChevronDown, FaCarAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const NavbarContainer = styled.nav`
  background: #1a73e8;
  
  .dropdown-menu {
    position: relative;
    display: inline-block;
    height: 100%;
    display: flex;
    align-items: center;
    
    .dropdown-toggle {
      background: none;
      border: none;
      color: white;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      transition: all 0.2s;
      height: 100%;
      margin: 0;
      white-space: nowrap;
      
      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      
      svg {
        transition: transform 0.2s;
      }
      
      &[aria-expanded="true"] {
        background: rgba(255, 255, 255, 0.15);
        svg:last-child {
          transform: rotate(180deg);
        }
      }
    }
    
    .dropdown-content {
      display: none;
      position: absolute;
      background: white;
      min-width: 200px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      border-radius: 4px;
      z-index: 1000;
      overflow: hidden;
      top: 100%;
      left: 0;
      margin-top: 5px;
      border: 1px solid rgba(0,0,0,0.1);
      
      a {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 15px;
        color: #333;
        text-decoration: none;
        transition: all 0.2s;
        
        &:hover {
          background: #f8f9fa;
          color: #1a73e8;
        }
        
        &.active {
          background: #e8f0fe;
          color: #1a73e8;
          font-weight: 500;
        }
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    
    &:hover .dropdown-content {
      display: block;
    }
    
    @media (max-width: 768px) {
      width: 100%;
      
      .dropdown-toggle {
        width: 100%;
        justify-content: space-between;
      }
      
      .dropdown-content {
        position: static;
        box-shadow: none;
        background: rgba(0,0,0,0.05);
        margin-top: 10px;
        display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
      }
    }
  }
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    color: #e1f5fe;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: #1a73e8;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    z-index: 999;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 0.95rem;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
    font-weight: 500;
  }
  
  .dropdown-menu & {
    padding: 10px 15px;
    color: #333;
    
    &:hover {
      background: #f5f5f5;
    }
    
    &.active {
      background: #e8f0fe;
      color: #1a73e8;
    }
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #0d47a1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .user-name {
    font-size: 0.9rem;
    font-weight: 500;
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  .dropdown {
    position: absolute;
    top: 45px;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    min-width: 200px;
    overflow: hidden;
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    z-index: 1000;
    
    .dropdown-item {
      padding: 12px 15px;
      color: #333;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      transition: all 0.2s;
      
      &:hover {
        background: #f5f5f5;
      }
      
      &.danger {
        color: #e74c3c;
      }
    }
    
    .divider {
      height: 1px;
      background: #eee;
      margin: 5px 0;
    }
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    toast.success('Você saiu com sucesso!');
  };

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          <FaCar /> Controle de Veículos
        </Logo>
        
        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
        
        <NavLinks $isOpen={isMenuOpen} ref={mobileMenuRef}>
          <NavLink 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            <FaCalendarAlt /> Reservas
          </NavLink>
          
          <NavLink 
            to="/devolucao" 
            className={location.pathname === '/devolucao' ? 'active' : ''}
          >
            <FaCar /> Devoluções
          </NavLink>
          
          <NavLink 
            to="/historico" 
            className={location.pathname === '/historico' ? 'active' : ''}
          >
            <FaHistory /> Histórico
          </NavLink>
          
          {isAdmin && (
            <div className="dropdown-menu">
              <button 
                className="dropdown-toggle" 
                aria-expanded={location.pathname === '/veiculos' || location.pathname.startsWith('/usuarios')}
              >
                <FaCog /> Cadastros <FaChevronDown size={12} />
              </button>
              <div className="dropdown-content">
                <Link 
                  to="/veiculos" 
                  className={location.pathname === '/veiculos' ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaCarAlt /> Veículos
                </Link>
                <Link 
                  to="/usuarios" 
                  className={location.pathname.startsWith('/usuarios') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserCog /> Usuários
                </Link>
              </div>
            </div>
          )}
        </NavLinks>
        
        <UserMenu 
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          $isOpen={isUserMenuOpen}
          ref={userMenuRef}
        >
          <div className="user-avatar">
            <FaUserCircle size={20} />
          </div>
          <div className="user-name">
            {user.nome || user.email.split('@')[0]}
          </div>
          
          <div className="dropdown">
            <div className="dropdown-item" onClick={() => navigate('/perfil')}>
              <FaUser /> Meu Perfil
            </div>
            <div className="divider"></div>
            <div className="dropdown-item danger" onClick={handleSignOut}>
              <FaSignOutAlt /> Sair
            </div>
          </div>
        </UserMenu>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
