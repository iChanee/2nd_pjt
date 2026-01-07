import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OceanBackground from './components/OceanBackground';
import Header from './tiles/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <OceanBackground>
        <div className="min-h-screen flex flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </OceanBackground>
    </Router>
  );
}

export default App;
