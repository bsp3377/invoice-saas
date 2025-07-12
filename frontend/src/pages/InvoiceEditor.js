import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { invoiceService } from '../services/invoiceService';

export default function InvoiceEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [invoice, setInvoice] = useState({
    companyName: '',
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    sender: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    receiver: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    items: [
      { description: '', taxableValue: 0, cgstPercent: 9, sgstPercent: 9 }
    ]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    try {
      const data = await invoiceService.getInvoice(id);
      setInvoice(data.invoice);
    } catch (error) {
      console.error('Error loading invoice:', error);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setInvoice(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setInvoice(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field.includes('Percent') ? parseFloat(value) || 0 : value
    };
    
    if (field === 'taxableValue' || field.includes('Percent')) {
      const item = updatedItems[index];
      item.cgstAmount = (item.taxableValue * item.cgstPercent) / 100;
      item.sgstAmount = (item.taxableValue * item.sgstPercent) / 100;
      item.totalValue = item.taxableValue + item.cgstAmount + item.sgstAmount;
    }
    
    setInvoice(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', taxableValue: 0, cgstPercent: 9, sgstPercent: 9 }]
    }));
  };

  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return invoice.items.reduce((total, item) => {
      const taxableValue = parseFloat(item.taxableValue) || 0;
      const cgstAmount = (taxableValue * (item.cgstPercent || 0)) / 100;
      const sgstAmount = (taxableValue * (item.sgstPercent || 0)) / 100;
      return total + taxableValue + cgstAmount + sgstAmount;
    }, 0);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isEditing) {
        await invoiceService.updateInvoice(id, invoice);
      } else {
        await invoiceService.createInvoice(invoice);
      }
      navigate('/invoice-history');
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
    setLoading(false);
  };

  const handleExport = () => {
    // PDF export functionality will be implemented
    console.log('Export to PDF');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1>{isEditing ? 'Edit Invoice' : 'Create New Invoice'}</h1>
      </header>

      <div style={styles.invoiceContainer}>
        {/* Company Header */}
        <div style={styles.section}>
          <input
            type="text"
            placeholder="Company Name"
            value={invoice.companyName}
            onChange={(e) => handleInputChange(null, 'companyName', e.target.value)}
            style={styles.companyInput}
          />
        </div>

        {/* Invoice Details */}
        <div style={styles.invoiceDetails}>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => handleInputChange(null, 'date', e.target.value)}
              style={styles.input}
            />
          </div>
          <div>
            <label>Invoice Number:</label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => handleInputChange(null, 'invoiceNumber', e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        {/* Sender & Receiver */}
        <div style={styles.partySection}>
          <div style={styles.party}>
            <h3>Sender Information</h3>
            <input
              type="text"
              placeholder="Name"
              value={invoice.sender.name}
              onChange={(e) => handleInputChange('sender', 'name', e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Address"
              value={invoice.sender.address}
              onChange={(e) => handleInputChange('sender', 'address', e.target.value)}
              style={styles.textarea}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={invoice.sender.phone}
              onChange={(e) => handleInputChange('sender', 'phone', e.target.value)}
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              value={invoice.sender.email}
              onChange={(e) => handleInputChange('sender', 'email', e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.party}>
            <h3>Receiver Information</h3>
            <input
              type="text"
              placeholder="Name"
              value={invoice.receiver.name}
              onChange={(e) => handleInputChange('receiver', 'name', e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Address"
              value={invoice.receiver.address}
              onChange={(e) => handleInputChange('receiver', 'address', e.target.value)}
              style={styles.textarea}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={invoice.receiver.phone}
              onChange={(e) => handleInputChange('receiver', 'phone', e.target.value)}
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              value={invoice.receiver.email}
              onChange={(e) => handleInputChange('receiver', 'email', e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        {/* Items Table */}
        <div style={styles.section}>
          <h3>Items</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Taxable Value</th>
                <th>CGST %</th>
                <th>SGST %</th>
                <th>CGST Amount</th>
                <th>SGST Amount</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      style={styles.tableInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.taxableValue}
                      onChange={(e) => handleItemChange(index, 'taxableValue', e.target.value)}
                      style={styles.tableInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.cgstPercent}
                      onChange={(e) => handleItemChange(index, 'cgstPercent', e.target.value)}
                      style={styles.tableInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.sgstPercent}
                      onChange={(e) => handleItemChange(index, 'sgstPercent', e.target.value)}
                      style={styles.tableInput}
                    />
                  </td>
                  <td>₹{((item.taxableValue * item.cgstPercent) / 100).toFixed(2)}</td>
                  <td>₹{((item.taxableValue * item.sgstPercent) / 100).toFixed(2)}</td>
                  <td>₹{(item.taxableValue + (item.taxableValue * item.cgstPercent) / 100 + (item.taxableValue * item.sgstPercent) / 100).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeItem(index)} style={styles.removeButton}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addItem} style={styles.addButton}>
            Add Item
          </button>
        </div>

        {/* Total */}
        <div style={styles.totalSection}>
          <h2>Total Amount: ₹{calculateTotal().toFixed(2)}</h2>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button onClick={handleSave} disabled={loading} style={styles.saveButton}>
            {loading ? 'Saving...' : 'Save Invoice'}
          </button>
          <button onClick={handleExport} style={styles.exportButton}>
            Export PDF
          </button>
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
    alignItems: 'center',
    gap: '1rem'
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  invoiceContainer: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  section: {
    marginBottom: '2rem'
  },
  companyInput: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    border: 'none',
    borderBottom: '2px solid #ddd',
    padding: '0.5rem',
    marginBottom: '1rem'
  },
  invoiceDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '2rem'
  },
  partySection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '2rem'
  },
  party: {
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '0.5rem'
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    minHeight: '80px',
    resize: 'vertical'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1rem'
  },
  tableInput: {
    width: '100%',
    padding: '0.25rem',
    border: '1px solid #ddd',
    borderRadius: '2px'
  },
  addButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  removeButton: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '2px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  totalSection: {
    textAlign: 'right',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  saveButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  exportButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};