import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">
        <span className="brand-dot" />
        <span>Test<strong>Lab</strong></span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/"      end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
        <NavLink to="/tests"    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Test Explorer</NavLink>
        <NavLink to="/demo"     className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Live Demo {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </NavLink>
      </div>
    </nav>
  );
}
