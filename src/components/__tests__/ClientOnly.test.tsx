// src/components/__tests__/ClientOnly.test.tsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ClientOnly from '../ClientOnly'; // Adjust path as necessary

describe('ClientOnly', () => {
  test('does not render children on initial (server-side) pass', () => {
    // In a Jest environment, the initial render is like a server pass for useEffect behavior.
    // We don't call useEffect cleanup/re-run immediately like in a browser.
    render(
      <ClientOnly>
        <div data-testid="child-content">Hello World</div>
      </ClientOnly>
    );
    
    // Children should not be present initially because hasMounted is false
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
  });

  test('renders children after the component has mounted (client-side)', () => {
    render(
      <ClientOnly>
        <div data-testid="child-content">Hello World</div>
      </ClientOnly>
    );

    // Expect children to not be there initially
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    
    // After useEffect runs (simulated by Jest's environment for effects after initial render),
    // hasMounted becomes true and children should render.
    // To ensure effects have run, we can wait for the state update.
    // In testing-library, re-renders triggered by useEffect are usually handled automatically,
    // but we can be explicit if needed or use findBy for async appearance.
    // For this simple case, the state update should be quick.
    
    // Re-assert after effects have run (Jest automatically runs useEffect after render)
    // Forcing a re-render or using findByTestId might be more robust in complex scenarios
    // but for this simple component, the effect should have run.
    // Let's try findByTestId to be sure it waits for the children.
    return screen.findByTestId('child-content').then(childContent => {
      expect(childContent).toBeInTheDocument();
      expect(childContent).toHaveTextContent('Hello World');
    });
  });

  test('renders children after forced useEffect execution if needed for clarity', () => {
    // This test is more explicit about the timing using act if required,
    // though usually not necessary for simple useEffect like this with testing-library.
    let rerender: (ui: React.ReactElement) => void;

    act(() => {
      const result = render(
        <ClientOnly>
          <div data-testid="child-content-act">Hello Act</div>
        </ClientOnly>
      );
      rerender = result.rerender;
    });

    // Initially not there
    expect(screen.queryByTestId('child-content-act')).not.toBeInTheDocument();
    
    // Simulate the component mounting and useEffect running
    // In testing-library, useEffect runs after the initial render.
    // If we need to explicitly wait or trigger, we can use findBy or act for state updates.
    
    // Forcing a re-render (though not strictly how useEffect mount is triggered,
    // it ensures React processes updates if any were pending)
    act(() => {
      rerender!( // Add non-null assertion operator
        <ClientOnly>
          <div data-testid="child-content-act">Hello Act</div>
        </ClientOnly>
      );
    });
    
    expect(screen.getByTestId('child-content-act')).toBeInTheDocument();
    expect(screen.getByTestId('child-content-act')).toHaveTextContent('Hello Act');
  });
});
