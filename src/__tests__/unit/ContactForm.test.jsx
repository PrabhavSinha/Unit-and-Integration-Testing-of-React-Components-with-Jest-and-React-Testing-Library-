/**
 * UNIT TESTS — ContactForm
 *
 * Tests a controlled form component:
 *  ✔ Initial render state
 *  ✔ User typing (controlled inputs)
 *  ✔ Validation error display
 *  ✔ Successful form submission
 *  ✔ Success message + reset flow
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ContactForm from '../../components/ContactForm';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fillForm({ name = '', email = '', message = '' }) {
  if (name)    await userEvent.type(screen.getByTestId('input-name'),    name);
  if (email)   await userEvent.type(screen.getByTestId('input-email'),   email);
  if (message) await userEvent.type(screen.getByTestId('input-message'), message);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ContactForm — Initial Render', () => {
  test('renders all form fields', () => {
    render(<ContactForm />);
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-message')).toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
  });

  test('all fields start empty', () => {
    render(<ContactForm />);
    expect(screen.getByTestId('input-name')).toHaveValue('');
    expect(screen.getByTestId('input-email')).toHaveValue('');
    expect(screen.getByTestId('input-message')).toHaveValue('');
  });

  test('no error messages shown initially', () => {
    render(<ContactForm />);
    expect(screen.queryByTestId('error-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });
});

describe('ContactForm — Controlled Inputs (State Updates)', () => {
  test('name input updates when user types', async () => {
    render(<ContactForm />);
    const input = screen.getByTestId('input-name');
    await userEvent.type(input, 'Jane Smith');
    expect(input).toHaveValue('Jane Smith');
  });

  test('email input updates when user types', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByTestId('input-email'), 'jane@example.com');
    expect(screen.getByTestId('input-email')).toHaveValue('jane@example.com');
  });

  test('message textarea updates when user types', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByTestId('input-message'), 'Hello world message here');
    expect(screen.getByTestId('input-message')).toHaveValue('Hello world message here');
  });
});

describe('ContactForm — Validation Errors', () => {
  test('shows all required field errors on empty submit', async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('error-name')).toHaveTextContent('Name is required');
    expect(screen.getByTestId('error-email')).toHaveTextContent('Email is required');
    expect(screen.getByTestId('error-message')).toHaveTextContent('Message is required');
  });

  test('shows name too short error', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByTestId('input-name'), 'A');
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('error-name')).toHaveTextContent('at least 2 characters');
  });

  test('shows invalid email error', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByTestId('input-email'), 'not-an-email');
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('error-email')).toHaveTextContent('Invalid email');
  });

  test('shows message too short error', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByTestId('input-message'), 'short');
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('error-message')).toHaveTextContent('at least 10 characters');
  });

  test('clears name error when user starts typing after failed submit', async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(await screen.findByTestId('error-name')).toBeInTheDocument();

    await userEvent.type(screen.getByTestId('input-name'), 'Jane');
    expect(screen.queryByTestId('error-name')).not.toBeInTheDocument();
  });
});

describe('ContactForm — Successful Submission', () => {
  test('calls onSubmit with correct values on valid submit', async () => {
    const onSubmit = jest.fn();
    render(<ContactForm onSubmit={onSubmit} />);

    await fillForm({
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'This is a valid test message.',
    });

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'This is a valid test message.',
      });
    });
  });

  test('shows success message after valid submission', async () => {
    render(<ContactForm />);
    await fillForm({ name: 'Jane', email: 'jane@example.com', message: 'Test message here.' });
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(await screen.findByTestId('success-message')).toBeInTheDocument();
    expect(screen.getByTestId('success-message')).toHaveTextContent('Message sent successfully');
  });

  test('does NOT call onSubmit when form is invalid', async () => {
    const onSubmit = jest.fn();
    render(<ContactForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('"Send Another" resets form and hides success message', async () => {
    render(<ContactForm />);
    await fillForm({ name: 'Jane', email: 'jane@example.com', message: 'Test message here.' });
    fireEvent.click(screen.getByTestId('submit-btn'));

    await screen.findByTestId('success-message');
    fireEvent.click(screen.getByTestId('send-another-btn'));

    expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('input-name')).toHaveValue('');
  });
});
