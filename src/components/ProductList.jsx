import React, { useState } from 'react';
import ProductCard from './ProductCard';

/**
 * ProductList — renders a list of ProductCards.
 * Owns search/filter state. Calls onAddToCart passed from parent.
 */
export default function ProductList({ products = [], onAddToCart }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filtered = products
    .filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating')     return b.rating - a.rating;
      return 0;
    });

  return (
    <section data-testid="product-list">
      <div className="list-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          data-testid="search-input"
          aria-label="Search products"
          className="search-input"
        />

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          data-testid="sort-select"
          aria-label="Sort products"
          className="sort-select"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p data-testid="no-results" className="no-results">
          No products found for "{search}"
        </p>
      ) : (
        <div className="product-grid" data-testid="product-grid">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

      <p className="result-count" data-testid="result-count">
        Showing {filtered.length} of {products.length} products
      </p>
    </section>
  );
}
