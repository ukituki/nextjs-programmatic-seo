import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AiFeatureMockup from '../AiFeatureMockup'; // Adjust path if component is in a different directory

// If the component relies on nicheConfig passed via context or global import for placeholders,
// you might need to mock it here. However, the current AiFeatureMockup.tsx
// has a self-contained minimal nicheConfig for its placeholders.
// If it were imported like: import { nicheConfig } from '@/config';
// Then a mock would be:
// jest.mock('@/config', () => ({
//   nicheConfig: {
//     itemDefinition: {
//       fields: [
//         { key: "style", examples: ["Mocked Style 1", "Mocked Style 2"] },
//         { key: "material", examples: ["Mocked Material A", "Mocked Material B"] },
//       ]
//     }
//   },
// }));

describe('AiFeatureMockup Component', () => {
  test('renders the button initially with correct text', () => {
    render(<AiFeatureMockup />);
    expect(screen.getByRole('button', { name: /ask ai assistant/i })).toBeInTheDocument();
  });

  test('toggles AI content visibility and button text on click', () => {
    render(<AiFeatureMockup />);

    const toggleButton = screen.getByRole('button', { name: /ask ai assistant/i });
    expect(screen.queryByText(/ai assistant insights/i, { selector: 'h2, div, p, span' })).not.toBeInTheDocument(); // CardTitle or content text

    // First click: show content
    fireEvent.click(toggleButton);
    expect(screen.getByRole('heading', { name: /ai assistant insights/i, level: 2 })).toBeInTheDocument(); // CardTitle is h2
    expect(screen.getByText(/powered by advanced nicheai™ \(mockup\)/i)).toBeInTheDocument(); // CardDescription
    expect(screen.getByText(/disclaimer: ai insights are for demonstration purposes only/i)).toBeInTheDocument();
    expect(toggleButton).toHaveTextContent(/hide ai assistant insights/i);

    // Second click: hide content
    fireEvent.click(toggleButton);
    expect(screen.queryByRole('heading', { name: /ai assistant insights/i, level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByText(/powered by advanced nicheai™ \(mockup\)/i)).not.toBeInTheDocument();
    expect(toggleButton).toHaveTextContent(/ask ai assistant/i);
  });

  test('displays placeholder AI content when visible', () => {
    render(<AiFeatureMockup />);
    const toggleButton = screen.getByRole('button', { name: /ask ai assistant/i });

    // Click to show content
    fireEvent.click(toggleButton);

    // Check for some specific placeholder texts. These depend on the self-contained nicheConfig in AiFeatureMockup.tsx
    // For example, using the default values from the component's own nicheConfig:
    // "Sliding Door" is examples[0] for style
    // "Vinyl" is examples[1] for material
    expect(screen.getByText(/gaining popularity in similar properties/i)).toBeInTheDocument();
    expect(screen.getByText(/cohesive and modern aesthetic/i)).toBeInTheDocument();
    expect(screen.getByText(/installation complexity for this item is typically/i)).toBeInTheDocument();
    expect(screen.getByText(/maximize efficiency/i)).toBeInTheDocument();
  });
});
