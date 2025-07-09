import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaArrowLeft, FaSave, FaSpinner, FaLock, FaUser, FaBuilding, FaUserShield } from 'react-icons/fa';

// Estilos
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;
`;

const Title = styled.h1`
  color: #1a73e8;
  margin: 0;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f3f4;
  color: #5f6368;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background: #e8eaed;
    transform: translateX(-2px);
  }
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #3c4043;
    font-size: 0.95rem;
  }
  
  .input-group {
    position: relative;
    display: flex;
    align-items: center;
    
    .input-icon {
      position: absolute;
      left: 12px;
      color: #5f6368;
      font-size: 1rem;
    }
    
    input, select {
      width: 100%;
      padding: 12px 15px 12px 40px;
      border: 1px solid #dadce0;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.2s;
      
      &:focus {
        outline: none;
        border-color: #1a73e8;
        box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
      }
      
      &[disabled] {
        background-color: #f8f9fa;
        cursor: not-allowed;
      }
    }
    
    select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235f6368' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 12px;
      padding-right: 36px;
      cursor: pointer;
    }
  }
  
  .error {
    color: #d93025;
    font-size: 0.8rem;
    margin-top: 5px;
    display: block;
  }
  
  .form-text {
    color: #5f6368;
    font-size: 0.8rem;
    margin-top: 5px;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  
  &.btn-outline {
    background: white;
    border: 1px solid #dadce0;
    color: #3c4043;
    
    &:hover {
      background: #f8f9fa;
      border-color: #c4c7c5;
    }
  }
  
  &.btn-primary {
    background: #1a73e8;
    color: white;
    border: none;
    
    &:hover {
      background: #1765cc;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    &:disabled {
      background: #9fc0f5;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: 10px;
  
  &.ativo {
    background: #e6f4ea;
    color: #188038;
  }
  
  &.inativo {
    background: #fce8e6;
    color: #d93025;
  }
`;

export default function FormularioUsuario() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    departamento: '',
    perfil: 'comum',
    status: 'ativo',
    senha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState({});
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          
          setUsuario({
            nome: data.nome,
            email: data.email,
            departamento: data.departamento || '',
            perfil: data.perfil,
            status: data.status,
            senha: '',
            confirmarSenha: ''
          });
          setUsuarioAtual(data);
        })
        .catch((error) => {
          console.error('Erro ao carregar usuário:', error);
          toast.error('Erro ao carregar usuário.');
          navigate('/usuarios');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validar = () => {
    const novosErros = {};
    if (!usuario.nome.trim()) novosErros.nome = 'O nome é obrigatório';
    if (!usuario.email.trim()) novosErros.email = 'O e-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) novosErros.email = 'E-mail inválido';
    if (!isEditing || usuario.senha) {
      if (!usuario.senha) novosErros.senha = 'A senha é obrigatória';
      else if (usuario.senha.length < 6) novosErros.senha = 'A senha deve ter pelo menos 6 caracteres';
      if (usuario.senha !== usuario.confirmarSenha) novosErros.confirmarSenha = 'As senhas não conferem';
    }
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setSaving(true);
    try {
      const userData = {
        nome: usuario.nome.trim(),
        email: usuario.email.trim().toLowerCase(),
        departamento: usuario.departamento.trim() || null,
        perfil: usuario.perfil,
        status: usuario.status
      };

      if (isEditing) {
        // Atualizar usuário existente
        const { data, error } = await supabase
          .from('usuarios')
          .update(userData)
          .eq('id', id);
          
        if (error) throw error;
        
        // Se houver senha para atualizar
        if (usuario.senha) {
          const { error: authError } = await supabase.auth.updateUser({
            password: usuario.senha
          });
          if (authError) throw authError;
        }
        
        toast.success('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: usuario.senha,
          options: {
            data: {
              nome: userData.nome,
              perfil: userData.perfil,
              status: userData.status
            }
          }
        });
        
        if (error) throw error;
        
        // Adicionar dados adicionais na tabela de perfis
        // O ID será gerado automaticamente pelo banco de dados
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert([{
            nome: userData.nome,
            email: userData.email,
            departamento: userData.departamento,
            perfil: userData.perfil,
            status: userData.status,
            senha: usuario.senha
          }]);
          
        if (profileError) {
          console.error('Erro ao criar perfil do usuário:', profileError);
          throw new Error('Erro ao criar perfil do usuário');
        }
        
        toast.success('Usuário criado com sucesso!');
      }
      
      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error(error.message || 'Erro ao salvar usuário.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <FaSpinner className="fa-spin" size={32} color="#1a73e8" />
          <p style={{ marginTop: '15px', color: '#666' }}>Carregando dados do usuário...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton to="/usuarios">
          <FaArrowLeft />
        </BackButton>
        <Title>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</Title>
      </Header>
      <FormContainer>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Row>
            <FormGroup>
              <label htmlFor="nome">Nome *</label>
              <div className="input-group">
                <span className="input-icon"><FaUser /></span>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={usuario.nome}
                  onChange={handleChange}
                  disabled={saving}
                  autoFocus
                />
              </div>
              {errors.nome && <span className="error">{errors.nome}</span>}
            </FormGroup>
            <FormGroup>
              <label htmlFor="email">E-mail *</label>
              <div className="input-group">
                <span className="input-icon"><FaUser /></span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={usuario.email}
                  onChange={handleChange}
                  disabled={isEditing || saving}
                />
              </div>
              {errors.email && <span className="error">{errors.email}</span>}
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <label htmlFor="departamento">Departamento</label>
              <div className="input-group">
                <span className="input-icon"><FaBuilding /></span>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  value={usuario.departamento || ''}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
            </FormGroup>
            <FormGroup>
              <label htmlFor="perfil">Perfil *</label>
              <div className="input-group">
                <span className="input-icon"><FaUserShield /></span>
                <select
                  id="perfil"
                  name="perfil"
                  value={usuario.perfil}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="comum">Usuário Comum</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <label htmlFor="senha">{isEditing ? 'Nova Senha' : 'Senha *'}</label>
              <div className="input-group">
                <span className="input-icon"><FaLock /></span>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={usuario.senha}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder={isEditing ? 'Deixe em branco para manter a senha atual' : ''}
                />
              </div>
              {errors.senha && <span className="error">{errors.senha}</span>}
              {!errors.senha && (
                <span className="form-text">Mínimo de 6 caracteres</span>
              )}
            </FormGroup>
            <FormGroup>
              <label htmlFor="confirmarSenha">{isEditing ? 'Confirmar Nova Senha' : 'Confirmar Senha *'}</label>
              <div className="input-group">
                <span className="input-icon"><FaLock /></span>
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={usuario.confirmarSenha}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
              {errors.confirmarSenha && <span className="error">{errors.confirmarSenha}</span>}
            </FormGroup>
          </Row>
          <FormActions>
            <Button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              <FaSave /> {isEditing ? 'Salvar Alterações' : 'Cadastrar Usuário'}
            </Button>
          </FormActions>
        </form>
      </FormContainer>
    </Container>
  );
}
