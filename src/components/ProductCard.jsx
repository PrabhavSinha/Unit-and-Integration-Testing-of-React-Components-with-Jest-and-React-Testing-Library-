import React from 'react';

/**
 * ProductCard — presentational component.
 * Receives product data as props and an onAddToCart callback.
 * Fully testable: no side effects, deterministic output from props.
 */
export default function ProductCard({ product, onAddToCart }) {
  const { id, title, brand, price, rating, stock, thumbnail, discountPercentage = 0 } = product;
  const discounted = price - (price * discountPercentage) / 100;
  const isLowStock = stock < 10;

  return (
    <article className="product-card" data-testid="product-card">
      <div className="card-img-wrap">
        <img src={thumbnail} alt={title} data-testid="product-image" />
        {discountPercentage > 0 && (
          <span className="badge-discount" data-testid="discount-badge">
            -{Math.round(discountPercentage)}%
          </span>
        )}
      </div>

      <div className="card-body">
        {brand && (
          <p className="card-brand" data-testid="product-brand">{brand}</p>
        )}
        <h3 className="card-title" data-testid="product-title">{title}</h3>

        <div className="card-rating" data-testid="product-rating">
          <span>★</span> {rating}
        </div>

        <p
          className={`stock-status ${isLowStock ? 'low' : ''}`}
          data-testid="stock-status"
        >
          {isLowStock ? `Only ${stock} left!` : 'In Stock'}
        </p>

        <div className="card-price-row">
          <span className="price-final" data-testid="product-price">
            ${discounted.toFixed(2)}
          </span>
          {discountPercentage > 0 && (
            <span className="price-original" data-testid="original-price">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          className="add-to-cart-btn"
          data-testid="add-to-cart-btn"
          onClick={() => onAddToCart?.(product)}
          disabled={stock === 0}
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}
