import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import TestsPage   from './pages/TestsPage';
import DemoPage    from './pages/DemoPage';
import './App.css';

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/"      element={<Home />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/demo"  element={<DemoPage />} />
      </Routes>
    </CartProvider>
  );
}
