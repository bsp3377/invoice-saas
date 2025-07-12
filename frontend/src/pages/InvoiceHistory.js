import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../services/invoiceService';

export default function InvoiceHistory() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await invoiceService.getInvoices();
      setInvoices(data.invoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceService.deleteInvoice(invoiceId);
        setInvoices(invoices.filter(inv => inv.invoice_id !== invoiceId));
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateInvoiceTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const taxableValue = parseFloat(item.taxableValue) || 0;
      const cgstAmount = (taxableValue * (item.cgstPercent || 0)) / 100;
      const sgstAmount = (taxableValue * (item.sgstPercent || 0)) / 100;
      return total + taxableValue + cgstAmount + sgstAmount;
    }, 0);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading invoices...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1>Invoice History</h1>
        <button onClick={() => navigate('/create-invoice')} style={styles.createButton}>
          Create New Invoice
        </button>
      </header>

      <div style={styles.content}>
        {invoices.length === 0 ? (
          <div style={styles.emptyState}>
            <h2>No invoices found</h2>
            <p>Create your first invoice to get started!</p>
            <button 
              onClick={() => navigate('/create-invoice')} 
              style={styles.createButton}
            >
              Create Invoice
            </button>
          </div>
        ) : (
          <div style={styles.invoiceGrid}>
            {invoices.map((invoice) => (
              <div key={invoice.invoice_id} style={styles.invoiceCard}>
                <div style={styles.cardHeader}>
                  <h3>Invoice #{invoice.invoice_number}</h3>
                  <span style={styles.date}>{formatDate(invoice.date)}</span>
                </div>
                
                <div style={styles.cardBody}>
                  <div style={styles.companyName}>{invoice.companyName}</div>
                  <div style={styles.parties}>
                    <div>
                      <strong>From:</strong> {invoice.sender?.name}
                    </div>
                    <div>
                      <strong>To:</strong> {invoice.receiver?.name}
                    </div>
                  </div>
                  <div style={styles.amount}>
                    Total: ₹{calculateInvoiceTotal(invoice.items).toFixed(2)}
                  </div>
                </div>
                
                <div style={styles.cardActions}>
                  <button 
                    onClick={() => navigate(`/edit-invoice/${invoice.invoice_id}`)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(invoice.invoice_id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  createButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
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
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  invoiceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  invoiceCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-2px)'
    }
  },
  cardHeader: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  date: {
    color: '#6c757d',
    fontSize: '0.9rem'
  },
  cardBody: {
    padding: '1rem'
  },
  companyName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#007bff'
  },
  parties: {
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#6c757d'
  },
  amount: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#28a745'
  },
  cardActions: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    gap: '0.5rem'
  },
  editButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};