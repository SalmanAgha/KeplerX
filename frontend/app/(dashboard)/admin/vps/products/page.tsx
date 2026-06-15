'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Plus, Edit2, Trash2, ChevronUp, ChevronDown, X, Loader2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { vpsProductService } from '@/services/api';
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

interface VpsProduct {
  id: string;
  name: string;
  details?: string;
  price: number;
  country?: string;
  status: string;
  createdAt: string;
}

export default function VpsProductsPage() {
  const [products, setProducts] = useState<VpsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof VpsProduct; direction: 'asc' | 'desc' } | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VpsProduct | null>(null);
  const [formData, setFormData] = useState({
    name: '', details: '', price: 0, country: '', status: 'active'
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await vpsProductService.getProducts();
      if (res && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch VPS products:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        (p.details && p.details.toLowerCase().includes(lowerQuery)) ||
        (p.country && p.country.toLowerCase().includes(lowerQuery))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
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
  }, [products, searchQuery, statusFilter, sortConfig]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredAndSortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key: keyof VpsProduct) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof VpsProduct) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const exportToCSV = () => {
    if (filteredAndSortedProducts.length === 0) return;
    
    const headers = ['Product Name', 'Details', 'Price', 'Country', 'Status', 'Created At'];
    const csvRows = [headers.join(',')];

    filteredAndSortedProducts.forEach(p => {
      const row = [
        `"${p.name}"`, 
        `"${p.details || ''}"`, 
        `"${p.price}"`, 
        `"${p.country || ''}"`, 
        `"${p.status}"`, 
        `"${new Date(p.createdAt).toLocaleDateString()}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vps_products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openModal = (product?: VpsProduct) => {
    setFormError('');
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        details: product.details || '',
        price: product.price,
        country: product.country || '',
        status: product.status
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', details: '', price: 0, country: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        await vpsProductService.updateProduct(editingProduct.id, formData);
        toast.success('Product updated successfully!');
      } else {
        await vpsProductService.createProduct(formData);
        toast.success('Product created successfully!');
      }
      closeModal();
      fetchProducts();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product');
      toast.error(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this VPS product?')) return;
    
    try {
      setDeletingId(id);
      await vpsProductService.deleteProduct(id);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (err: any) {
      toast.error('Failed to delete product: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <header>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', background: 'none', WebkitTextFillColor: 'initial', marginBottom: '4px' }}>VPS Products</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your server offerings and plans.</p>
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
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input 
                type="text" 
                placeholder="Search products..." 
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
              <th onClick={() => requestSort('name')} style={{ cursor: 'pointer', userSelect: 'none', width: '25%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Product Name {getSortIcon('name')}</div>
              </th>
              <th style={{ width: '30%' }}>Details</th>
              <th onClick={() => requestSort('price')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Price {getSortIcon('price')}</div>
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
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>Loading products...</td></tr>
            ) : filteredAndSortedProducts.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>No products found.</td></tr>
            ) : (
              paginatedProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{p.name}</div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px', whiteSpace: 'pre-wrap' }}>{p.details || '-'}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--brand-primary)' }}>${p.price.toFixed(2)}/mo</div>
                  </td>
                  <td>{p.country || '-'}</td>
                  <td>
                    <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => openModal(p)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Edit" disabled={deletingId === p.id}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: deletingId === p.id ? 'not-allowed' : 'pointer' }} title="Delete" disabled={deletingId === p.id}>
                        {deletingId === p.id ? <Loader2 size={16} className="lucide-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredAndSortedProducts.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', fontSize: '13px' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} entries
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-card modal-enter" style={{ width: '500px', borderRadius: '0', padding: '24px', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }} disabled={isSubmitting}>
              <X size={20} />
            </button>
            
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            
            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', fontSize: '13px', marginBottom: '16px' }}>{formError}</div>}
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Product Name *</label>
                  <input required className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. 16GB NVMe Node" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Price ($) *</label>
                  <input required type="number" step="0.01" min="0" className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Details & Specifications</label>
                <textarea 
                  className="input-field" 
                  style={{ padding: '8px 12px', fontSize: '13px', minHeight: '100px', resize: 'vertical' }} 
                  value={formData.details} 
                  onChange={e => setFormData({...formData, details: e.target.value})}
                  placeholder="e.g. 4 vCores, 16GB RAM, 200GB NVMe Storage..."
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Country / Region</label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(c => c.value === formData.country) || null}
                  onChange={(option: any) => setFormData({...formData, country: option ? option.value : ''})}
                  placeholder="Search & Select a country..."
                  isClearable
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '36px',
                      fontSize: '13px',
                      borderRadius: '8px',
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
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
