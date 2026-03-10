import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductList from '../components/ProductList';
import CartSummary from '../components/CartSummary';
import ContactForm from '../components/ContactForm';

const DEMO_PRODUCTS = [
  { id: 1, title: 'Wireless Headphones', brand: 'SoundMax',   price: 99.99,  rating: 4.5, stock: 25,  thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.webp', discountPercentage: 0  },
  { id: 2, title: 'Laptop Pro X',        brand: 'TechCo',    price: 1299,   rating: 4.8, stock: 8,   thumbnail: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.webp', discountPercentage: 10 },
  { id: 3, title: 'USB-C Hub',           brand: 'PortMaster', price: 49.99,  rating: 3.9, stock: 0,   thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.webp', discountPercentage: 0  },
  { id: 4, title: 'Wireless Mouse',      brand: 'ClickIt',   price: 29.99,  rating: 4.2, stock: 50,  thumbnail: 'https://cdn.dummyjson.com/products/images/groceries/Chicken%20Meat/thumbnail.webp', discountPercentage: 15 },
  { id: 5, title: 'Mechanical Keyboard', brand: 'TypeMaster', price: 149.99, rating: 4.7, stock: 3,   thumbnail: 'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.webp', discountPercentage: 5  },
  { id: 6, title: 'Monitor 4K',          brand: 'VisualPro',  price: 599.99, rating: 4.6, stock: 12,  thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.webp', discountPercentage: 0  },
];

function DemoSection({ title, badge, children }) {
  return (
    <section className="demo-section">
      <div className="demo-section-header">
        <span className={`badge ${badge}`}>{badge}</span>
        <h2 className="demo-section-title">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function DemoPage() {
  const { addItem } = useCart();
  const [tab, setTab] = useState('products');

  return (
    <div className="page page-anim">
      <div className="page-header">
        <div>
          <p className="page-label">Live Component Demo</p>
          <h1 className="page-title">Components Under Test</h1>
          <p className="page-sub">These are the actual components being tested. Interact with them to understand what each test verifies.</p>
        </div>
      </div>

      <div className="demo-tabs">
        {['products', 'cart', 'form'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ products: '🛒 ProductList', cart: '📦 CartSummary', form: '📝 ContactForm' }[t]}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <DemoSection title="ProductList + ProductCard" badge="integration">
          <p className="demo-note">Try: searching, sorting, adding items to cart. The integration tests verify all these interactions.</p>
          <ProductList products={DEMO_PRODUCTS} onAddToCart={addItem} />
        </DemoSection>
      )}

      {tab === 'cart' && (
        <DemoSection title="CartSummary" badge="unit">
          <p className="demo-note">Add products from the Products tab first, then come here. The unit tests verify qty controls, remove, clear, and total calculations.</p>
          <div style={{ maxWidth: '600px' }}>
            <CartSummary />
          </div>
        </DemoSection>
      )}

      {tab === 'form' && (
        <DemoSection title="ContactForm" badge="unit">
          <p className="demo-note">Try submitting empty, with bad email, with short message. The unit tests verify each validation rule and the success flow.</p>
          <div style={{ maxWidth: '520px' }}>
            <ContactForm onSubmit={(v) => console.log('Submitted:', v)} />
          </div>
        </DemoSection>
      )}
    </div>
  );
}
