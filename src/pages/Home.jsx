import React from 'react';
import { Link } from 'react-router-dom';

const SKILLS = [
  { icon: '🧪', title: 'Unit Tests',          desc: 'Test individual components in isolation with mocked props and callbacks.' },
  { icon: '🔗', title: 'Integration Tests',   desc: 'Test multiple components working together through shared context.' },
  { icon: '🎭', title: 'User Interactions',   desc: 'Simulate typing, clicking, and form submission with userEvent.' },
  { icon: '⚡', title: 'State Assertions',    desc: 'Assert DOM changes after state updates using getBy* queries.' },
  { icon: '🛡️', title: 'Controlled Forms',   desc: 'Test validation pipelines, error display, and success flows.' },
  { icon: '📊', title: 'Coverage Reports',    desc: 'Run jest --coverage to generate HTML + lcov coverage reports.' },
];

const TEST_FILES = [
  { file: 'unit/ProductCard.test.jsx',     count: 16, groups: ['Rendering Props', 'Discount Display', 'Stock Status', 'Click Events', 'Accessibility'] },
  { file: 'unit/ContactForm.test.jsx',     count: 14, groups: ['Initial Render', 'Controlled Inputs', 'Validation Errors', 'Successful Submission'] },
  { file: 'unit/CartSummary.test.jsx',     count: 13, groups: ['Empty State', 'With Items', 'Quantity Controls', 'Remove and Clear'] },
  { file: 'integration/ProductList.test.jsx',   count: 13, groups: ['Rendering', 'Search Filtering', 'Sorting', 'onAddToCart Integration'] },
  { file: 'integration/ShoppingFlow.test.jsx',  count: 8,  groups: ['Product → Cart Flow', 'Search + Add to Cart'] },
];

export default function Home() {
  return (
    <div className="page page-anim">
      <section className="hero">
        <p className="hero-label">Experiment 9 · Week 9</p>
        <h1 className="hero-title">Unit & Integration<br />Testing</h1>
        <p className="hero-sub">
          Jest · React Testing Library · userEvent ·
          Component Isolation · Context Testing · Coverage Reports
        </p>
        <div className="hero-actions">
          <Link to="/tests"  className="btn-accent">Test Explorer →</Link>
          <Link to="/demo"   className="btn-ghost">Live Demo</Link>
        </div>
      </section>

      <section>
        <h2 className="section-title">Skills Covered</h2>
        <div className="skills-grid">
          {SKILLS.map(s => (
            <div key={s.title} className="skill-card">
              <span className="skill-icon">{s.icon}</span>
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '48px' }}>
        <h2 className="section-title">Test Files Overview</h2>
        <p className="section-sub">Total: <strong>{TEST_FILES.reduce((s, t) => s + t.count, 0)} tests</strong> across {TEST_FILES.length} files</p>
        <div className="test-files">
          {TEST_FILES.map(tf => (
            <div key={tf.file} className="test-file-card">
              <div className="tf-header">
                <span className="tf-file">{tf.file}</span>
                <span className="tf-count">{tf.count} tests</span>
              </div>
              <div className="tf-groups">
                {tf.groups.map(g => <span key={g} className="tf-group">{g}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="run-box">
        <h3>▶ Run the Tests</h3>
        <div className="cmd-block">
          <code>npm install</code>
          <code>npm test                    <span># all tests + coverage</span></code>
          <code>npm run test:unit           <span># unit tests only</span></code>
          <code>npm run test:integration    <span># integration tests only</span></code>
          <code>npm run test:watch          <span># watch mode</span></code>
        </div>
      </section>
    </div>
  );
}
