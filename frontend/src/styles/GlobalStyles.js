import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Estilos gerais para mobile */
  @media (max-width: 768px) {
    /* Ajustes gerais de layout */
    body {
      font-size: 14px;
      -webkit-text-size-adjust: 100%;
    }

    /* Container principal */
    .container {
      padding: 0 10px;
      width: 100%;
      max-width: 100%;
    }

    /* Tabelas */
    table {
      display: block;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      
      th, td {
        padding: 8px 10px;
        font-size: 13px;
      }
    }

    /* Cards de estatísticas */
    .stats-container {
      grid-template-columns: 1fr !important;
      gap: 10px !important;
    }

    .stat-card {
      padding: 15px !important;
      
      svg {
        font-size: 20px !important;
      }
      
      h3 {
        font-size: 16px !important;
      }
      
      p {
        font-size: 18px !important;
      }
    }

    /* Formulários */
    form {
      .form-group {
        margin-bottom: 15px;
      }
      
      label {
        font-size: 14px;
        margin-bottom: 5px;
        display: block;
      }
      
      input, select, textarea {
        width: 100% !important;
        padding: 10px !important;
        font-size: 14px !important;
      }
      
      button[type="submit"] {
        width: 100%;
        padding: 12px;
        font-size: 16px;
      }
    }

    /* Botões */
    button, .btn {
      padding: 10px 15px !important;
      font-size: 14px !important;
      min-height: 44px; /* Tamanho mínimo para toque */
      min-width: 44px;
      
      & + button, & + .btn {
        margin-left: 0;
        margin-top: 10px;
      }
    }

    /* Cabeçalhos */
    h1 {
      font-size: 22px !important;
    }
    
    h2 {
      font-size: 20px !important;
    }
    
    h3 {
      font-size: 18px !important;
    }

    /* Modais */
    .modal-content {
      margin: 10px;
      width: calc(100% - 20px) !important;
      max-height: 90vh;
      overflow-y: auto;
    }

    /* Barra de navegação */
    .navbar {
      padding: 10px 15px;
      
      .navbar-brand {
        font-size: 18px;
      }
      
      .navbar-toggler {
        padding: 5px 10px;
      }
    }

    /* Cards */
    .card {
      margin-bottom: 15px;
      
      .card-body {
        padding: 15px;
      }
      
      .card-title {
        font-size: 16px;
      }
    }

    /* Grids */
    .row {
      margin-left: -8px;
      margin-right: -8px;
      
      [class*="col-"] {
        padding-left: 8px;
        padding-right: 8px;
      }
    }

    /* Ajustes específicos para tabelas de dados */
    .data-table {
      th, td {
        padding: 8px 5px !important;
        font-size: 13px;
        
        &:first-child {
          padding-left: 10px !important;
        }
        
        &:last-child {
          padding-right: 10px !important;
        }
      }
      
      .btn-sm {
        padding: 5px 8px !important;
        font-size: 12px !important;
      }
    }
  }

  /* Ajustes para telas muito pequenas */
  @media (max-width: 480px) {
    body {
      font-size: 13px;
    }
    
    .container {
      padding: 0 8px;
    }
    
    .btn {
      padding: 8px 12px !important;
      font-size: 13px !important;
    }
    
    .modal-dialog {
      margin: 5px;
      width: calc(100% - 10px);
    }
  }
`;
