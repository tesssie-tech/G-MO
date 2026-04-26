import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CoinPulse heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/coinpulse/i);
  expect(linkElement).toBeInTheDocument();
});
