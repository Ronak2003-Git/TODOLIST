import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { PlannerProvider } from './context/PlannerContext';
import { AuthProvider } from './context/AuthContext';
import './assets/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PlannerProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PlannerProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
