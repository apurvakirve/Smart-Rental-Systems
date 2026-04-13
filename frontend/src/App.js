import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AddPropertyPage from './pages/AddPropertyPage';
import PropertyListingPage from './pages/PropertyListingPage';
import LoanCalculatorPage from './pages/LoanCalculatorPage';
import './index.css';

import HomePage from './pages/HomePage';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-property" element={<ProtectedRoute allowedRole="owner"><AddPropertyPage /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><PropertyListingPage /></ProtectedRoute>} />
        <Route path="/loan-calculator" element={<ProtectedRoute><LoanCalculatorPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
