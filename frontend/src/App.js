import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InvoiceEditor from './pages/InvoiceEditor';
import InvoiceHistory from './pages/InvoiceHistory';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-invoice" element={<ProtectedRoute><InvoiceEditor /></ProtectedRoute>} />
          <Route path="/edit-invoice/:id" element={<ProtectedRoute><InvoiceEditor /></ProtectedRoute>} />
          <Route path="/invoice-history" element={<ProtectedRoute><InvoiceHistory /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
}

export default App;