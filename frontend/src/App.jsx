import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ReservaPage from './pages/ReservaPage';
import DevolucaoPage from './pages/DevolucaoPage';
import HistoricoPage from './pages/HistoricoPage';

const theme = createTheme();
export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Controle de Veículos</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Reserva</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/devolucao">Devolução</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/historico">Histórico</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<ReservaPage />} />
          <Route path="/devolucao" element={<DevolucaoPage />} />
          <Route path="/historico" element={<HistoricoPage />} />
        </Routes>
      </div>
    </Router>
  );
}
