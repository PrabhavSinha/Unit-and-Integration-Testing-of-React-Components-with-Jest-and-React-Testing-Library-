import React, { useState } from 'react';

const SUITES = [
  {
    id: 'pc-render',
    file: 'unit/ProductCard.test.jsx',
    type: 'unit',
    group: 'ProductCard — Rendering Props',
    tests: [
      { name: "renders product title",                       code: `render(<ProductCard product={baseProduct} />);\nexpect(screen.getByTestId('product-title')).toHaveTextContent('Wireless Headphones');` },
      { name: "renders product brand",                       code: `render(<ProductCard product={baseProduct} />);\nexpect(screen.getByTestId('product-brand')).toHaveTextContent('SoundMax');` },
      { name: "renders product price formatted to 2dp",      code: `render(<ProductCard product={baseProduct} />);\nexpect(screen.getByTestId('product-price')).toHaveTextContent('$99.99');` },
      { name: "does NOT render brand when brand is absent",  code: `const noBrand = { ...baseProduct, brand: undefined };\nrender(<ProductCard product={noBrand} />);\nexpect(screen.queryByTestId('product-brand')).not.toBeInTheDocument();` },
    ],
  },
  {
    id: 'pc-events',
    file: 'unit/ProductCard.test.jsx',
    type: 'unit',
    group: 'ProductCard — Click Events',
    tests: [
      { name: "calls onAddToCart with the product object",  code: `const mockHandler = jest.fn();\nrender(<ProductCard product={baseProduct} onAddToCart={mockHandler} />);\nfireEvent.click(screen.getByTestId('add-to-cart-btn'));\nexpect(mockHandler).toHaveBeenCalledTimes(1);\nexpect(mockHandler).toHaveBeenCalledWith(baseProduct);` },
      { name: "does NOT call onAddToCart when out of stock", code: `const mockHandler = jest.fn();\nrender(<ProductCard product={outOfStockProduct} onAddToCart={mockHandler} />);\nfireEvent.click(screen.getByTestId('add-to-cart-btn'));\nexpect(mockHandler).not.toHaveBeenCalled();` },
    ],
  },
  {
    id: 'cf-validation',
    file: 'unit/ContactForm.test.jsx',
    type: 'unit',
    group: 'ContactForm — Validation Errors',
    tests: [
      { name: "shows all required errors on empty submit",  code: `render(<ContactForm />);\nfireEvent.click(screen.getByTestId('submit-btn'));\nexpect(await screen.findByTestId('error-name')).toHaveTextContent('Name is required');\nexpect(screen.getByTestId('error-email')).toHaveTextContent('Email is required');` },
      { name: "shows invalid email error",                  code: `render(<ContactForm />);\nawait userEvent.type(screen.getByTestId('input-email'), 'not-an-email');\nfireEvent.click(screen.getByTestId('submit-btn'));\nexpect(await screen.findByTestId('error-email')).toHaveTextContent('Invalid email');` },
      { name: "clears error when user starts typing",       code: `render(<ContactForm />);\nfireEvent.click(screen.getByTestId('submit-btn'));\nexpect(await screen.findByTestId('error-name')).toBeInTheDocument();\nawait userEvent.type(screen.getByTestId('input-name'), 'Jane');\nexpect(screen.queryByTestId('error-name')).not.toBeInTheDocument();` },
    ],
  },
  {
    id: 'cf-submit',
    file: 'unit/ContactForm.test.jsx',
    type: 'unit',
    group: 'ContactForm — Successful Submission',
    tests: [
      { name: "calls onSubmit with correct values",         code: `const onSubmit = jest.fn();\nrender(<ContactForm onSubmit={onSubmit} />);\nawait fillForm({ name: 'Jane Smith', email: 'jane@example.com', message: 'Test message here.' });\nfireEvent.click(screen.getByTestId('submit-btn'));\nawait waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: 'Jane Smith', email: 'jane@example.com', message: 'Test message here.' }));` },
      { name: "shows success message after valid submit",   code: `render(<ContactForm />);\nawait fillForm({ name: 'Jane', email: 'jane@example.com', message: 'Test message here.' });\nfireEvent.click(screen.getByTestId('submit-btn'));\nexpect(await screen.findByTestId('success-message')).toBeInTheDocument();` },
    ],
  },
  {
    id: 'cart-unit',
    file: 'unit/CartSummary.test.jsx',
    type: 'unit',
    group: 'CartSummary — Quantity Controls',
    tests: [
      { name: "increments quantity when + is clicked",      code: `// setup: add 1 Laptop to cart\nfireEvent.click(screen.getByTestId('increment-1'));\nexpect(screen.getByTestId('qty-1')).toHaveTextContent('2');` },
      { name: "removes item when qty decremented to 0",     code: `// setup: add 1 Laptop to cart (qty=1)\nfireEvent.click(screen.getByTestId('decrement-1'));\nexpect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();\nexpect(screen.getByTestId('cart-empty')).toBeInTheDocument();` },
      { name: "updates total price when quantity changes",  code: `// initial: $999.00\nfireEvent.click(screen.getByTestId('increment-1'));\nexpect(screen.getByTestId('total-price')).toHaveTextContent('$1998.00');` },
    ],
  },
  {
    id: 'pl-search',
    file: 'integration/ProductList.test.jsx',
    type: 'integration',
    group: 'ProductList — Search Filtering',
    tests: [
      { name: "filters cards by product title",             code: `render(<ProductList products={PRODUCTS} />);\nawait userEvent.type(screen.getByTestId('search-input'), 'Laptop');\nexpect(screen.getAllByTestId('product-card')).toHaveLength(1);` },
      { name: "shows no-results message on no match",       code: `render(<ProductList products={PRODUCTS} />);\nawait userEvent.type(screen.getByTestId('search-input'), 'xyznotfound');\nexpect(screen.getByTestId('no-results')).toHaveTextContent('xyznotfound');` },
      { name: "restores all products when cleared",         code: `await userEvent.type(input, 'Laptop');\nexpect(screen.getAllByTestId('product-card')).toHaveLength(1);\nawait userEvent.clear(input);\nexpect(screen.getAllByTestId('product-card')).toHaveLength(4);` },
    ],
  },
  {
    id: 'flow',
    file: 'integration/ShoppingFlow.test.jsx',
    type: 'integration',
    group: 'Full Shopping Flow',
    tests: [
      { name: "adding a product shows it in CartSummary",   code: `renderShopPage();\nconst cards = screen.getAllByTestId('product-card');\nfireEvent.click(within(cards[0]).getByTestId('add-to-cart-btn'));\nexpect(screen.getByTestId('cart-summary')).toBeInTheDocument();\nexpect(screen.getByTestId('item-title-1')).toHaveTextContent('Laptop Pro');` },
      { name: "total price updates correctly",              code: `fireEvent.click(within(cards[0]).getByTestId('add-to-cart-btn')); // $1200\nfireEvent.click(within(cards[1]).getByTestId('add-to-cart-btn')); // $29\nexpect(screen.getByTestId('total-price')).toHaveTextContent('$1229.00');` },
      { name: "cart state persists after search cleared",   code: `await userEvent.type(input, 'Mouse');\nfireEvent.click(screen.getByTestId('add-to-cart-btn'));\nawait userEvent.clear(input);\n// Cart still has the item\nexpect(screen.getByTestId('item-title-2')).toBeInTheDocument();` },
    ],
  },
];

export default function TestsPage() {
  const [active, setActive] = useState('pc-render');
  const [filter, setFilter] = useState('all');

  const filtered = SUITES.filter(s => filter === 'all' || s.type === filter);
  const current  = SUITES.find(s => s.id === active) || SUITES[0];

  return (
    <div className="page page-anim">
      <div className="page-header">
        <div>
          <p className="page-label">Test Explorer</p>
          <h1 className="page-title">Test Suites</h1>
          <p className="page-sub">Browse all test groups with annotated code examples.</p>
        </div>
        <div className="filter-tabs">
          {['all', 'unit', 'integration'].map(f => (
            <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="explorer-layout">
        {/* Sidebar */}
        <aside className="explorer-sidebar">
          {filtered.map(s => (
            <button
              key={s.id}
              className={`suite-btn ${active === s.id ? 'active' : ''} ${s.type}`}
              onClick={() => setActive(s.id)}
            >
              <span className={`type-dot ${s.type}`} />
              <div>
                <p className="suite-group">{s.group}</p>
                <p className="suite-file">{s.file}</p>
              </div>
              <span className="suite-count">{s.tests.length}</span>
            </button>
          ))}
        </aside>

        {/* Main panel */}
        <div className="explorer-main">
          <div className="suite-header">
            <span className={`badge ${current.type}`}>{current.type}</span>
            <h2 className="suite-title">{current.group}</h2>
            <code className="suite-filepath">{current.file}</code>
          </div>

          <div className="test-list">
            {current.tests.map((t, i) => (
              <div key={i} className="test-item">
                <div className="test-name">
                  <span className="pass-dot">✓</span>
                  <span>{t.name}</span>
                </div>
                <pre className="test-code"><code>{t.code}</code></pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
