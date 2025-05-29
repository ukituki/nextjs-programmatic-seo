// src/components/__tests__/LeadGenerationForm.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LeadGenerationForm from '../LeadGenerationForm'; // Adjust path as necessary

describe('LeadGenerationForm', () => {
  test('renders all form fields and the submit button', () => {
    render(<LeadGenerationForm />);
    
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('allows typing into form fields', () => {
    render(<LeadGenerationForm />);
    
    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');

    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    expect(emailInput.value).toBe('john.doe@example.com');

    const phoneInput = screen.getByLabelText(/Phone/i) as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
    expect(phoneInput.value).toBe('123-456-7890');

    const messageTextarea = screen.getByLabelText(/Message/i) as HTMLTextAreaElement;
    fireEvent.change(messageTextarea, { target: { value: 'Hello World' } });
    expect(messageTextarea.value).toBe('Hello World');
  });

  test('logs form data to console and resets form on submission', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock window.alert

    render(<LeadGenerationForm />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '098-765-4321' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Test message' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    
    expect(consoleSpy).toHaveBeenCalledWith('Lead Form Data:', {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '098-765-4321',
      message: 'Test message',
    });
    expect(alertSpy).toHaveBeenCalledWith('Form submitted! Check the console for data.');

    // Check if form fields are reset
    expect((screen.getByLabelText(/Name/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/Phone/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/Message/i) as HTMLTextAreaElement).value).toBe('');

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
