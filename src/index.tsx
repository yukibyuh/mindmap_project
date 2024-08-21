import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure this import is from 'react-dom/client'
import App from './App';
import './index.css';

// Correct way to use createRoot in React 18+
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
