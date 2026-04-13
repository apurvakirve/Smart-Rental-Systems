import React, { useState } from 'react';

export default function LoanCalculatorPage() {
  const [form, setForm] = useState({ price: '', rate: '', duration: '' });
  const [result, setResult] = useState(null);
  const [error, setError]   = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setResult(null); setError('');
  };

  const calculate = (e) => {
    e.preventDefault();
    const principal = parseFloat(form.price);
    const annualRate = parseFloat(form.rate);
    const months = parseInt(form.duration) * 12;

    if (!principal || !annualRate || !months || principal <= 0 || annualRate <= 0 || months <= 0) {
      setError('Please enter valid positive values for all fields.');
      return;
    }

    const r = annualRate / 100 / 12; // monthly interest rate
    const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const totalPayable = emi * months;
    const totalInterest = totalPayable - principal;

    setResult({
      emi:          emi.toFixed(2),
      totalPayable: totalPayable.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principal,
      months,
    });
  };

  const fmt = (n) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">💰 Loan / EMI Calculator</h2>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={calculate}>
            <div className="form-group">
              <label htmlFor="price">Property Price / Loan Amount (₹)</label>
              <input id="price" name="price" type="number" className="form-control"
                placeholder="e.g. 5000000" min="1" value={form.price} onChange={handleChange} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="rate">Annual Interest Rate (%)</label>
                <input id="rate" name="rate" type="number" className="form-control"
                  placeholder="e.g. 8.5" step="0.01" min="0.01" value={form.rate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Loan Duration (Years)</label>
                <input id="duration" name="duration" type="number" className="form-control"
                  placeholder="e.g. 20" min="1" max="30" value={form.duration} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg">
              📊 Calculate EMI
            </button>
          </form>

          {/* Results */}
          {result && (
            <div className="loan-result">
              <div className="result-row">
                <span className="result-label">📅 Monthly EMI</span>
                <span className="result-value highlight">₹{fmt(result.emi)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">💰 Total Amount Payable</span>
                <span className="result-value">₹{fmt(result.totalPayable)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">📈 Total Interest Payable</span>
                <span className="result-value" style={{ color: '#f87171' }}>₹{fmt(result.totalInterest)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">🏠 Principal Amount</span>
                <span className="result-value">₹{fmt(result.principal)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">⏳ Loan Tenure</span>
                <span className="result-value">{result.months} months ({form.duration} years)</span>
              </div>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="card" style={{ marginTop: '1.5rem', background: 'var(--surface-2)' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-2)' }}>
            📌 EMI Formula
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
            <strong>EMI = P × r × (1+r)^n / ((1+r)^n − 1)</strong><br />
            where <em>P</em> = Principal, <em>r</em> = monthly interest rate, <em>n</em> = total months
          </p>
        </div>
      </div>
    </div>
  );
}
