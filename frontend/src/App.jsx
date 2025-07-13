import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import ReservaPage from './pages/ReservaPage';
import DevolucaoPage from './pages/DevolucaoPage';
import HistoricoPage from './pages/HistoricoPage';
import VeiculosPage from './pages/VeiculosPage';
import ListaUsuarios from './pages/usuarios/ListaUsuarios';
import FormularioUsuario from './pages/usuarios/FormularioUsuario';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import { GlobalStyles } from './styles/GlobalStyles';

const theme = createTheme();

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <StyledThemeProvider theme={{}}>
          <GlobalStyles />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </StyledThemeProvider>
      </AuthProvider>
    </Router>
  );
}

function AppLayout() {
  // O Navbar aparece em todas as páginas protegidas (menos login)
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<PrivateRoute><ReservaPage /></PrivateRoute>} />
          <Route path="/devolucao" element={<PrivateRoute><DevolucaoPage /></PrivateRoute>} />
          <Route path="/historico" element={<PrivateRoute><HistoricoPage /></PrivateRoute>} />
          <Route path="/veiculos" element={<PrivateRoute><VeiculosPage /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute adminOnly><ListaUsuarios /></PrivateRoute>} />
          <Route path="/usuarios/novo" element={<PrivateRoute adminOnly><FormularioUsuario /></PrivateRoute>} />
          <Route path="/usuarios/editar/:id" element={<PrivateRoute adminOnly><FormularioUsuario /></PrivateRoute>} />
        </Routes>
      </div>
    </>
  );
}

