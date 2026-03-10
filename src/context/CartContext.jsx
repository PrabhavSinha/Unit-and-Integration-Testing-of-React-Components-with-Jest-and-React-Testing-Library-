import React, { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.item.id);
      if (existing) {
        return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'INCREMENT':
      return state.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case 'DECREMENT':
      return state.map(i =>
        i.id === action.id ? (i.qty <= 1 ? null : { ...i, qty: i.qty - 1 }) : i
      ).filter(Boolean);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const addItem    = useCallback((item) => dispatch({ type: 'ADD', item }), []);
  const removeItem = useCallback((id)   => dispatch({ type: 'REMOVE', id }), []);
  const increment  = useCallback((id)   => dispatch({ type: 'INCREMENT', id }), []);
  const decrement  = useCallback((id)   => dispatch({ type: 'DECREMENT', id }), []);
  const clearCart  = useCallback(()     => dispatch({ type: 'CLEAR' }), []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addItem, removeItem, increment, decrement, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
