import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './pages/Landing.jsx';
import Markets from './pages/Markets.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx'; // Import the Register page

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '1rem', paddingTop: '4rem' }}> {/* Adjust to avoid navbar overlap */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/login" element={<Login />} /> {/* Login Page */}
          <Route path="/register" element={<Register />} /> {/* Register Page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
