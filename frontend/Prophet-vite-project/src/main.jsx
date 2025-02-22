import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar.jsx';
import Landing from './pages/Landing.jsx'; // Example page
// import About from './pages/About.jsx'; // Example page
// import Settings from './pages/Settings.jsx'; // Example page
import testing from './pages/testing.jsx'; // Example page
import Crypto from './pages/CryptoPort.jsx';
import Markets from './pages/Markets.jsx';
import Login from './pages/Login.jsx';
import CoinGraph from './pages/CoinGraph.jsx';
import Register from './pages/Register.jsx';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar /> {/* Navbar is always at the top */}
        <Routes>
          {/* Define your routes here */}
          <Route path="/" element={<Landing />} /> {/* Home page */}
          <Route path="/about" element={<Crypto />} /> 
          <Route path="/markets" element={<Markets />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/coin-graph/:id" element={<CoinGraph />} />
          <Route path="/register/" element={<Register />} />
          {/* <Route path="/settings" element={<Settings />} /> Settings page */}
          {/* <Route path="/profile" element={<Profile />} /> Profile page */}
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);