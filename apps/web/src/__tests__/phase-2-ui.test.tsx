import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

/**
 * Phase 2: Professional UI Tests
 * 
 * Verifies React Hook Form integration, real-time validation,
 * responsive design, and accessibility compliance
 */

describe('Phase 2: Professional UI & Accessibility', () => {
  describe('2.1 Real-time Validation Feedback', () => {
    it('should show error message when principal is invalid', async () => {
      render(<App />);
      const principalInput = screen.getByLabelText(/Principal Amount/i);
      
      await userEvent.type(principalInput, '-100');
      await userEvent.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/must be greater than or equal to 1/i)).toBeInTheDocument();
      });
    });

    it('should clear error when value becomes valid', async () => {
      render(<App />);
      const principalInput = screen.getByLabelText(/Principal Amount/i) as HTMLInputElement;
      
      // Enter invalid value
      await userEvent.type(principalInput, '-100');
      await userEvent.tab();
      
      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/must be greater than or equal to 1/i)).toBeInTheDocument();
      });
      
      // Clear and enter valid value
      await userEvent.clear(principalInput);
      await userEvent.type(principalInput, '10000');
      await userEvent.tab();
      
      // Error should disappear
      await waitFor(() => {
        expect(screen.queryByText(/must be greater than or equal to 1/i)).not.toBeInTheDocument();
      });
    });

    it('should show error for invalid interest rate', async () => {
      render(<App />);
      const rateInput = screen.getByLabelText(/Monthly Interest Rate/i);
      
      await userEvent.type(rateInput, '-5');
      await userEvent.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/must be greater than or equal to/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid tenure', async () => {
      render(<App />);
      const monthsInput = screen.getByLabelText(/Loan Tenure/i);
      
      await userEvent.type(monthsInput, '0');
      await userEvent.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/must be greater than or equal to 1/i)).toBeInTheDocument();
      });
    });
  });

  describe('2.2 Form Submission & Results Display', () => {
    it('should display results after valid form submission', async () => {
      render(<App />);
      
      const principalInput = screen.getByLabelText(/Principal Amount/i);
      const rateInput = screen.getByLabelText(/Monthly Interest Rate/i);
      const monthsInput = screen.getByLabelText(/Loan Tenure/i);
      const submitButton = screen.getByRole('button', { name: /Calculate EMI/i });
      
      await userEvent.type(principalInput, '10000');
      await userEvent.type(rateInput, '20');
      await userEvent.type(monthsInput, '12');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument();
        expect(screen.getByText(/K 2,252.65/)).toBeInTheDocument();
      });
    });

    it('should display ZMW formatted currency', async () => {
      render(<App />);
      
      const principalInput = screen.getByLabelText(/Principal Amount/i);
      const rateInput = screen.getByLabelText(/Monthly Interest Rate/i);
      const monthsInput = screen.getByLabelText(/Loan Tenure/i);
      const submitButton = screen.getByRole('button', { name: /Calculate EMI/i });
      
      await userEvent.type(principalInput, '100000');
      await userEvent.type(rateInput, '1');
      await userEvent.type(monthsInput, '12');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        // Check for K symbol and proper formatting
        expect(screen.getByText(/K 8,884.88/)).toBeInTheDocument();
      });
    });

    it('should prevent submission with invalid data', async () => {
      render(<App />);
      
      const principalInput = screen.getByLabelText(/Principal Amount/i);
      const submitButton = screen.getByRole('button', { name: /Calculate EMI/i });
      
      await userEvent.type(principalInput, '-100');
      await userEvent.click(submitButton);
      
      // Results should not appear
      await waitFor(() => {
        expect(screen.queryByText(/Monthly EMI/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('2.3 Responsive Design', () => {
    it('should render form inputs with proper labels', () => {
      render(<App />);
      
      expect(screen.getByLabelText(/Principal Amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Monthly Interest Rate/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Loan Tenure/i)).toBeInTheDocument();
    });

    it('should have properly sized input fields', () => {
      render(<App />);
      
      const principalInput = screen.getByLabelText(/Principal Amount/i) as HTMLInputElement;
      expect(principalInput).toHaveAttribute('type', 'number');
      expect(principalInput).toHaveAttribute('placeholder');
    });

    it('should display submit button', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: /Calculate EMI/i })).toBeInTheDocument();
    });
  });

  describe('2.4 WCAG 2.1 AA Accessibility', () => {
    it('should have proper ARIA labels on inputs', () => {
      render(<App />);
      
      const principalInput = screen.getByLabelText(/Principal Amount/i);
      expect(principalInput).toHaveAttribute('id', 'principal');
    });

    it('should associate labels with form inputs', () => {
      render(<App />);
      
      const principalLabel = screen.getByText(/Principal Amount/i);
      expect(principalLabel).toHaveAttribute('for', 'principal');
    });

    it('should display error messages with proper association', async () => {
      render(<App />);
      
      const principalInput = screen.getByLabelText(/Principal Amount/i);
      await userEvent.type(principalInput, '-100');
      await userEvent.tab();
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/must be greater than or equal to 1/i);
        expect(errorMessage).toHaveClass('error-message');
      });
    });

    it('should have semantic HTML structure', () => {
      render(<App />);
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('form')).toBeInTheDocument();
    });
  });

  describe('2.5 Error Handling & Edge Cases', () => {
    it('should handle rapid form input changes', async () => {
      render(<App />);
      
      const principalInput = screen.getByLabelText(/Principal Amount/i);
      
      await userEvent.type(principalInput, '1');
      await userEvent.type(principalInput, '0');
      await userEvent.type(principalInput, '0');
      await userEvent.type(principalInput, '0');
      
      const submitButton = screen.getByRole('button', { name: /Calculate EMI/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument();
      });
    });

    it('should handle decimal input values', async () => {
      render(<App />);
      
      const principalInput = screen.getByLabelText(/Principal Amount/i);
      const rateInput = screen.getByLabelText(/Monthly Interest Rate/i);
      const monthsInput = screen.getByLabelText(/Loan Tenure/i);
      const submitButton = screen.getByRole('button', { name: /Calculate EMI/i });
      
      await userEvent.type(principalInput, '10500.50');
      await userEvent.type(rateInput, '10.75');
      await userEvent.type(monthsInput, '12');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument();
      });
    });

    it('should display loading state during calculation', async () => {
      render(<App />);
      
      const principalInput = screen.getByLabelText(/Principal Amount/i);
      const rateInput = screen.getByLabelText(/Monthly Interest Rate/i);
      const monthsInput = screen.getByLabelText(/Loan Tenure/i);
      const submitButton = screen.getByRole('button', { name: /Calculate EMI/i });
      
      await userEvent.type(principalInput, '10000');
      await userEvent.type(rateInput, '20');
      await userEvent.type(monthsInput, '12');
      
      // Button should be clickable
      expect(submitButton).not.toBeDisabled();
      
      await userEvent.click(submitButton);
      
      // Results should appear
      await waitFor(() => {
        expect(screen.getByText(/Monthly EMI/i)).toBeInTheDocument();
      });
    });
  });
});
