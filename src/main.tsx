import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles/main.css';

import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
      <Analytics />
    </React.StrictMode>,
  );
}
