// src/components/__tests__/AiFeaturePlaceholder.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import AiFeaturePlaceholder from '../AiFeaturePlaceholder'; // Adjust path as necessary

describe('AiFeaturePlaceholder', () => {
  test('renders the placeholder heading and paragraph', () => {
    render(<AiFeaturePlaceholder />);
    
    expect(screen.getByRole('heading', { name: /AI Feature Showcase/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /This section will demonstrate AI-powered product recommendations and insights once data extraction capabilities are restored. Currently, this is a placeholder./i
      )
    ).toBeInTheDocument();
  });
});
