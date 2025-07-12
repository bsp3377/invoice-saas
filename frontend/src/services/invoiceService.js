// Mock invoice service for demo purposes
class InvoiceService {
  constructor() {
    this.invoices = JSON.parse(localStorage.getItem('demoInvoices') || '[]');
  }

  saveToStorage() {
    localStorage.setItem('demoInvoices', JSON.stringify(this.invoices));
  }

  async createInvoice(invoiceData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const invoice = {
        ...invoiceData,
        invoice_id: Date.now().toString(),
        invoice_number: this.invoices.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      this.invoices.push(invoice);
      this.saveToStorage();
      
      return { message: 'Invoice created successfully', invoice };
    } catch (error) {
      throw error;
    }
  }

  async getInvoices() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { invoices: this.invoices };
    } catch (error) {
      throw error;
    }
  }

  async getInvoice(invoiceId) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const invoice = this.invoices.find(inv => inv.invoice_id === invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      return { invoice };
    } catch (error) {
      throw error;
    }
  }

  async updateInvoice(invoiceId, invoiceData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = this.invoices.findIndex(inv => inv.invoice_id === invoiceId);
      if (index === -1) {
        throw new Error('Invoice not found');
      }
      
      this.invoices[index] = {
        ...this.invoices[index],
        ...invoiceData,
        updated_at: new Date().toISOString()
      };
      
      this.saveToStorage();
      
      return { message: 'Invoice updated successfully', invoice: this.invoices[index] };
    } catch (error) {
      throw error;
    }
  }

  async deleteInvoice(invoiceId) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.invoices = this.invoices.filter(inv => inv.invoice_id !== invoiceId);
      this.saveToStorage();
      
      return { message: 'Invoice deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async exportToPDF(invoiceId) {
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const invoice = this.invoices.find(inv => inv.invoice_id === invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      // In a real implementation, this would generate and download a PDF
      alert('PDF export feature will be implemented when backend is deployed');
      
      return { message: 'PDF generated successfully' };
    } catch (error) {
      throw error;
    }
  }
}

export const invoiceService = new InvoiceService();