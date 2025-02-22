// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './pages/Landing.jsx';
import testing from './pages/testing.jsx';
// import About from './pages/About';
// import Contact from './pages/Contact';

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* {/* <Route path="/about" element={<About />} /> */}
          <Route path="/contact" element={<testing />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
