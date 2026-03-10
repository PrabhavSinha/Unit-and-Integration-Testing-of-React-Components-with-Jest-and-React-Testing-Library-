/**
 * INTEGRATION TESTS — Full Shopping Flow
 *
 * Tests the complete user journey across multiple components:
 * ProductList → add to cart → CartSummary reflects changes
 *
 * All components share the same CartContext, so actions in one
 * component are immediately visible in another.
 *
 *  ✔ Cross-component state via Context
 *  ✔ Complete user interaction flows
 *  ✔ UI consistency across components after state changes
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CartProvider } from '../../context/CartContext';
import ProductList from '../../components/ProductList';
import CartSummary from '../../components/CartSummary';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1, title: 'Laptop Pro',     brand: 'TechCo', price: 1200, rating: 4.8, stock: 15, thumbnail: '', discountPercentage: 0 },
  { id: 2, title: 'Wireless Mouse', brand: 'ClickIt', price: 29,  rating: 4.2, stock: 50, thumbnail: '', discountPercentage: 0 },
];

/**
 * ShopPage — simulates a real page that has both components
 * and connects them via CartContext.
 */
function ShopPage() {
  const [cartVisible, setCartVisible] = React.useState(false);
  const { addItem } = require('../../context/CartContext').useCart
    ? { addItem: null } : { addItem: null };

  return (
    <CartProvider>
      <ShopPageInner />
    </CartProvider>
  );
}

// Inner component that can useCart
function ShopPageInner() {
  const { addItem } = require('../../context/CartContext').useCart
    ? require('../../context/CartContext').useCart()
    : {};

  return (
    <>
      <ProductList products={PRODUCTS} onAddToCart={addItem} />
      <CartSummary />
    </>
  );
}

// Simpler helper used throughout tests
function renderShopPage() {
  const { useCart } = require('../../context/CartContext');

  function Inner() {
    const { addItem } = useCart();
    return (
      <>
        <ProductList products={PRODUCTS} onAddToCart={addItem} />
        <CartSummary />
      </>
    );
  }

  return render(
    <CartProvider>
      <Inner />
    </CartProvider>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Full Shopping Flow — Product → Cart Integration', () => {
  test('cart is empty before any item is added', () => {
    renderShopPage();
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
  });

  test('adding a product shows it in CartSummary', () => {
    renderShopPage();
    const cards = screen.getAllByTestId('product-card');
    fireEvent.click(within(cards[0]).getByTestId('add-to-cart-btn'));

    expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
    expect(screen.getByTestId('item-title-1')).toHaveTextContent('Laptop Pro');
  });

  test('adding two different products shows both in cart', () => {
    renderShopPage();
    const cards = screen.getAllByTestId('product-card');

    fireEvent.click(within(cards[0]).getByTestId('add-to-cart-btn'));
    fireEvent.click(within(cards[1]).getByTestId('add-to-cart-btn'));

    expect(screen.getByTestId('item-title-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-title-2')).toBeInTheDocument();
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
  });

  test('adding same product twice increases quantity to 2', () => {
    renderShopPage();
    const cards = screen.getAllByTestId('product-card');
    const addBtn = within(cards[0]).getByTestId('add-to-cart-btn');

    fireEvent.click(addBtn);
    fireEvent.click(addBtn);

    expect(screen.getByTestId('qty-1')).toHaveTextContent('2');
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
  });

  test('total price updates correctly after adding products', () => {
    renderShopPage();
    const cards = screen.getAllByTestId('product-card');

    fireEvent.click(within(cards[0]).getByTestId('add-to-cart-btn')); // $1200
    fireEvent.click(within(cards[1]).getByTestId('add-to-cart-btn')); // $29

    expect(screen.getByTestId('total-price')).toHaveTextContent('$1229.00');
  });

  test('removing item from cart via CartSummary removes it', () => {
    renderShopPage();
    const cards = screen.getAllByTestId('product-card');

    fireEvent.click(within(cards[0]).getByTestId('add-to-cart-btn'));
    expect(screen.getByTestId('item-title-1')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('remove-1'));
    expect(screen.queryByTestId('item-title-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
  });

  test('clearing cart after adding multiple products empties it', () => {
    renderShopPage();
    const cards = screen.getAllByTestId('product-card');

    fireEvent.click(within(cards[0]).getByTestId('add-to-cart-btn'));
    fireEvent.click(within(cards[1]).getByTestId('add-to-cart-btn'));

    fireEvent.click(screen.getByTestId('clear-cart-btn'));
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('cart-summary')).not.toBeInTheDocument();
  });
});

describe('Full Shopping Flow — Search + Add to Cart', () => {
  test('searching and then adding filtered product works correctly', async () => {
    renderShopPage();

    await userEvent.type(screen.getByTestId('search-input'), 'Mouse');
    expect(screen.getAllByTestId('product-card')).toHaveLength(1);

    fireEvent.click(screen.getByTestId('add-to-cart-btn'));
    expect(screen.getByTestId('item-title-2')).toHaveTextContent('Wireless Mouse');
  });

  test('cart state persists after search is cleared', async () => {
    renderShopPage();
    const input = screen.getByTestId('search-input');

    // Add while searching
    await userEvent.type(input, 'Mouse');
    fireEvent.click(screen.getByTestId('add-to-cart-btn'));

    // Clear search
    await userEvent.clear(input);
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);

    // Cart should still have the item
    expect(screen.getByTestId('item-title-2')).toBeInTheDocument();
    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
  });
});
