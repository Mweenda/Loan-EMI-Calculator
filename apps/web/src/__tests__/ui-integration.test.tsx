import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

/**
 * Phase 2: UI Integration tests (Red -> Green)
 * - Component renders labels and inputs
 * - Real-time validation shows errors when typing invalid values
 * - On valid submit, results show formatted ZMW currency
 */

describe('UI Integration: App component', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders form labels and inputs', () => {
    expect(screen.getByLabelText(/Principal Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Interest Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Loan Tenure/i)).toBeInTheDocument();
  });

  it('shows validation error for negative principal while typing', async () => {
    const principal = screen.getByLabelText(/Principal Amount/i);
    await userEvent.clear(principal);
    await userEvent.type(principal, '-100');

    // blur to trigger validation
    principal.blur();

    expect(await screen.findByText(/must be greater than or equal to/i)).toBeTruthy();
  });

  it('submits valid data and shows formatted ZMW results', async () => {
    const principal = screen.getByLabelText(/Principal Amount/i);
    const rate = screen.getByLabelText(/Monthly Interest Rate/i);
    const months = screen.getByLabelText(/Loan Tenure/i);
    const button = screen.getByRole('button', { name: /calculate emi/i });

    await userEvent.clear(principal);
    await userEvent.type(principal, '10000');
    await userEvent.clear(rate);
    await userEvent.type(rate, '20');
    await userEvent.clear(months);
    await userEvent.type(months, '12');

    await userEvent.click(button);

    // Expect formatted EMI in ZMW (K 2,252.65)
    expect(await screen.findByText(/K\s?2,252\.65/)).toBeTruthy();
  });
});
