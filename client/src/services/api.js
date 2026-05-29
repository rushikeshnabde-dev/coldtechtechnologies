import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://coldtechtechnologies.onrender.com/api';

export const api = axios.create({
  baseURL: API,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// Auto-clear stale session when server returns 401 (e.g. after in-memory DB restart)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const msg = err.response?.data?.message || '';
      if (msg === 'User not found' || msg === 'Invalid or expired token') {
        // Clear stored auth so user gets redirected to login
        localStorage.removeItem('coldtech_auth');
        delete api.defaults.headers.common.Authorization;
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

// ── Accounting API helpers ──
export const accountingApi = {
  // Ledgers
  getLedgers:       (params) => api.get('/accounting/ledgers', { params }),
  createLedger:     (data)   => api.post('/accounting/ledgers', data),
  updateLedger:     (id, d)  => api.put(`/accounting/ledgers/${id}`, d),
  deleteLedger:     (id)     => api.delete(`/accounting/ledgers/${id}`),
  seedLedgers:      ()       => api.get('/accounting/ledgers/seed'),
  getLedgerStatement:(id, p) => api.get(`/accounting/ledgers/${id}/statement`, { params: p }),

  // Parties
  getParties:       (params) => api.get('/accounting/parties', { params }),
  createParty:      (data)   => api.post('/accounting/parties', data),
  updateParty:      (id, d)  => api.put(`/accounting/parties/${id}`, d),
  deleteParty:      (id)     => api.delete(`/accounting/parties/${id}`),

  // Products
  getProducts:      (params) => api.get('/accounting/products', { params }),
  createProduct:    (data)   => api.post('/accounting/products', data),
  updateProduct:    (id, d)  => api.put(`/accounting/products/${id}`, d),
  deleteProduct:    (id)     => api.delete(`/accounting/products/${id}`),

  // Accounting Invoices
  getInvoices:      (params) => api.get('/accounting/invoices', { params }),
  getInvoice:       (id)     => api.get(`/accounting/invoices/${id}`),
  createInvoice:    (data)   => api.post('/accounting/invoices', data),
  updateInvoice:    (id, d)  => api.put(`/accounting/invoices/${id}`, d),
  cancelInvoice:    (id)     => api.post(`/accounting/invoices/${id}/cancel`),
  deleteInvoice:    (id)     => api.delete(`/accounting/invoices/${id}`),

  // Payments
  getPayments:      (params) => api.get('/accounting/payments', { params }),
  createPayment:    (data)   => api.post('/accounting/payments', data),
  deletePayment:    (id)     => api.delete(`/accounting/payments/${id}`),

  // Reports
  getDashboard:     ()       => api.get('/accounting/reports/dashboard'),
  getLedgerReport:  (params) => api.get('/accounting/reports/ledger', { params }),
  getProfitLoss:    (params) => api.get('/accounting/reports/pl', { params }),
  getGstSummary:    (params) => api.get('/accounting/reports/gst', { params }),
};
