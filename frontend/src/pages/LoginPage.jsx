import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FaUser, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  padding: 40px;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Logo = styled.div`
  margin-bottom: 30px;
  
  h1 {
    color: #1a73e8;
    margin: 0;
    font-size: 28px;
    font-weight: 700;
  }
  
  p {
    color: #666;
    margin: 5px 0 0;
    font-size: 14px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #444;
    font-size: 14px;
  }
  
  .input-group {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:focus-within {
      border-color: #1a73e8;
      box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.2);
    }
  }
  
  .input-icon {
    padding: 0 15px;
    color: #777;
    background: #f5f5f5;
    height: 46px;
    display: flex;
    align-items: center;
    border-right: 1px solid #eee;
  }
  
  input {
    flex: 1;
    padding: 12px 15px;
    border: none;
    outline: none;
    font-size: 15px;
    
    &::placeholder {
      color: #999;
    }
  }
  
  .error {
    color: #e74c3c;
    font-size: 13px;
    margin-top: 5px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background: #1557b0;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(26, 115, 232, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Footer = styled.div`
  margin-top: 25px;
  font-size: 14px;
  color: #666;
  
  a {
    color: #1a73e8;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fde8e8;
  color: #e53e3e;
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: left;
  border-left: 4px solid #e53e3e;
`;

const LoginPage = () => {
  const [email, setEmail] = useState('admin@example.com'); // Preenche com email de teste
  const [senha, setSenha] = useState('admin123'); // Preenche com senha de teste
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação simples
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await signIn(email, senha);
      if (success) {
        navigate('/');
      } else {
        setError('Credenciais inválidas/Usuario inativo.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <h1>Controle de Veículos</h1>
          <p>Acesse sua conta para continuar</p>
        </Logo>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="email">E-mail</label>
            <div className="input-group">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </FormGroup>
          
          <FormGroup>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="senha">Senha</label>
              <Link to="/esqueci-senha" style={{ fontSize: '13px', color: '#1a73e8' }}>
                Esqueceu a senha?
              </Link>
            </div>
            <div className="input-group">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
              />
            </div>
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </Button>
        </form>
        
        <Footer>
          <p>Não tem uma conta? <Link to="/cadastro">Fale com o administrador</Link></p>
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
