import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ReservaPage from './pages/ReservaPage';
import DevolucaoPage from './pages/DevolucaoPage';
import HistoricoPage from './pages/HistoricoPage';

const menuItems = [
  { label: 'Reserva de Veículo', path: '/' },
  { label: 'Devolução de Veículo', path: '/devolucao' },
  { label: 'Histórico de Reservas', path: '/historico' },
];

export default function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const location = useLocation();

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f4f6fa', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema de Controle de Veículos
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {menuItems.map(item => (
              <Button
                key={item.path}
                color={location.pathname === item.path ? 'secondary' : 'inherit'}
                component={Link}
                to={item.path}
                sx={{ ml: 2 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { sm: 'none' } }}
      >
        <List>
          {menuItems.map(item => (
            <ListItem button component={Link} to={item.path} key={item.path} onClick={() => setDrawerOpen(false)}>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<ReservaPage />} />
          <Route path="/devolucao" element={<DevolucaoPage />} />
          <Route path="/historico" element={<HistoricoPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
