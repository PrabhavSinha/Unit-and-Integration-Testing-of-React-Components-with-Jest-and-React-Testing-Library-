/**
 * UNIT TESTS — CartSummary
 *
 * Tests a context-consuming component in isolation.
 * We wrap it with CartProvider to supply the real context.
 *
 *  ✔ Testing context-connected components
 *  ✔ Testing initial/empty state rendering
 *  ✔ Testing state updates via button clicks
 *  ✔ Assertions on DOM after state changes
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartProvider, useCart } from '../../context/CartContext';
import CartSummary from '../../components/CartSummary';

// ── Helper: render with CartProvider ─────────────────────────────────────────

function renderWithCart(ui) {
  return render(<CartProvider>{ui}</CartProvider>);
}

// ── Helper component: adds items to cart for test setup ───────────────────────

const ITEM_A = { id: 1, title: 'Laptop',   price: 999, thumbnail: '' };
const ITEM_B = { id: 2, title: 'Mouse',     price: 29,  thumbnail: '' };

function CartSeeder({ items = [] }) {
  const { addItem } = useCart();
  return (
    <div>
      {items.map(item => (
        <button key={item.id} onClick={() => addItem(item)} data-testid={`seed-${item.id}`}>
          Seed {item.title}
        </button>
      ))}
    </div>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CartSummary — Empty State', () => {
  test('renders empty cart message when cart is empty', () => {
    renderWithCart(<CartSummary />);
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    expect(screen.getByTestId('cart-empty')).toHaveTextContent('cart is empty');
  });

  test('does NOT render cart summary when empty', () => {
    renderWithCart(<CartSummary />);
    expect(screen.queryByTestId('cart-summary')).not.toBeInTheDocument();
  });
});

describe('CartSummary — With Items', () => {
  function setup() {
    renderWithCart(
      <>
        <CartSeeder items={[ITEM_A, ITEM_B]} />
        <CartSummary />
      </>
    );
    // Seed items
    fireEvent.click(screen.getByTestId('seed-1'));
    fireEvent.click(screen.getByTestId('seed-2'));
  }

  test('shows cart summary after items are added', () => {
    setup();
    expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
  });

  test('displays correct item titles', () => {
    setup();
    expect(screen.getByTestId('item-title-1')).toHaveTextContent('Laptop');
    expect(screen.getByTestId('item-title-2')).toHaveTextContent('Mouse');
  });

  test('displays correct total items count', () => {
    setup();
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
  });

  test('displays correct total price', () => {
    setup();
    // $999 + $29 = $1028.00
    expect(screen.getByTestId('total-price')).toHaveTextContent('$1028.00');
  });

  test('each item starts with qty 1', () => {
    setup();
    expect(screen.getByTestId('qty-1')).toHaveTextContent('1');
    expect(screen.getByTestId('qty-2')).toHaveTextContent('1');
  });
});

describe('CartSummary — Quantity Controls (State Updates)', () => {
  function setup() {
    renderWithCart(
      <>
        <CartSeeder items={[ITEM_A]} />
        <CartSummary />
      </>
    );
    fireEvent.click(screen.getByTestId('seed-1'));
  }

  test('increments quantity when + is clicked', () => {
    setup();
    fireEvent.click(screen.getByTestId('increment-1'));
    expect(screen.getByTestId('qty-1')).toHaveTextContent('2');
  });

  test('decrements quantity when - is clicked', () => {
    setup();
    fireEvent.click(screen.getByTestId('increment-1')); // qty → 2
    fireEvent.click(screen.getByTestId('decrement-1')); // qty → 1
    expect(screen.getByTestId('qty-1')).toHaveTextContent('1');
  });

  test('removes item from cart when qty is decremented to 0', () => {
    setup();
    fireEvent.click(screen.getByTestId('decrement-1'));
    // qty was 1 → should be removed
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
  });

  test('updates total price when quantity changes', () => {
    setup();
    expect(screen.getByTestId('total-price')).toHaveTextContent('$999.00');
    fireEvent.click(screen.getByTestId('increment-1'));
    expect(screen.getByTestId('total-price')).toHaveTextContent('$1998.00');
  });
});

describe('CartSummary — Remove and Clear', () => {
  function setup() {
    renderWithCart(
      <>
        <CartSeeder items={[ITEM_A, ITEM_B]} />
        <CartSummary />
      </>
    );
    fireEvent.click(screen.getByTestId('seed-1'));
    fireEvent.click(screen.getByTestId('seed-2'));
  }

  test('removes a single item when Remove is clicked', () => {
    setup();
    fireEvent.click(screen.getByTestId('remove-1'));
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
  });

  test('clears all items when Clear Cart is clicked', () => {
    setup();
    fireEvent.click(screen.getByTestId('clear-cart-btn'));
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('cart-summary')).not.toBeInTheDocument();
  });
});
