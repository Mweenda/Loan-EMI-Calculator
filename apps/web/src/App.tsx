import { useState } from 'react';
import { calculateEMI, loanInputSchema } from '@lemic/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoanInput } from '@lemic/shared';
import { DEFAULT_LOAN_VALUES, CURRENCY_SYMBOL, DECIMAL_PLACES, formatCurrency } from './config';
import './App.css';

function App() {
  const [emiResult, setEmiResult] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoanInput>({
    resolver: zodResolver(loanInputSchema),
    defaultValues: DEFAULT_LOAN_VALUES,
  });

  const formValues = watch();

  const onSubmit = (data: LoanInput) => {
    try {
      const emi = calculateEMI(data);
      const total = emi * data.months;
      const interest = total - data.principal;

      setEmiResult(emi);
      setTotalAmount(total);
      setTotalInterest(interest);
    } catch (error) {
      console.error('Error calculating EMI:', error);
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator-card">
        <h1>💰 Loan EMI Calculator</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label htmlFor="principal">Principal Amount ({CURRENCY_SYMBOL})</label>
            <input
              id="principal"
              type="number"
              placeholder="Enter loan amount"
              {...register('principal', {
                valueAsNumber: true,
              })}
              className={errors.principal ? 'input-error' : ''}
            />
            {errors.principal && (
              <span className="error-message">{errors.principal.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="annualRate">Annual Interest Rate (%)</label>
            <input
              id="annualRate"
              type="number"
              placeholder="Enter interest rate"
              step="0.01"
              {...register('annualRate', {
                valueAsNumber: true,
              })}
              className={errors.annualRate ? 'input-error' : ''}
            />
            {errors.annualRate && (
              <span className="error-message">{errors.annualRate.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="months">Loan Tenure (Months)</label>
            <input
              id="months"
              type="number"
              placeholder="Enter tenure in months"
              {...register('months', {
                valueAsNumber: true,
              })}
              className={errors.months ? 'input-error' : ''}
            />
            {errors.months && (
              <span className="error-message">{errors.months.message}</span>
            )}
          </div>

          <button type="submit" className="submit-button">
            Calculate EMI
          </button>
        </form>

        {emiResult !== null && (
          <div className="results">
            <h2>Calculation Results (ZMW)</h2>
            <div className="result-item">
              <span>Monthly EMI:</span>
              <span className="result-value">{formatCurrency(emiResult)}</span>
            </div>
            <div className="result-item">
              <span>Total Amount to Pay:</span>
              <span className="result-value">
                {formatCurrency(totalAmount || 0)}
              </span>
            </div>
            <div className="result-item">
              <span>Total Interest:</span>
              <span className="result-value">
                {formatCurrency(totalInterest || 0)}
              </span>
            </div>
          </div>
        )}

        <div className="debug-info">
          <p>Current Values: P={formValues.principal}, R={formValues.annualRate}%, M={formValues.months}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
