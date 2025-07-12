import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Invoice SaaS Dashboard</h1>
        <button onClick={handleSignOut} style={styles.signOutButton}>
          Sign Out
        </button>
      </header>
      
      <div style={styles.content}>
        <div style={styles.welcomeSection}>
          <h2>Welcome back!</h2>
          <p>Manage your invoices efficiently with our cloud-based solution.</p>
        </div>
        
        <div style={styles.actionCards}>
          <div 
            style={styles.card}
            onClick={() => navigate('/create-invoice')}
          >
            <div style={styles.cardIcon}>📝</div>
            <h3>Create Invoice</h3>
            <p>Create a new professional invoice with automatic calculations</p>
          </div>
          
          <div 
            style={styles.card}
            onClick={() => navigate('/invoice-history')}
          >
            <div style={styles.cardIcon}>📋</div>
            <h3>Saved Invoices</h3>
            <p>View, edit, and manage your saved invoices</p>
          </div>
        </div>
        
        <div style={styles.statsSection}>
          <div style={styles.statCard}>
            <h4>Total Invoices</h4>
            <p style={styles.statNumber}>0</p>
          </div>
          <div style={styles.statCard}>
            <h4>This Month</h4>
            <p style={styles.statNumber}>0</p>
          </div>
          <div style={styles.statCard}>
            <h4>Total Amount</h4>
            <p style={styles.statNumber}>₹0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  header: {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: '#333',
    margin: 0
  },
  signOutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  content: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  welcomeSection: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  actionCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-2px)'
    }
  },
  cardIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '0.5rem 0 0 0'
  }
};