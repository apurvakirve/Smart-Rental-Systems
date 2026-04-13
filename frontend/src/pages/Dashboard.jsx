import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import PropertyCard from '../components/PropertyCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function Dashboard() {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  const [properties, setProperties]   = useState([]);
  const [news, setNews]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await api.get('/get_properties.php');
        setProperties(res.data.properties || []);
      } catch {
        setError('Could not load properties. Is XAMPP running?');
      } finally { setLoading(false); }
    };

    const fetchNews = async () => {
      try {
        const res = await api.get('/get_news.php');
        if (res.data.success) setNews(res.data.articles || []);
      } catch {
        console.error('Failed to fetch news');
      } finally { setNewsLoading(false); }
    };

    fetchProps();
    fetchNews();
  }, []);

  const stats = {
    total: properties.length,
    fair:        properties.filter(p => p.price_status === 'Fair').length,
    overpriced:  properties.filter(p => p.price_status === 'Overpriced').length,
    underpriced: properties.filter(p => p.price_status === 'Underpriced').length,
  };

  const recentProps = isOwner
    ? properties.filter(p => String(p.owner_id) === String(user.id)).slice(0, 6)
    : properties.slice(0, 6);

  return (
    <motion.div 
      className="page-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container">
        {/* Hero */}
        <motion.div className="hero-banner" variants={itemVariants}>
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome back, {user?.name}! 👋
          </motion.h2>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isOwner
              ? 'Manage your property listings and get smart pricing insights.'
              : 'Discover your perfect rental home with AI-powered pricing analysis.'}
          </motion.p>
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isOwner
              ? <Link to="/add-property" className="btn btn-primary">➕ Add New Property</Link>
              : <Link to="/properties" className="btn btn-primary">🔍 Browse Properties</Link>}
            <Link to="/loan-calculator" className="btn btn-outline" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', border: 'none' }}>
              💰 EMI Calculator
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className="stat-grid" variants={containerVariants}>
          <motion.div className="stat-card" variants={itemVariants}>
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Listings</span>
          </motion.div>
          <motion.div className="stat-card" variants={itemVariants}>
            <span className="stat-value" style={{ color: '#10b981' }}>{stats.fair}</span>
            <span className="stat-label">✅ Fair Priced</span>
          </motion.div>
          <motion.div className="stat-card" variants={itemVariants}>
            <span className="stat-value" style={{ color: '#ef4444' }}>{stats.overpriced}</span>
            <span className="stat-label">🔴 Overpriced</span>
          </motion.div>
          <motion.div className="stat-card" variants={itemVariants}>
            <span className="stat-value" style={{ color: '#3b82f6' }}>{stats.underpriced}</span>
            <span className="stat-label">🔵 Underpriced</span>
          </motion.div>
        </motion.div>

        {/* Recent properties */}
        <motion.div className="section-header" variants={itemVariants}>
          <h2 className="section-title">
            {isOwner ? 'Your Listings' : 'Latest Properties'}
          </h2>
          <Link to={isOwner ? '/add-property' : '/properties'} className="btn btn-outline">
            {isOwner ? '➕ Add Property' : '🔍 View All →'}
          </Link>
        </motion.div>

        {error && <motion.div className="alert alert-error" variants={itemVariants}>{error}</motion.div>}

        {loading ? (
          <div className="empty-state">
            <div className="emoji">⏳</div>
            <h3>Loading properties…</h3>
          </div>
        ) : recentProps.length === 0 ? (
          <motion.div className="empty-state" variants={itemVariants}>
            <div className="emoji">🏡</div>
            <h3>{isOwner ? 'No listings yet' : 'No properties found'}</h3>
            <p>{isOwner ? 'Add your first property!' : 'Check back soon.'}</p>
            {isOwner && <Link to="/add-property" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Property</Link>}
          </motion.div>
        ) : (
          <motion.div className="property-grid" variants={containerVariants}>
            {recentProps.map(p => (
              <motion.div key={p.id} variants={itemVariants}>
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Real Estate News Section */}
        <motion.div style={{ marginTop: '4rem' }} variants={containerVariants}>
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">📰 Real Estate Updates</h2>
            <div className="badge badge-info" style={{ textTransform: 'none' }}>Live Market News</div>
          </motion.div>

          {newsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <span className="spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--primary-light)' }} />
              <p style={{ marginTop: '0.5rem', color: 'var(--text-3)' }}>Fetching latest news…</p>
            </div>
          ) : news.length === 0 ? (
            <motion.div className="card" variants={itemVariants} style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--text-2)' }}>No news available at the moment. Check back later!</p>
            </motion.div>
          ) : (
            <motion.div className="property-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }} variants={containerVariants}>
              {news.map((item, idx) => (
                <motion.a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="card" 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}
                >
                  {item.urlToImage && (
                    <img src={item.urlToImage} alt="news" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  )}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {item.sourceName} • {new Date(item.publishedAt).toLocaleDateString()}
                    </div>
                    <h4 style={{ color: 'var(--text-1)', fontSize: '1rem', lineHeight: '1.4', marginBottom: '0.5rem' }}>{item.title}</h4>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
