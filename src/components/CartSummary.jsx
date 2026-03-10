import React from 'react';
import { useCart } from '../context/CartContext';

/**
 * CartSummary — consumes CartContext and renders cart totals + item list.
 * Provides increment/decrement/remove controls for integration testing.
 */
export default function CartSummary() {
  const { items, totalItems, totalPrice, increment, decrement, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-empty" data-testid="cart-empty">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-summary" data-testid="cart-summary">
      <h2 className="cart-title">Cart ({totalItems} items)</h2>

      <ul className="cart-items" data-testid="cart-items">
        {items.map(item => (
          <li key={item.id} className="cart-item" data-testid={`cart-item-${item.id}`}>
            <span className="item-title" data-testid={`item-title-${item.id}`}>
              {item.title}
            </span>
            <span className="item-price" data-testid={`item-price-${item.id}`}>
              ${(item.price * item.qty).toFixed(2)}
            </span>

            <div className="qty-controls">
              <button
                onClick={() => decrement(item.id)}
                data-testid={`decrement-${item.id}`}
                aria-label={`Decrease quantity of ${item.title}`}
              >−</button>
              <span data-testid={`qty-${item.id}`}>{item.qty}</span>
              <button
                onClick={() => increment(item.id)}
                data-testid={`increment-${item.id}`}
                aria-label={`Increase quantity of ${item.title}`}
              >+</button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              data-testid={`remove-${item.id}`}
              aria-label={`Remove ${item.title}`}
              className="remove-btn"
            >Remove</button>
          </li>
        ))}
      </ul>

      <div className="cart-totals" data-testid="cart-totals">
        <p>Total Items: <strong data-testid="total-items">{totalItems}</strong></p>
        <p>Total Price: <strong data-testid="total-price">${totalPrice.toFixed(2)}</strong></p>
      </div>

      <button
        onClick={clearCart}
        data-testid="clear-cart-btn"
        className="clear-btn"
      >
        Clear Cart
      </button>
    </div>
  );
}
