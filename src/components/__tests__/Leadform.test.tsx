import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Leadform from '../Leadform'; // Adjust path if component is in a different directory relative to __tests__

// Mock Next.js specific features or global context if necessary
// For example, if nicheConfig is accessed globally via context and not props:
// jest.mock('@/config', () => ({
//   nicheConfig: {
//     // Provide minimal mock config needed for rendering
//     theme: {},
//     // ... any other properties Leadform might indirectly access via UI components
//   },
// }));

describe('Leadform Component', () => {
  test('renders all required input fields and submit button', () => {
    render(<Leadform />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument(); // Phone is optional but label should be there
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /submit inquiry/i })).toBeInTheDocument();
  });

  test('allows input into text fields', () => {
    render(<Leadform />);

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    expect(nameInput).toHaveValue('Test User');

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');

    const phoneInput = screen.getByLabelText(/phone/i);
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    expect(phoneInput).toHaveValue('1234567890');

    const messageTextarea = screen.getByLabelText(/message/i);
    fireEvent.change(messageTextarea, { target: { value: 'Hello, this is a test message.' } });
    expect(messageTextarea).toHaveValue('Hello, this is a test message.');
  });

  test('form submission logs data and resets fields', () => {
    render(<Leadform />);
    const consoleSpy = jest.spyOn(console, 'log');

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const messageTextarea = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /submit inquiry/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '0987654321' } });
    fireEvent.change(messageTextarea, { target: { value: 'Another test message.' } });

    fireEvent.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith("Lead Form Submitted:", {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '0987654321',
      message: 'Another test message.'
    });

    // Check if fields are reset
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(phoneInput).toHaveValue('');
    expect(messageTextarea).toHaveValue('');

    consoleSpy.mockRestore();
  });
});
