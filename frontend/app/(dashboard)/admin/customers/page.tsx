'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Plus, Edit2, Trash2, ChevronUp, ChevronDown, X, Loader2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { apiCall } from '@/services/api';
import toast from 'react-hot-toast';
import Select from 'react-select';

const countryOptions = [
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates (UAE)' },
  { value: 'India', label: 'India' },
  { value: 'United States', label: 'United States (USA)' },
  { value: 'United Kingdom', label: 'United Kingdom (UK)' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Portugal', label: 'Portugal' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'France', label: 'France' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Norway', label: 'Norway' },
  { value: 'Denmark', label: 'Denmark' },
  { value: 'Finland', label: 'Finland' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Japan', label: 'Japan' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'China', label: 'China' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'New Zealand', label: 'New Zealand' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'Russia', label: 'Russia' },
  { value: 'Ukraine', label: 'Ukraine' },
  { value: 'Poland', label: 'Poland' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Belgium', label: 'Belgium' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Greece', label: 'Greece' },
  { value: 'Israel', label: 'Israel' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Peru', label: 'Peru' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Sri Lanka', label: 'Sri Lanka' }
];

interface Customer {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  status: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer; direction: 'asc' | 'desc' } | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', country: '', status: 'active', password: '', confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/customers');
      if (data && data.data) {
        setCustomers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('add') === 'true') {
        openModal();
      }
    }
  }, []);

  // --- Filtering & Sorting Logic ---
  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.firstName.toLowerCase().includes(lowerQuery) ||
        c.lastName.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        (c.country && c.country.toLowerCase().includes(lowerQuery)) ||
        (c.customerId && c.customerId.toLowerCase().includes(lowerQuery))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }

    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [customers, searchQuery, statusFilter, sortConfig]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredAndSortedCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key: keyof Customer) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Customer) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // --- Export CSV ---
  const exportToCSV = () => {
    if (filteredAndSortedCustomers.length === 0) return;
    
    const headers = ['Customer ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Country', 'Status', 'Joined Date'];
    const csvRows = [headers.join(',')];

    filteredAndSortedCustomers.forEach(c => {
      const row = [
        `"${c.customerId}"`,
        `"${c.firstName}"`, 
        `"${c.lastName}"`, 
        `"${c.email}"`, 
        `"${c.phone || ''}"`, 
        `"${c.country || ''}"`, 
        `"${c.status}"`, 
        `"${new Date(c.createdAt).toLocaleDateString()}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // --- CRUD Operations ---
  const openModal = (customer?: Customer) => {
    setFormError('');
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone || '',
        country: customer.country || '',
        status: customer.status,
        password: '',
        confirmPassword: ''
      });
    } else {
      setEditingCustomer(null);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', country: '', status: 'active', password: '', confirmPassword: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (!editingCustomer && !formData.password) {
      setFormError('Password is required for new customers');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCustomer) {
        await apiCall(`/customers/${editingCustomer.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        toast.success('Customer updated successfully!');
      } else {
        await apiCall('/customers', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        toast.success('Customer created successfully!');
      }
      closeModal();
      fetchCustomers();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save customer');
      toast.error(err.message || 'Failed to save customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer? This cannot be undone.')) return;
    
    try {
      setDeletingId(id);
      await apiCall(`/customers/${id}`, { method: 'DELETE' });
      toast.success('Customer deleted successfully!');
      fetchCustomers();
    } catch (err: any) {
      toast.error('Failed to delete customer: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header and Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <header>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', background: 'none', WebkitTextFillColor: 'initial', marginBottom: '4px' }}>Global Customers</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your clients across all VPS and Ecommerce services.</p>
        </header>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={exportToCSV}
            className="glass" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '36px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '1px solid var(--border-subtle)', borderRadius: '0', background: 'var(--surface-hover)' }}
          >
            <Download size={16} /> Export
          </button>

          <button 
            onClick={() => openModal()}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '36px', fontSize: '13px', borderRadius: '0' }}
          >
            <Plus size={16} /> New Customer
          </button>
        </div>
      </div>

      {/* Datatable */}
      <div className="glass-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input 
                type="text" 
                placeholder="Search customers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', height: '36px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ position: 'relative', width: '140px' }}>
            <Filter size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '34px', height: '36px', fontSize: '13px', appearance: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <table className="data-table" style={{ width: '100%', minWidth: '800px', fontSize: '13px' }}>
          <thead>
            <tr>
              <th onClick={() => requestSort('customerId')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>ID {getSortIcon('customerId')}</div>
              </th>
              <th onClick={() => requestSort('firstName')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Name {getSortIcon('firstName')}</div>
              </th>
              <th onClick={() => requestSort('email')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Email {getSortIcon('email')}</div>
              </th>
              <th onClick={() => requestSort('country')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Country {getSortIcon('country')}</div>
              </th>
              <th onClick={() => requestSort('status')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Status {getSortIcon('status')}</div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>Loading customers...</td></tr>
            ) : filteredAndSortedCustomers.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>No customers found.</td></tr>
            ) : (
              paginatedCustomers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '12px' }}>{c.customerId}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{c.firstName} {c.lastName}</div>
                    {c.phone && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{c.phone}</div>}
                  </td>
                  <td>{c.email}</td>
                  <td>{c.country || '-'}</td>
                  <td>
                    <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => openModal(c)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Edit" disabled={deletingId === c.id}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: deletingId === c.id ? 'not-allowed' : 'pointer' }} title="Delete" disabled={deletingId === c.id}>
                        {deletingId === c.id ? <Loader2 size={16} className="lucide-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && filteredAndSortedCustomers.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', fontSize: '13px' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedCustomers.length)} of {filteredAndSortedCustomers.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? 'var(--text-tertiary)' : 'var(--text-primary)' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ margin: '0 8px', fontWeight: '500' }}>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? 'var(--text-tertiary)' : 'var(--text-primary)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-card modal-enter" style={{ width: '400px', borderRadius: '0', padding: '24px', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }} disabled={isSubmitting}>
              <X size={20} />
            </button>
            
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
            
            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', fontSize: '13px', marginBottom: '16px' }}>{formError}</div>}
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>First Name *</label>
                  <input required className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Last Name *</label>
                  <input required className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email *</label>
                <input required type="email" className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phone</label>
                  <input className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Country</label>
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(c => c.value === formData.country) || null}
                    onChange={(option: any) => setFormData({...formData, country: option ? option.value : ''})}
                    placeholder="Search country..."
                    isClearable
                    isSearchable
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '36px',
                        fontSize: '13px',
                        borderRadius: '0',
                        border: '1px solid var(--border)',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: 'var(--primary)'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        fontSize: '13px',
                        zIndex: 9999
                      })
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{editingCustomer ? 'New Password (Optional)' : 'Password *'}</label>
                  <input type="password" required={!editingCustomer} className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Confirm Password</label>
                  <input type="password" required={!editingCustomer || formData.password.length > 0} className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Status</label>
                <select className="input-field" style={{ padding: '8px 12px', fontSize: '13px', appearance: 'none' }} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={closeModal} style={{ background: 'none', border: '1px solid var(--border)', padding: '8px 16px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '13px' }} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 size={14} className="lucide-spin" />}
                  {editingCustomer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
