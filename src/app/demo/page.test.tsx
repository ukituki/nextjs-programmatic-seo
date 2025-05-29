// src/app/demo/page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import DemoPage from './page'; // Adjust path as necessary

// Mock the components that are children of DemoPage
jest.mock('@/components/LeadGenerationForm', () => () => <div data-testid="lead-form-mock">LeadGenerationForm Mock</div>);
jest.mock('@/components/AiFeaturePlaceholder', () => () => <div data-testid="ai-feature-mock">AiFeaturePlaceholder Mock</div>);

describe('DemoPage', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    jest.resetModules(); // Important to reset module cache for process.env changes
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original process.env after all tests
    process.env = originalEnv;
  });

  test('renders Demo Page heading and child components when NEXT_PUBLIC_ENABLE_DEMO_PAGE is true', () => {
    process.env.NEXT_PUBLIC_ENABLE_DEMO_PAGE = 'true';
    render(<DemoPage />);
    
    expect(screen.getByRole('heading', { name: /Demo Page/i })).toBeInTheDocument();
    expect(screen.getByText(/This is a placeholder for demo content./i)).toBeInTheDocument();
    expect(screen.getByTestId('lead-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('ai-feature-mock')).toBeInTheDocument();
  });

  test('renders Demo Not Available message when NEXT_PUBLIC_ENABLE_DEMO_PAGE is false', () => {
    process.env.NEXT_PUBLIC_ENABLE_DEMO_PAGE = 'false';
    render(<DemoPage />);
    
    expect(screen.getByRole('heading', { name: /Demo Not Available/i })).toBeInTheDocument();
    expect(screen.getByText(/This feature is currently switched off./i)).toBeInTheDocument();
    expect(screen.queryByTestId('lead-form-mock')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ai-feature-mock')).not.toBeInTheDocument();
  });

  test('renders Demo Not Available message when NEXT_PUBLIC_ENABLE_DEMO_PAGE is not set', () => {
    delete process.env.NEXT_PUBLIC_ENABLE_DEMO_PAGE; // Ensure it's undefined
    render(<DemoPage />);
    
    expect(screen.getByRole('heading', { name: /Demo Not Available/i })).toBeInTheDocument();
    expect(screen.getByText(/This feature is currently switched off./i)).toBeInTheDocument();
    expect(screen.queryByTestId('lead-form-mock')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ai-feature-mock')).not.toBeInTheDocument();
  });

  test('LeadGenerationForm component is rendered when NEXT_PUBLIC_ENABLE_DEMO_PAGE is true', () => {
    process.env.NEXT_PUBLIC_ENABLE_DEMO_PAGE = 'true';
    render(<DemoPage />);
    expect(screen.getByTestId('lead-form-mock')).toBeInTheDocument();
  });

  test('AiFeaturePlaceholder component is rendered when NEXT_PUBLIC_ENABLE_DEMO_PAGE is true', () => {
    process.env.NEXT_PUBLIC_ENABLE_DEMO_PAGE = 'true';
    render(<DemoPage />);
    expect(screen.getByTestId('ai-feature-mock')).toBeInTheDocument();
  });
});
