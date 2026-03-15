import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App component', () => {
  it('renders the main menu correctly', () => {
    // Render App
    render(<App />);
    const newGameButton = screen.getByText(/new game/i);
    expect(newGameButton).toBeInTheDocument();
  });
});
