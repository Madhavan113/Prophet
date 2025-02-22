import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Assuming your App component is in App.jsx
import Landing from './Landing.jsx';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<React.StrictMode><Landing /></React.StrictMode>);
