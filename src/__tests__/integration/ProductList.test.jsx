/**
 * INTEGRATION TESTS — ProductList + ProductCard
 *
 * Tests that the ProductList container and ProductCard children
 * work together correctly as a system:
 *
 *  ✔ ProductList renders the correct number of ProductCards
 *  ✔ Search input filters which ProductCards are visible
 *  ✔ Sort select reorders the ProductCards
 *  ✔ onAddToCart flows from ProductCard up through ProductList
 *  ✔ UI updates reflect state changes correctly
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductList from '../../components/ProductList';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1, title: 'Laptop Pro',        brand: 'TechCo',  price: 1200, rating: 4.8, stock: 15, thumbnail: '', discountPercentage: 0 },
  { id: 2, title: 'Wireless Mouse',    brand: 'ClickIt', price: 29,   rating: 4.2, stock: 50, thumbnail: '', discountPercentage: 10 },
  { id: 3, title: 'USB-C Hub',         brand: 'TechCo',  price: 49,   rating: 3.9, stock: 8,  thumbnail: '', discountPercentage: 0 },
  { id: 4, title: 'Mechanical Keyboard', brand: 'TypeMaster', price: 150, rating: 4.6, stock: 20, thumbnail: '', discountPercentage: 5 },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProductList + ProductCard — Rendering', () => {
  test('renders all products as ProductCards', () => {
    render(<ProductList products={PRODUCTS} />);
    const cards = screen.getAllByTestId('product-card');
    expect(cards).toHaveLength(4);
  });

  test('renders empty list with no product cards', () => {
    render(<ProductList products={[]} />);
    expect(screen.queryAllByTestId('product-card')).toHaveLength(0);
  });

  test('shows correct result count', () => {
    render(<ProductList products={PRODUCTS} />);
    expect(screen.getByTestId('result-count')).toHaveTextContent('Showing 4 of 4');
  });

  test('renders each product title in its card', () => {
    render(<ProductList products={PRODUCTS} />);
    expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
    expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
    expect(screen.getByText('USB-C Hub')).toBeInTheDocument();
    expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
  });
});

describe('ProductList — Search Filtering', () => {
  test('filters cards by product title', async () => {
    render(<ProductList products={PRODUCTS} />);
    await userEvent.type(screen.getByTestId('search-input'), 'Laptop');

    expect(screen.getAllByTestId('product-card')).toHaveLength(1);
    expect(screen.getByTestId('product-title')).toHaveTextContent('Laptop Pro');
  });

  test('filters cards by brand name', async () => {
    render(<ProductList products={PRODUCTS} />);
    await userEvent.type(screen.getByTestId('search-input'), 'TechCo');

    const cards = screen.getAllByTestId('product-card');
    expect(cards).toHaveLength(2); // Laptop Pro + USB-C Hub
  });

  test('search is case-insensitive', async () => {
    render(<ProductList products={PRODUCTS} />);
    await userEvent.type(screen.getByTestId('search-input'), 'laptop');
    expect(screen.getAllByTestId('product-card')).toHaveLength(1);
  });

  test('shows no-results message when search has no matches', async () => {
    render(<ProductList products={PRODUCTS} />);
    await userEvent.type(screen.getByTestId('search-input'), 'xyznotfound');

    expect(screen.queryByTestId('product-grid')).not.toBeInTheDocument();
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
    expect(screen.getByTestId('no-results')).toHaveTextContent('xyznotfound');
  });

  test('restores all products when search is cleared', async () => {
    render(<ProductList products={PRODUCTS} />);
    const input = screen.getByTestId('search-input');
    await userEvent.type(input, 'Laptop');
    expect(screen.getAllByTestId('product-card')).toHaveLength(1);

    await userEvent.clear(input);
    expect(screen.getAllByTestId('product-card')).toHaveLength(4);
  });

  test('updates result count after filtering', async () => {
    render(<ProductList products={PRODUCTS} />);
    await userEvent.type(screen.getByTestId('search-input'), 'Mouse');
    expect(screen.getByTestId('result-count')).toHaveTextContent('Showing 1 of 4');
  });
});

describe('ProductList — Sorting', () => {
  test('sorts products by price ascending', () => {
    render(<ProductList products={PRODUCTS} />);
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'price-asc' } });

    const titles = screen.getAllByTestId('product-title').map(el => el.textContent);
    expect(titles[0]).toBe('Wireless Mouse');   // $29
    expect(titles[1]).toBe('USB-C Hub');         // $49
  });

  test('sorts products by price descending', () => {
    render(<ProductList products={PRODUCTS} />);
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'price-desc' } });

    const titles = screen.getAllByTestId('product-title').map(el => el.textContent);
    expect(titles[0]).toBe('Laptop Pro'); // $1200 — highest
  });

  test('sorts products by rating', () => {
    render(<ProductList products={PRODUCTS} />);
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'rating' } });

    const titles = screen.getAllByTestId('product-title').map(el => el.textContent);
    expect(titles[0]).toBe('Laptop Pro'); // rating 4.8 — highest
  });
});

describe('ProductList + ProductCard — onAddToCart Integration', () => {
  test('triggers onAddToCart with correct product when Add button is clicked', () => {
    const mockAddToCart = jest.fn();
    render(<ProductList products={PRODUCTS} onAddToCart={mockAddToCart} />);

    // Click the first product's Add to Cart button
    const cards = screen.getAllByTestId('product-card');
    const firstBtn = within(cards[0]).getByTestId('add-to-cart-btn');
    fireEvent.click(firstBtn);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(PRODUCTS[0]);
  });

  test('can add multiple different products', () => {
    const mockAddToCart = jest.fn();
    render(<ProductList products={PRODUCTS} onAddToCart={mockAddToCart} />);

    const cards = screen.getAllByTestId('product-card');
    fireEvent.click(within(cards[0]).getByTestId('add-to-cart-btn'));
    fireEvent.click(within(cards[1]).getByTestId('add-to-cart-btn'));

    expect(mockAddToCart).toHaveBeenCalledTimes(2);
    expect(mockAddToCart).toHaveBeenNthCalledWith(1, PRODUCTS[0]);
    expect(mockAddToCart).toHaveBeenNthCalledWith(2, PRODUCTS[1]);
  });

  test('filtered-out products cannot be added to cart', async () => {
    const mockAddToCart = jest.fn();
    render(<ProductList products={PRODUCTS} onAddToCart={mockAddToCart} />);

    // Filter to only show Laptop
    await userEvent.type(screen.getByTestId('search-input'), 'Laptop');
    expect(screen.getAllByTestId('product-card')).toHaveLength(1);

    // Only one button visible — not the filtered-out ones
    const buttons = screen.getAllByTestId('add-to-cart-btn');
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]);

    expect(mockAddToCart).toHaveBeenCalledWith(PRODUCTS[0]); // Laptop
  });
});
