import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { 
  FaUserPlus, FaEdit, FaTrash, FaSearch, 
  FaUserCheck, FaUserTimes, FaUserCog 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Estilos
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
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

const SearchBar = styled.div`
  display: flex;
  max-width: 400px;
  width: 100%;
  
  input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 6px 0 0 6px;
    font-size: 14px;
    outline: none;
    transition: all 0.3s;
    
    &:focus {
      border-color: #1a73e8;
      box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.2);
    }
  }
  
  button {
    background: #1a73e8;
    color: white;
    border: none;
    padding: 0 15px;
    border-radius: 0 6px 6px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s;
    
    &:hover {
      background: #1557b0;
    }
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' ? '#1a73e8' : props.variant === 'success' ? '#34a853' : '#f1f3f4'};
  color: ${props => (props.variant === 'primary' || props.variant === 'success') ? 'white' : '#333'};
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background: #f8f9fa;
    color: #555;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  tr:hover {
    background: #f8f9fa;
  }
  
  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  
  .status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    
    &.ativo {
      background: #e6f4ea;
      color: #188038;
    }
    
    &.inativo {
      background: #fce8e6;
      color: #d93025;
    }
  }
  
  .perfil {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    background: #e8f0fe;
    color: #1a73e8;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 15px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  .info {
    color: #666;
    font-size: 0.9rem;
  }
  
  .pagination-buttons {
    display: flex;
    gap: 10px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  
  svg {
    font-size: 3rem;
    color: #ddd;
    margin-bottom: 15px;
  }
  
  h3 {
    margin: 0 0 10px;
    color: #444;
  }
  
  p {
    margin: 0 0 20px;
  }
`;

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItens, setTotalItens] = useState(0);
  const [busca, setBusca] = useState('');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const LIMITE_POR_PAGINA = 10;

  // Carrega a lista de usuários
  const carregarUsuarios = async (pagina = 1, termoBusca = '') => {
    try {
      setLoading(true);
      const response = await api.get('/api/usuarios', {
        params: {
          pagina,
          limite: LIMITE_POR_PAGINA,
          busca: termoBusca
        }
      });
      
      setUsuarios(response.data.usuarios);
      setTotalItens(response.data.total);
      setTotalPaginas(response.data.totalPaginas);
      setPaginaAtual(response.data.paginaAtual);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar usuários quando a página ou busca mudar
  useEffect(() => {
    carregarUsuarios(paginaAtual, busca);
  }, [paginaAtual, busca]);

  // Função para alternar status do usuário (ativo/inativo)
  const toggleStatusUsuario = async (id, statusAtual) => {
    if (!window.confirm(`Tem certeza que deseja ${statusAtual === 'ativo' ? 'inativar' : 'ativar'} este usuário?`)) {
      return;
    }
    
    try {
      if (statusAtual === 'ativo') {
        await api.put(`/api/usuarios/${id}/inativar`);
        toast.success('Usuário inativado com sucesso!');
      } else {
        await api.put(`/api/usuarios/${id}/ativar`);
        toast.success('Usuário ativado com sucesso!');
      }
      
      // Recarrega a lista de usuários
      carregarUsuarios(paginaAtual, busca);
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar status do usuário.');
    }
  };

  // Função para lidar com a busca
  const handleBuscar = (e) => {
    e.preventDefault();
    const termo = e.target.busca.value.trim();
    setBusca(termo);
    setPaginaAtual(1); // Volta para a primeira página ao buscar
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Header>
        <Title>
          <FaUserCog /> Usuários
        </Title>
        <div style={{ display: 'flex', gap: 12 }}>
          {isAdmin && (
            <Button variant="primary" onClick={() => navigate('/usuarios/novo')}>
              <FaUserPlus /> Novo Usuário
            </Button>
          )}
          <form onSubmit={handleBuscar} style={{ maxWidth: '400px', marginLeft: 10 }}>
            <SearchBar>
              <input 
                type="text" 
                name="busca"
                placeholder="Buscar usuários..."
                defaultValue={busca}
              />
              <button type="submit">
                <FaSearch /> Buscar
              </button>
            </SearchBar>
          </form>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/usuarios/novo')}
        >
          <FaUserPlus /> Novo Usuário
        </Button>
      </Header>
      
      <TableContainer>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p style={{ marginTop: '15px', color: '#666' }}>Carregando usuários...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <EmptyState>
            <FaUserCog />
            <h3>Nenhum usuário encontrado</h3>
            <p>{busca ? 'Tente ajustar sua busca ou' : ''} crie um novo usuário para começar.</p>
            <Button 
              variant="primary" 
              onClick={() => {
                setBusca('');
                navigate('/usuarios/novo');
              }}
            >
              <FaUserPlus /> Adicionar Usuário
            </Button>
          </EmptyState>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Departamento</th>
                  <th>Status</th>
                  <th>Perfil</th>
                  <th>Cadastrado em</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <strong>{usuario.nome}</strong>
                    </td>
                    <td>{usuario.email}</td>
                    <td>{usuario.departamento || '-'}</td>
                    <td>
                      <span className={`status ${usuario.status}`}>
                        {usuario.status === 'ativo' ? (
                          <>
                            <FaUserCheck /> Ativo
                          </>
                        ) : (
                          <>
                            <FaUserTimes /> Inativo
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="perfil">
                        {usuario.perfil === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </td>
                    <td>{formatarData(usuario.data_cadastro)}</td>
                    <td className="actions">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/usuarios/editar/${usuario.id}`)}
                        title="Editar usuário"
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant={usuario.status === 'ativo' ? 'outline' : 'success'}
                        onClick={() => toggleStatusUsuario(usuario.id, usuario.status)}
                        title={usuario.status === 'ativo' ? 'Inativar usuário' : 'Ativar usuário'}
                      >
                        {usuario.status === 'ativo' ? <FaUserTimes /> : <FaUserCheck />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {totalPaginas > 1 && (
              <Pagination>
                <div className="info">
                  Mostrando {usuarios.length} de {totalItens} usuários
                </div>
                <div className="pagination-buttons">
                  <Button 
                    onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1 || loading}
                  >
                    Anterior
                  </Button>
                  <Button 
                    onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtual === totalPaginas || loading}
                  >
                    Próxima
                  </Button>
                </div>
              </Pagination>
            )}
          </>
        )}
      </TableContainer>
    </Container>
  );
};

export default ListaUsuarios;
