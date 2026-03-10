/**
 * UNIT TESTS — ProductCard
 *
 * Tests the ProductCard component in isolation.
 * Each test renders the component with specific props
 * and asserts the expected DOM output or behaviour.
 *
 * Skills demonstrated:
 *  ✔ Unit testing with Jest + RTL
 *  ✔ Testing props → DOM rendering
 *  ✔ Testing conditional rendering
 *  ✔ Testing click events / callbacks
 *  ✔ Testing disabled state
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../../components/ProductCard';

// ── Shared test fixtures ──────────────────────────────────────────────────────

const baseProduct = {
  id: 1,
  title: 'Wireless Headphones',
  brand: 'SoundMax',
  price: 99.99,
  rating: 4.5,
  stock: 25,
  thumbnail: 'headphones.jpg',
  discountPercentage: 0,
};

const discountedProduct = {
  ...baseProduct,
  id: 2,
  price: 200,
  discountPercentage: 20,
};

const lowStockProduct  = { ...baseProduct, id: 3, stock: 3 };
const outOfStockProduct = { ...baseProduct, id: 4, stock: 0 };

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProductCard — Rendering Props', () => {
  test('renders product title', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByTestId('product-title')).toHaveTextContent('Wireless Headphones');
  });

  test('renders product brand', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByTestId('product-brand')).toHaveTextContent('SoundMax');
  });

  test('renders product price formatted to 2 decimal places', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByTestId('product-price')).toHaveTextContent('$99.99');
  });

  test('renders product rating', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByTestId('product-rating')).toHaveTextContent('4.5');
  });

  test('renders product image with correct alt text', () => {
    render(<ProductCard product={baseProduct} />);
    const img = screen.getByTestId('product-image');
    expect(img).toHaveAttribute('alt', 'Wireless Headphones');
    expect(img).toHaveAttribute('src', 'headphones.jpg');
  });

  test('does NOT render brand when brand is absent', () => {
    const noBrand = { ...baseProduct, brand: undefined };
    render(<ProductCard product={noBrand} />);
    expect(screen.queryByTestId('product-brand')).not.toBeInTheDocument();
  });
});

describe('ProductCard — Discount Display', () => {
  test('does NOT show discount badge when discountPercentage is 0', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.queryByTestId('discount-badge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('original-price')).not.toBeInTheDocument();
  });

  test('shows discount badge when product has a discount', () => {
    render(<ProductCard product={discountedProduct} />);
    expect(screen.getByTestId('discount-badge')).toBeInTheDocument();
    expect(screen.getByTestId('discount-badge')).toHaveTextContent('-20%');
  });

  test('calculates and displays discounted price correctly', () => {
    render(<ProductCard product={discountedProduct} />);
    // $200 - 20% = $160.00
    expect(screen.getByTestId('product-price')).toHaveTextContent('$160.00');
  });

  test('shows original price when discount applies', () => {
    render(<ProductCard product={discountedProduct} />);
    expect(screen.getByTestId('original-price')).toHaveTextContent('$200.00');
  });
});

describe('ProductCard — Stock Status', () => {
  test('shows "In Stock" for normal stock levels', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByTestId('stock-status')).toHaveTextContent('In Stock');
  });

  test('shows low stock warning when stock < 10', () => {
    render(<ProductCard product={lowStockProduct} />);
    expect(screen.getByTestId('stock-status')).toHaveTextContent('Only 3 left!');
  });

  test('button shows "Out of Stock" and is disabled when stock is 0', () => {
    render(<ProductCard product={outOfStockProduct} />);
    const btn = screen.getByTestId('add-to-cart-btn');
    expect(btn).toHaveTextContent('Out of Stock');
    expect(btn).toBeDisabled();
  });

  test('button is enabled when stock > 0', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByTestId('add-to-cart-btn')).not.toBeDisabled();
  });
});

describe('ProductCard — Click Events', () => {
  test('calls onAddToCart with the product object when button is clicked', () => {
    const mockHandler = jest.fn();
    render(<ProductCard product={baseProduct} onAddToCart={mockHandler} />);

    fireEvent.click(screen.getByTestId('add-to-cart-btn'));

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(baseProduct);
  });

  test('does NOT call onAddToCart when product is out of stock', () => {
    const mockHandler = jest.fn();
    render(<ProductCard product={outOfStockProduct} onAddToCart={mockHandler} />);

    fireEvent.click(screen.getByTestId('add-to-cart-btn'));

    expect(mockHandler).not.toHaveBeenCalled();
  });

  test('calls onAddToCart multiple times on multiple clicks', () => {
    const mockHandler = jest.fn();
    render(<ProductCard product={baseProduct} onAddToCart={mockHandler} />);
    const btn = screen.getByTestId('add-to-cart-btn');

    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);

    expect(mockHandler).toHaveBeenCalledTimes(3);
  });

  test('renders without onAddToCart prop without crashing', () => {
    render(<ProductCard product={baseProduct} />);
    // Should not throw even without callback
    fireEvent.click(screen.getByTestId('add-to-cart-btn'));
  });
});

describe('ProductCard — Accessibility', () => {
  test('has an article element as the root', () => {
    const { container } = render(<ProductCard product={baseProduct} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  test('add to cart button is a proper button element', () => {
    render(<ProductCard product={baseProduct} />);
    const btn = screen.getByTestId('add-to-cart-btn');
    expect(btn.tagName).toBe('BUTTON');
  });
});
