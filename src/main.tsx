/**
 * Ponto de Entrada React (src/main.tsx)
 * Importa as camadas globais de CSS Puro na ordem obrigatória
 * (reset -> tokens -> themes -> typography -> layout -> print) e monta o App.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/themes.css';
import './styles/typography.css';
import './styles/layout.css';
import './styles/print.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
