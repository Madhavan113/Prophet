// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './pages/Landing.jsx';
import Markets from './pages/Markets.jsx'; // if applicable
import Login from './pages/Login.jsx'; // Make sure the path and filename are correct

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '1rem', paddingTop: '4rem' }}> {/* Adjust to avoid navbar overlap */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/login" element={<Login />} /> {/* This route renders the login page */}
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
