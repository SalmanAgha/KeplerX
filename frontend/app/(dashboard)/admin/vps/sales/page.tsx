'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Download, Plus, Edit2, Trash2, ChevronUp, ChevronDown, X, Loader2, ChevronLeft, ChevronRight, Filter, FileText, Printer, Paperclip, Eye, XCircle } from 'lucide-react';
import { vpsSaleService, vpsPurchaseService, vpsProductService, apiCall, userService } from '@/services/api';
import toast from 'react-hot-toast';
import Select from 'react-select';

interface VpsSale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  vpsProductId: string;
  vpsPurchaseId?: string;
  price: number;
  status: string;
  startDate: string;
  endDate?: string;
  invoicePath?: string;
  invoiceName?: string;
  referredById?: string;
  referredBy?: { id: string; name?: string; email: string };
  createdAt: string;
  customer?: { id: string; firstName: string; lastName: string; email: string; phone?: string };
  vpsProduct?: { id: string; name: string; details?: string; price: number };
  vpsPurchase?: { id: string; vendorName: string; nodeName: string; ipAddress?: string };
}

export default function VpsSalesPage() {
  const [sales, setSales] = useState<VpsSale[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activePurchases, setActivePurchases] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<VpsSale | null>(null);
  const [formData, setFormData] = useState({
    customerId: '', vpsProductId: '', vpsPurchaseId: '', price: 0, status: 'active', endDate: '', referredById: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [invoiceSale, setInvoiceSale] = useState<VpsSale | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesRes, customersRes, productsRes, purchasesRes, usersRes] = await Promise.all([
        vpsSaleService.getSales(),
        apiCall('/customers'),
        vpsProductService.getProducts(),
        vpsPurchaseService.getPurchases(),
        userService.getAllUsers().catch(() => ({ data: [] }))
      ]);
      if (salesRes?.data) setSales(salesRes.data);
      if (customersRes?.data) setCustomers(customersRes.data);
      if (productsRes?.data) setProducts(productsRes.data);
      if (purchasesRes?.data) setActivePurchases(purchasesRes.data.filter((p: any) => p.status === 'active'));
      if (usersRes?.data) setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('add') === 'true') {
        openModal();
      }
    }
  }, []);

  const filteredAndSortedSales = useMemo(() => {
    let result = [...sales];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        `${p.customer?.firstName} ${p.customer?.lastName}`.toLowerCase().includes(q) ||
        (p.vpsProduct?.name || '').toLowerCase().includes(q) ||
        (p.invoiceNumber || '').toLowerCase().includes(q) ||
        p.status.includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
    if (sortConfig) {
      result.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof VpsSale];
        let bVal: any = b[sortConfig.key as keyof VpsSale];
        if (sortConfig.key === 'customerName') { aVal = `${a.customer?.firstName} ${a.customer?.lastName}`; bVal = `${b.customer?.firstName} ${b.customer?.lastName}`; }
        else if (sortConfig.key === 'productName') { aVal = a.vpsProduct?.name; bVal = b.vpsProduct?.name; }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [sales, searchQuery, statusFilter, sortConfig]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredAndSortedSales.length / itemsPerPage) || 1;
  const paginatedSales = filteredAndSortedSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const exportToCSV = () => {
    if (!filteredAndSortedSales.length) return;
    const headers = ['Invoice', 'Customer', 'Email', 'Product', 'Linked Node', 'Price', 'Status', 'Start Date'];
    const rows = filteredAndSortedSales.map(p => [
      `"${p.invoiceNumber}"`,
      `"${p.customer?.firstName} ${p.customer?.lastName}"`,
      `"${p.customer?.email}"`,
      `"${p.vpsProduct?.name}"`,
      `"${p.vpsPurchase ? `${p.vpsPurchase.nodeName} (${p.vpsPurchase.vendorName})` : ''}"`,
      `"${p.price}"`, `"${p.status}"`,
      `"${new Date(p.startDate).toLocaleDateString()}"`
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `vps_sales_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    window.URL.revokeObjectURL(url);
  };

  const openModal = (sale?: VpsSale) => {
    setFormError('');
    setSelectedFile(null);
    if (sale) {
      setEditingSale(sale);
      setFormData({
        customerId: sale.customerId, vpsProductId: sale.vpsProductId,
        vpsPurchaseId: sale.vpsPurchaseId || '',
        price: sale.price, status: sale.status,
        endDate: sale.endDate ? new Date(sale.endDate).toISOString().split('T')[0] : '',
        referredById: sale.referredById || ''
      });
    } else {
      setEditingSale(null);
      setFormData({ customerId: '', vpsProductId: '', vpsPurchaseId: '', price: 0, status: 'active', endDate: '', referredById: '' });
    }
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingSale(null); setSelectedFile(null); };

  const handleProductSelect = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    setFormData(prev => ({ ...prev, vpsProductId: productId, price: prod ? prod.price : prev.price }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('customerId', formData.customerId);
      fd.append('vpsProductId', formData.vpsProductId);
      fd.append('vpsPurchaseId', formData.vpsPurchaseId);
      fd.append('price', String(formData.price));
      fd.append('status', formData.status);
      fd.append('endDate', formData.endDate);
      fd.append('referredById', formData.referredById);
      if (selectedFile) {
        fd.append('invoiceFile', selectedFile);
      }

      if (editingSale) {
        await vpsSaleService.updateSale(editingSale.id, fd);
        toast.success('Sale updated successfully!');
      } else {
        await vpsSaleService.createSale(fd);
        toast.success('Sale created & invoice generated!');
      }
      closeModal();
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save sale');
      toast.error(err.message || 'Failed to save sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sale record?')) return;
    try {
      setDeletingId(id);
      await vpsSaleService.deleteSale(id);
      toast.success('Sale deleted!');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRemoveInvoice = async (id: string) => {
    if (!confirm('Remove attached PDF invoice?')) return;
    try {
      await vpsSaleService.removeInvoice(id);
      toast.success('PDF invoice removed!');
      if (editingSale) {
        setEditingSale(prev => prev ? { ...prev, invoicePath: undefined, invoiceName: undefined } : null);
      }
      fetchData();
    } catch (err: any) {
      toast.error('Failed to remove invoice');
    }
  };

  const openInvoicePdf = (id: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('saas_token') : null;
    const url = vpsSaleService.getInvoiceUrl(id);
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><body style="margin:0">
      <iframe src="${url}?token=${token}" style="width:100%;height:100vh;border:none"></iframe>
      </body></html>
    `);
    win.document.close();
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printContent = invoiceRef.current.innerHTML;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Invoice ${invoiceSale?.invoiceNumber}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 32px; color: #1a1a2e; }
        .inv-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .inv-title { font-size: 2.5rem; font-weight: 800; color: #094f56; }
        .inv-meta { text-align: right; font-size: 13px; color: #555; }
        .inv-label { font-size: 11px; text-transform: uppercase; color: #888; margin-bottom: 2px; }
        .inv-section { margin-bottom: 24px; }
        .inv-section h3 { font-size: 12px; text-transform: uppercase; color: #094f56; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        th { background: #094f56; color: white; padding: 10px 14px; text-align: left; font-size: 12px; }
        td { padding: 10px 14px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
        .total-row td { font-weight: 700; font-size: 15px; border-top: 2px solid #094f56; }
        .status-badge { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #dcfce7; color: #166534; }
        .footer { margin-top: 48px; text-align: center; font-size: 11px; color: #aaa; }
      </style></head><body>${printContent}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const customerOptions = customers.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName} (${c.email})` }));
  const productOptions = products.map(p => ({ value: p.id, label: `${p.name} — $${p.price}/mo` }));
  const purchaseOptions = [
    { value: '', label: 'None (unlinked)' },
    ...activePurchases.map(p => ({
      value: p.id,
      label: `${p.nodeName} — ${p.vendorName}${p.ipAddress ? ` (${p.ipAddress})` : ''}`
    }))
  ];
  const userOptions = users.map(u => ({ value: u.id, label: `${u.name || 'No Name'} (${u.email})` }));

  const selectStyles = {
    control: (base: any) => ({ ...base, minHeight: '36px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'none' }),
    menu: (base: any) => ({ ...base, fontSize: '13px', zIndex: 9999 })
  };

  return (
    <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <header>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', background: 'none', WebkitTextFillColor: 'initial', marginBottom: '4px' }}>VPS Sales</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage customer subscriptions and auto-generated invoices.</p>
        </header>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportToCSV} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '36px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '1px solid var(--border-subtle)', borderRadius: '0', background: 'var(--surface-hover)' }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => openModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '36px', fontSize: '13px', borderRadius: '0' }}>
            <Plus size={16} /> New Sale
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input type="text" placeholder="Search invoice, customer, product..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-field" style={{ paddingLeft: '36px', height: '36px', fontSize: '13px' }} />
          </div>
          <div style={{ position: 'relative', width: '140px' }}>
            <Filter size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field" style={{ paddingLeft: '34px', height: '36px', fontSize: '13px', appearance: 'none', cursor: 'pointer' }}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <table className="data-table" style={{ width: '100%', minWidth: '1050px', fontSize: '13px' }}>
          <thead>
            <tr>
              <th onClick={() => requestSort('invoiceNumber')} style={{ cursor: 'pointer', userSelect: 'none' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Invoice {getSortIcon('invoiceNumber')}</div></th>
              <th onClick={() => requestSort('customerName')} style={{ cursor: 'pointer', userSelect: 'none' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Customer {getSortIcon('customerName')}</div></th>
              <th onClick={() => requestSort('productName')} style={{ cursor: 'pointer', userSelect: 'none' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Product {getSortIcon('productName')}</div></th>
              <th>Linked Node</th>
              <th onClick={() => requestSort('price')} style={{ cursor: 'pointer', userSelect: 'none' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Price {getSortIcon('price')}</div></th>
              <th onClick={() => requestSort('status')} style={{ cursor: 'pointer', userSelect: 'none' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Status {getSortIcon('status')}</div></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>Loading sales...</td></tr>
            ) : filteredAndSortedSales.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>No sales found.</td></tr>
            ) : (
              paginatedSales.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(9,79,86,0.08)', color: '#094f56', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', alignSelf: 'flex-start' }}>
                        {p.invoiceNumber}
                      </span>
                      {p.invoicePath && (
                        <button
                          onClick={() => openInvoicePdf(p.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(9,79,86,0.06)', color: '#094f56', border: 'none', padding: '2px 6px', fontSize: '10px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px', alignSelf: 'flex-start' }}
                          title={p.invoiceName || 'View PDF Invoice'}
                        >
                          <Eye size={10} /> View PDF
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{p.customer?.firstName} {p.customer?.lastName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{p.customer?.email}</div>
                    {p.referredBy && (
                      <div style={{ fontSize: '11px', color: '#094f56', marginTop: '2px', fontWeight: '500' }}>
                        Ref: {p.referredBy.name || p.referredBy.email}
                      </div>
                    )}
                  </td>
                  <td><div style={{ fontWeight: '500' }}>{p.vpsProduct?.name}</div></td>
                  <td>
                    {p.vpsPurchase ? (
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '12px' }}>{p.vpsPurchase.nodeName}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{p.vpsPurchase.vendorName}{p.vpsPurchase.ipAddress ? ` · ${p.vpsPurchase.ipAddress}` : ''}</div>
                      </div>
                    ) : <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>—</span>}
                  </td>
                  <td><div style={{ fontWeight: '600', color: '#094f56' }}>${p.price.toFixed(2)}/mo</div></td>
                  <td>
                    <span className={`badge ${p.status === 'active' ? 'badge-success' : p.status === 'suspended' ? 'badge-warning' : ''}`} style={p.status === 'cancelled' ? { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' } : {}}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button onClick={() => setInvoiceSale(p)} style={{ background: 'none', border: 'none', color: '#094f56', cursor: 'pointer' }} title="View Invoice"><FileText size={16} /></button>
                      <button onClick={() => openModal(p)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Edit" disabled={deletingId === p.id}><Edit2 size={16} /></button>
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

      {!loading && filteredAndSortedSales.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', fontSize: '13px' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredAndSortedSales.length)} of {filteredAndSortedSales.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? 'var(--text-tertiary)' : 'var(--text-primary)' }}><ChevronLeft size={16} /></button>
            <span style={{ margin: '0 8px', fontWeight: '500' }}>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? 'var(--text-tertiary)' : 'var(--text-primary)' }}><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* New/Edit Sale Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-card modal-enter" style={{ width: '520px', borderRadius: '0', padding: '24px', position: 'relative', overflow: 'visible' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }} disabled={isSubmitting}><X size={20} /></button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{editingSale ? 'Edit Sale' : 'New Sale'}</h2>
            {!editingSale && <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>An invoice number will be auto-generated on save.</p>}
            {formError && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', fontSize: '13px', marginBottom: '16px' }}>{formError}</div>}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!editingSale && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Customer *</label>
                    <Select options={customerOptions} value={customerOptions.find(c => c.value === formData.customerId) || null} onChange={(opt: any) => setFormData({...formData, customerId: opt?.value || ''})} placeholder="Search customer..." isSearchable styles={selectStyles} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Product *</label>
                    <Select options={productOptions} value={productOptions.find(p => p.value === formData.vpsProductId) || null} onChange={(opt: any) => handleProductSelect(opt?.value || '')} placeholder="Search product..." isSearchable styles={selectStyles} />
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Linked Purchase Node <span style={{ color: 'var(--text-tertiary)' }}>(Optional — only active nodes shown)</span>
                </label>
                <Select
                  options={purchaseOptions}
                  value={purchaseOptions.find(p => p.value === formData.vpsPurchaseId) || purchaseOptions[0]}
                  onChange={(opt: any) => setFormData({...formData, vpsPurchaseId: opt?.value || ''})}
                  placeholder="Select a purchase node..."
                  isSearchable
                  styles={selectStyles}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Referred By <span style={{ color: 'var(--text-tertiary)' }}>(Optional)</span>
                </label>
                <Select
                  options={userOptions}
                  value={userOptions.find(u => u.value === formData.referredById) || null}
                  onChange={(opt: any) => setFormData({...formData, referredById: opt?.value || ''})}
                  placeholder="Select referring user..."
                  isSearchable
                  isClearable
                  styles={selectStyles}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Sale Price ($) *</label>
                  <input required type="number" step="0.01" min="0" className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Status</label>
                  <select className="input-field" style={{ padding: '8px 12px', fontSize: '13px', appearance: 'none' }} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>End Date (Optional)</label>
                <input type="date" className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>

              {/* PDF Invoice Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Paperclip size={13} /> Attach PDF Invoice (Optional)
                  </div>
                </label>
                {editingSale?.invoicePath && !selectedFile && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(9,79,86,0.06)', border: '1px dashed #094f56', marginBottom: '8px', fontSize: '12px', color: '#094f56' }}>
                    <FileText size={14} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{editingSale.invoiceName || 'Attached invoice'}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInvoice(editingSale.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="Remove PDF Invoice"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '1px dashed var(--border)', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: selectedFile ? 'rgba(9,79,86,0.04)' : 'transparent', transition: 'background 0.2s' }}
                >
                  {selectedFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#094f56', fontSize: '13px', fontWeight: '600' }}>
                      <FileText size={16} /> {selectedFile.name}
                      <button type="button" onClick={e => { e.stopPropagation(); setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
                      <Paperclip size={16} style={{ display: 'block', margin: '0 auto 6px' }} />
                      Click to select a PDF invoice file
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={closeModal} style={{ background: 'none', border: '1px solid var(--border)', padding: '8px 16px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '13px' }} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={isSubmitting || (!editingSale && (!formData.customerId || !formData.vpsProductId))}>
                  {isSubmitting && <Loader2 size={14} className="lucide-spin" />}
                  {editingSale ? 'Update Sale' : 'Create & Generate Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceSale && (
        <div className="modal-overlay" onClick={() => setInvoiceSale(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', width: '680px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '0', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#094f56', color: 'white', border: 'none', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                <Printer size={14} /> Print / Download
              </button>
              <button onClick={() => setInvoiceSale(null)} style={{ background: 'none', border: '1px solid #d1d5db', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', color: '#555' }}>Close</button>
            </div>

            <div ref={invoiceRef} style={{ padding: '48px' }}>
              {/* Invoice Header */}
              <div className="inv-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div>
                  <div className="inv-title" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#094f56', letterSpacing: '-1px' }}>INVOICE</div>
                  <div style={{ fontSize: '13px', color: '#555', marginTop: '8px' }}>KeplerX CRM</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#094f56', fontFamily: 'monospace' }}>{invoiceSale.invoiceNumber}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>Date: {new Date(invoiceSale.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Start: {new Date(invoiceSale.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                  {invoiceSale.endDate && <div style={{ fontSize: '12px', color: '#888' }}>End: {new Date(invoiceSale.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>}
                  <span style={{ display: 'inline-block', marginTop: '8px', padding: '2px 12px', fontSize: '11px', fontWeight: '700', background: invoiceSale.status === 'active' ? '#dcfce7' : '#fee2e2', color: invoiceSale.status === 'active' ? '#166534' : '#991b1b', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {invoiceSale.status}
                  </span>
                </div>
              </div>

              {/* Billed To */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#094f56', fontWeight: '700', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px', marginBottom: '10px' }}>Billed To</div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e' }}>{invoiceSale.customer?.firstName} {invoiceSale.customer?.lastName}</div>
                  <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>{invoiceSale.customer?.email}</div>
                  {invoiceSale.customer?.phone && <div style={{ fontSize: '13px', color: '#555' }}>{invoiceSale.customer?.phone}</div>}
                  {invoiceSale.referredBy && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
                      <strong>Referred By:</strong> {invoiceSale.referredBy.name || invoiceSale.referredBy.email}
                    </div>
                  )}
                </div>
                {invoiceSale.vpsPurchase && (
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#094f56', fontWeight: '700', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px', marginBottom: '10px' }}>Server Allocations</div>
                    <div style={{ fontSize: '13px', color: '#1a1a2e' }}><strong style={{ color: '#555' }}>Node:</strong> {invoiceSale.vpsPurchase.nodeName}</div>
                    <div style={{ fontSize: '13px', color: '#1a1a2e', marginTop: '2px' }}><strong style={{ color: '#555' }}>Vendor:</strong> {invoiceSale.vpsPurchase.vendorName}</div>
                    {invoiceSale.vpsPurchase.ipAddress && (
                      <div style={{ fontSize: '13px', color: '#1a1a2e', marginTop: '2px' }}><strong style={{ color: '#555' }}>IP Address:</strong> {invoiceSale.vpsPurchase.ipAddress}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Invoice Lines */}
              <div className="inv-section">
                <h3>Product & Subscriptions</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
                  <thead>
                    <tr>
                      <th style={{ background: '#094f56', color: 'white', padding: '10px 14px', textAlign: 'left', fontSize: '12px' }}>Product Details</th>
                      <th style={{ background: '#094f56', color: 'white', padding: '10px 14px', textAlign: 'right', fontSize: '12px', width: '120px' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>
                        <div style={{ fontWeight: '700', color: '#1a1a2e' }}>{invoiceSale.vpsProduct?.name}</div>
                        <div style={{ fontSize: '12px', color: '#777', marginTop: '4px' }}>{invoiceSale.vpsProduct?.details || 'Standard Cloud VPS hosting service.'}</div>
                      </td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: '600' }}>
                        ${invoiceSale.price.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="total-row">
                      <td style={{ padding: '14px', borderBottom: 'none', textAlign: 'right', fontWeight: '700', fontSize: '14px' }}>Total Due</td>
                      <td style={{ padding: '14px', borderBottom: 'none', textAlign: 'right', fontWeight: '800', fontSize: '16px', color: '#094f56' }}>
                        ${invoiceSale.price.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="footer" style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
                Thank you for your business. KeplerX Next-Gen Cloud Platform.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
