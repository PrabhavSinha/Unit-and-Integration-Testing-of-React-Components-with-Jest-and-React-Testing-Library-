import React, { useState } from 'react';

function validate(values) {
  const errors = {};
  if (!values.name.trim())        errors.name    = 'Name is required';
  else if (values.name.length < 2) errors.name   = 'Name must be at least 2 characters';
  if (!values.email.trim())        errors.email   = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
                                   errors.email   = 'Invalid email address';
  if (!values.message.trim())      errors.message = 'Message is required';
  else if (values.message.length < 10)
                                   errors.message = 'Message must be at least 10 characters';
  return errors;
}

/**
 * ContactForm — fully controlled form.
 * Calls onSubmit(values) when valid.
 * All fields and error messages carry data-testid for easy querying.
 */
export default function ContactForm({ onSubmit }) {
  const [values,  setValues]  = useState({ name: '', email: '', message: '' });
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSuccess(true);
    onSubmit?.(values);
  };

  if (success) {
    return (
      <div data-testid="success-message" className="success-msg">
        <p>Message sent successfully!</p>
        <button
          onClick={() => { setValues({ name: '', email: '', message: '' }); setSuccess(false); }}
          data-testid="send-another-btn"
        >Send Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} data-testid="contact-form" noValidate>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          id="name" name="name" type="text"
          value={values.name}
          onChange={handleChange}
          data-testid="input-name"
          aria-describedby="name-error"
        />
        {errors.name && (
          <span id="name-error" className="error" data-testid="error-name" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email" name="email" type="email"
          value={values.email}
          onChange={handleChange}
          data-testid="input-email"
          aria-describedby="email-error"
        />
        {errors.email && (
          <span id="email-error" className="error" data-testid="error-email" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message" name="message"
          value={values.message}
          onChange={handleChange}
          data-testid="input-message"
          aria-describedby="message-error"
        />
        {errors.message && (
          <span id="message-error" className="error" data-testid="error-message" role="alert">
            {errors.message}
          </span>
        )}
      </div>

      <button type="submit" data-testid="submit-btn">Send Message</button>
    </form>
  );
}
