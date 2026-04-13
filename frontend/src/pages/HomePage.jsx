import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function HomePage() {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <div className="home-wrapper">
      {/* ─── Immersive Hero Section ─── */}
      <motion.section 
        className="home-hero"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className="container">
          <motion.div 
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="hero-badge">
              <span className="pulse">●</span> AI-Powered Market Insights
            </motion.div>
            <motion.h1 variants={itemVariants}>
              The Smarter Way to <br/>
              <span>Rent & List</span> Properties
            </motion.h1>
            <motion.p variants={itemVariants}>
              Experience the future of real estate. Our Gemini-powered AI analyzes 
              thousands of listings to give you the most accurate pricing data 
              in real-time. Transparent, fair, and incredibly fast.
            </motion.p>
            <motion.div variants={itemVariants} className="hero-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg shine-effect">
                  Go to Personal Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg shine-effect">Get Started Free</Link>
                  <Link to="/properties" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                    Explore Listings
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Dynamic Background Elements */}
        <div className="mesh-gradient-container">
          <div className="mesh-blob blob-1"></div>
          <div className="mesh-blob blob-2"></div>
          <div className="mesh-blob blob-3"></div>
        </div>
      </motion.section>

      {/* ─── Stats Overlay ─── */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="stats-container card"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="stat-item">
              <h3>500+</h3>
              <p>Active Listings</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>98%</h3>
              <p>Price Accuracy</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>1.2k</h3>
              <p>Happy Tenants</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Core Features ─── */}
      <section className="features-section">
        <div className="container">
          <motion.div 
            className="section-info text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Built for the Modern Market</h2>
            <p className="section-subtitle">Powerful tools designed to simplify your rental journey.</p>
          </motion.div>

          <div className="home-grid">
            <FeatureCard 
              icon="⚡" 
              title="Instant AI Insights" 
              desc="Get competitive rent suggestions instantly using our proprietary Gemini AI integration."
              delay={0}
            />
            <FeatureCard 
              icon="🔍" 
              title="Smart Search" 
              desc="Filter properties by price status, area, and more to find hidden gems in your favorite locality."
              delay={0.1}
            />
            <FeatureCard 
              icon="📈" 
              title="Market Trends" 
              desc="Real-time real estate news and historical data at your fingertips to make informed decisions."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ─── Modern CTA ─── */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-card"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Ready to Experience the Future?</h2>
            <p>Join our growing community of smart renters and listing owners today.</p>
            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg shine-effect">Create Your Account</Link>
              <Link to="/properties" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>Browse Now</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-icon">🏘️</span>
              <h3>Smart Rental</h3>
            </div>
            <p>&copy; 2026 Smart Rental Assistant. All rights reserved. <br/> Powered by Google Gemini AI & NewsData API.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .home-hero {
          height: 100vh;
          display: flex;
          align-items: center;
          background: #0f172a;
          color: #fff;
          position: relative;
          overflow: hidden;
          margin-top: -80px;
          padding-top: 80px;
        }
        .hero-content { position: relative; z-index: 10; max-width: 800px; }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1.25rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 999px;
          color: #818cf8;
          font-weight: 700;
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }
        .pulse { animation: pulse 2s infinite; color: #6366f1; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        
        .hero-content h1 {
          font-size: clamp(3rem, 10vw, 5.5rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 2rem;
          letter-spacing: -0.04em;
        }
        .hero-content h1 span {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-content p {
          font-size: 1.25rem;
          opacity: 0.7;
          max-width: 600px;
          margin-bottom: 3rem;
          line-height: 1.6;
        }
        .hero-actions { display: flex; gap: 1.5rem; }
        
        /* Mesh Gradient */
        .mesh-gradient-container {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: 1; opacity: 0.6;
          filter: blur(100px);
        }
        .mesh-blob { position: absolute; border-radius: 50%; }
        .blob-1 { width: 600px; height: 600px; background: #4f46e5; top: -100px; right: -100px; animation: move 20s infinite alternate; }
        .blob-2 { width: 500px; height: 500px; background: #7c3aed; bottom: -100px; left: -100px; animation: move 25s infinite alternate-reverse; }
        .blob-3 { width: 400px; height: 400px; background: #2dd4bf; top: 40%; left: 30%; animation: move 15s infinite alternate; }
        @keyframes move { from { transform: translate(0,0); } to { transform: translate(100px, 100px); } }

        /* Stats Section */
        .stats-section { margin-top: -60px; position: relative; z-index: 20; }
        .stats-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 2.5rem;
          text-align: center;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.4);
        }
        .stat-item h3 { font-size: 2.5rem; font-weight: 800; color: var(--primary); margin-bottom: 0.25rem; }
        .stat-item p { color: var(--text-2); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-divider { width: 1px; height: 50px; background: var(--border); }

        .features-section { padding: 120px 0; background: #fcfdfe; }
        .text-center { text-align: center; }
        .section-title { font-size: 3rem; font-weight: 800; letter-spacing: -0.02em; }
        .section-subtitle { font-size: 1.25rem; color: var(--text-2); margin-top: 1rem; margin-bottom: 5rem; }
        
        .home-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
        }

        .cta-section { padding-bottom: 120px; background: #fcfdfe; }
        .cta-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 40px;
          padding: 6rem 2rem;
          text-align: center;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .cta-card h2 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem; }
        .cta-card p { font-size: 1.25rem; opacity: 0.7; margin-bottom: 3rem; }

        .home-footer { padding: 5rem 0; background: #fff; border-top: 1px solid var(--border); }
        .footer-content { text-align: center; }
        .footer-brand { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .footer-brand h3 { font-weight: 800; color: var(--text-1); }
        .footer-content p { color: var(--text-3); font-size: 0.9rem; line-height: 1.8; }

        .shine-effect {
          position: relative;
          overflow: hidden;
        }
        .shine-effect::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: rotate(45deg);
          transition: 0.5s;
        }
        .shine-effect:hover::after { left: 100%; }

        @media (max-width: 768px) {
          .hero-content h1 { font-size: 3.5rem; }
          .hero-actions { flex-direction: column; }
          .stats-container { flex-direction: column; gap: 2rem; }
          .stat-divider { display: none; }
          .cta-card h2 { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      className="feature-card card"
      whileHover={{ y: -12, scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      style={{ padding: '3rem 2.5rem', textAlign: 'left', background: '#fff' }}
    >
      <div className="feature-icon" style={{ 
        width: '60px', height: '60px', 
        background: 'var(--primary-light)', 
        borderRadius: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '2rem',
        marginBottom: '2rem'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-2)', lineHeight: '1.7' }}>{desc}</p>
    </motion.div>
  );
}
