import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await signUp(formData.email, formData.password, formData.companyName);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.demoNotice}>
          🚀 <strong>Demo Mode</strong> - No backend required!<br/>
          Use any email/password to test the app.
        </div>
        
        <h2 style={styles.title}>
          {isLogin ? 'Login to Invoice SaaS' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email (demo@example.com)"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password (any password)"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          
          {!isLogin && (
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        
        {error && <p style={styles.error}>{error}</p>}
        
        <p style={styles.toggle}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={styles.toggleButton}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  demoNotice: {
    backgroundColor: '#e3f2fd',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#1976d2'
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    marginTop: '1rem'
  },
  toggle: {
    textAlign: 'center',
    marginTop: '1rem'
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};