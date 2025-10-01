import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

// Ensure the saved theme is applied before React renders to avoid flash
const savedTheme = (localStorage.getItem('theme') || '') as 'light' | 'dark';
if (savedTheme) {
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
} else {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', prefersDark);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
