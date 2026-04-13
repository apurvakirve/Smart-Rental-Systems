import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const PROPERTY_TYPES = ['1BHK', '2BHK', 'PG'];

export default function AddPropertyPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '', location: '', type: '1BHK', rent: '', description: ''
  });
  const [avgData, setAvgData]   = useState(null);
  const [geminiData, setGeminiData] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [avgLoading, setAvgLoading] = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');

  // Compute price status from avg (Internal vs AI)
  const getPriceStatus = (rent, internalAvg, aiAvg) => {
    if (!rent) return null;
    const r = parseFloat(rent);
    const avg = aiAvg || internalAvg;
    if (!avg) return null;

    if (r > avg * 1.20) return { label: '🔴 Overpriced',  cls: 'badge-overpriced' };
    if (r < avg * 0.80) return { label: '🔵 Underpriced', cls: 'badge-underpriced' };
    return { label: '✅ Fair Price', cls: 'badge-fair' };
  };

  // Fetch average rent and Gemini insights whenever location or type changes (debounced)
  const fetchAvg = useCallback(async () => {
    const loc = form.location.trim();
    if (!loc || !form.type) { setAvgData(null); setGeminiData(null); return; }
    
    setAvgLoading(true);
    try {
      // 1. Get internal market average
      const res = await api.get('/get_average_rent.php', {
        params: { location: loc, type: form.type }
      });
      setAvgData(res.data);

      // 2. Get AI (Gemini) market insight
      const gRes = await api.get('/get_gemini_insight.php', {
        params: { location: loc, type: form.type }
      });
      if (gRes.data.success) {
        setGeminiData(gRes.data);
      }
    } catch { 
      setAvgData(null); 
    } finally { 
      setAvgLoading(false); 
    }
  }, [form.location, form.type]);

  useEffect(() => {
    const t = setTimeout(fetchAvg, 500);
    return () => clearTimeout(t);
  }, [fetchAvg]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(''); setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const payload = { ...form, owner_id: user.id, rent: parseFloat(form.rent) };
      const res = await api.post('/add_property.php', payload);
      if (res.data.success) {
        setSuccess(res.data.message);
        setForm({ title: '', location: '', type: '1BHK', rent: '', description: '' });
        setAvgData(null);
      } else {
        setError(res.data.message || 'Failed to add property.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Is XAMPP running?');
    } finally { setLoading(false); }
  };

  const status = getPriceStatus(form.rent, avgData?.avg_rent);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '680px' }}>
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">➕ Add New Property</h2>
        </div>

        <div className="card">
          {success && <div className="alert alert-success">{success}</div>}
          {error   && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Property Title</label>
              <input id="title" name="title" type="text" className="form-control"
                placeholder="e.g. Cozy 2BHK near Metro" value={form.title} onChange={handleChange} required />
            </div>

            {/* Location + Type in a row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="location">Location / Area</label>
                <input id="location" name="location" type="text" className="form-control"
                  placeholder="e.g. Andheri" value={form.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="type">Property Type</label>
                <select id="type" name="type" className="form-control" value={form.type} onChange={handleChange}>
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Rent */}
            <div className="form-group">
              <label htmlFor="rent">Monthly Rent (₹)</label>
              <input id="rent" name="rent" type="number" className="form-control"
                placeholder="e.g. 18000" min="1" value={form.rent} onChange={handleChange} required />
            </div>

            {/* AI + Avg rent insight */}
            {avgLoading && (
              <div className="alert alert-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="spinner" style={{ borderTopColor: '#3b82f6', borderColor: '#93c5fd' }} /> Analyzing market trends…
              </div>
            )}
            {!avgLoading && (avgData || geminiData) && (
              <div style={{ display: 'grid', gridTemplateColumns: geminiData ? '1fr 1fr' : '1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                {/* Internal Data */}
                {avgData && (
                  <div className="avg-info-box" style={{ marginBottom: 0 }}>
                    <div className="avg-title">📊 Platform Average</div>
                    {avgData.avg_rent ? (
                      <>
                        <div className="avg-price">₹{Number(avgData.avg_rent).toLocaleString('en-IN')}</div>
                        <div className="avg-note">{avgData.message}</div>
                      </>
                    ) : (
                      <div className="avg-note">No internal data yet.</div>
                    )}
                  </div>
                )}

                {/* Gemini Data */}
                {geminiData && (
                  <div className="avg-info-box" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderColor: '#3b82f6', marginBottom: 0 }}>
                    <div className="avg-title" style={{ color: '#1e40af' }}>✨ AI Market Insight</div>
                    <div className="avg-price" style={{ color: '#1e40af' }}>₹{Number(geminiData.market_avg).toLocaleString('en-IN')}</div>
                    <div className="avg-note" style={{ color: '#1e40af' }}>
                      Best Cost: <strong>₹{Number(geminiData.best_cost).toLocaleString('en-IN')}</strong><br/>
                      {geminiData.reasoning}
                    </div>
                  </div>
                )}
              </div>
            )}

            {status && (
              <div style={{ marginBottom: '1.25rem' }}>
                <span className={`badge ${status.cls}`}>
                  {status.label}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginLeft: '0.5rem' }}>
                  (Compared to {geminiData ? 'AI Market Average' : 'Platform Average'})
                </span>
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description (optional)</label>
              <textarea id="description" name="description" className="form-control" rows={3}
                placeholder="Describe amenities, nearby locations, etc."
                value={form.description} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><span className="spinner" /> Adding Property…</> : '🏠 List Property'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
