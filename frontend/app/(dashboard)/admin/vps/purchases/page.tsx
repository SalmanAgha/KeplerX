'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Download, Plus, Edit2, Trash2, ChevronUp, ChevronDown, X, Loader2, ChevronLeft, ChevronRight, Filter, FileText, Paperclip, Eye, XCircle } from 'lucide-react';
import { vpsPurchaseService, userService } from '@/services/api';
import toast from 'react-hot-toast';
import Select from 'react-select';

interface VpsPurchase {
  id: string;
  vendorName: string;
  nodeName: string;
  ipAddress?: string;
  cost: number;
  status: string;
  renewalDate?: string;
  billPath?: string;
  billName?: string;
  username?: string;
  password?: string;
  referredById?: string;
  referredBy?: {
    name?: string;
    email: string;
  };
  createdAt: string;
  vpsSales?: Array<{
    id: string;
    customer?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
}

const VENDOR_OPTIONS = [
  'Alpha VPS', 'Hetzner', 'OVH', 'DigitalOcean', 'Linode / Akamai', 'Vultr', 'AWS',
  'Google Cloud', 'Azure', 'Contabo', 'Scaleway', 'UpCloud', 'Other'
];

export default function VpsPurchasesPage() {
  const [purchases, setPurchases] = useState<VpsPurchase[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<VpsPurchase | null>(null);
  const [formData, setFormData] = useState<{
    vendorName: string;
    nodeName: string;
    ipAddress: string;
    cost: number | '';
    status: string;
    renewalDate: string;
    username: string;
    password: string;
    referredById: string;
  }>({
    vendorName: '', nodeName: '', ipAddress: '', cost: 0, status: 'active', renewalDate: '', username: '', password: '', referredById: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [removingBillId, setRemovingBillId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [res, usersRes] = await Promise.all([
        vpsPurchaseService.getPurchases(),
        userService.getAllUsers().catch(() => ({ data: [] }))
      ]);
      if (res?.data) setPurchases(res.data);
      if (usersRes?.data) setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to load purchases');
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

  const filteredAndSorted = useMemo(() => {
    let result = [...purchases];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.vendorName.toLowerCase().includes(q) ||
        p.nodeName.toLowerCase().includes(q) ||
        (p.ipAddress || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal: any = a[sortConfig.key as keyof VpsPurchase] ?? '';
        const bVal: any = b[sortConfig.key as keyof VpsPurchase] ?? '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [purchases, searchQuery, statusFilter, sortConfig]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;
  const paginated = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    if (!filteredAndSorted.length) return;
    const headers = ['Vendor', 'Node Name', 'IP Address', 'Cost', 'Status', 'Renewal Date', 'Has Bill'];
    const rows = filteredAndSorted.map(p => [
      `"${p.vendorName}"`, `"${p.nodeName}"`, `"${p.ipAddress || ''}"`,
      `"${p.cost}"`, `"${p.status}"`,
      `"${p.renewalDate ? new Date(p.renewalDate).toLocaleDateString() : ''}"`,
      `"${p.billPath ? 'Yes' : 'No'}"`
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `vps_purchases_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    window.URL.revokeObjectURL(url);
  };

  const openModal = (purchase?: VpsPurchase) => {
    setFormError('');
    setSelectedFile(null);
    if (purchase) {
      setEditingPurchase(purchase);
      setFormData({
        vendorName: purchase.vendorName, nodeName: purchase.nodeName,
        ipAddress: purchase.ipAddress || '', cost: purchase.cost,
        status: purchase.status,
        renewalDate: purchase.renewalDate ? new Date(purchase.renewalDate).toISOString().split('T')[0] : '',
        username: purchase.username || '',
        password: purchase.password || '',
        referredById: purchase.referredById || ''
      });
    } else {
      setEditingPurchase(null);
      setFormData({ vendorName: '', nodeName: '', ipAddress: '', cost: 0, status: 'active', renewalDate: '', username: '', password: '', referredById: '' });
    }
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingPurchase(null); setSelectedFile(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      // Build FormData so we can send both JSON fields and the optional PDF file
      const fd = new FormData();
      fd.append('vendorName', formData.vendorName);
      fd.append('nodeName', formData.nodeName);
      fd.append('ipAddress', formData.ipAddress);
      fd.append('cost', String(formData.cost || 0));
      fd.append('status', formData.status);
      fd.append('renewalDate', formData.renewalDate);
      fd.append('username', formData.username);
      fd.append('password', formData.password);
      fd.append('referredById', formData.referredById);
      if (selectedFile) fd.append('bill', selectedFile);

      if (editingPurchase) {
        await vpsPurchaseService.updatePurchase(editingPurchase.id, fd);
        toast.success('Purchase updated!');
      } else {
        await vpsPurchaseService.createPurchase(fd);
        toast.success('Purchase recorded!');
      }
      closeModal();
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save');
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vendor purchase record?')) return;
    try {
      setDeletingId(id);
      await vpsPurchaseService.deletePurchase(id);
      toast.success('Deleted!');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRemoveBill = async (id: string) => {
    if (!confirm('Remove attached bill from this purchase?')) return;
    try {
      setRemovingBillId(id);
      await vpsPurchaseService.removeBill(id);
      toast.success('Bill removed!');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to remove bill');
    } finally {
      setRemovingBillId(null);
    }
  };

  const openBill = (id: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('saas_token') : null;
    const url = vpsPurchaseService.getBillUrl(id);
    // Open in new tab — browser will handle PDF viewing
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><body style="margin:0">
      <iframe src="${url}?token=${token}" style="width:100%;height:100vh;border:none"></iframe>
      </body></html>
    `);
    win.document.close();
  };

  // Summary stats
  const totalMonthlyCost = purchases.filter(p => p.status === 'active').reduce((s, p) => s + p.cost, 0);
  const activeCount = purchases.filter(p => p.status === 'active').length;

  const userOptions = users.map(u => ({ value: u.id, label: `${u.name || 'No Name'} (${u.email})` }));
  const selectStyles = {
    control: (base: any) => ({ ...base, minHeight: '36px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'none' }),
    menu: (base: any) => ({ ...base, fontSize: '13px', zIndex: 9999 })
  };

  return (
    <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <header>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', background: 'none', WebkitTextFillColor: 'initial', marginBottom: '4px' }}>VPS Purchases</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track servers & nodes you purchase from vendors. Attach PDF bills.</p>
        </header>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportToCSV} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '36px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '1px solid var(--border-subtle)', borderRadius: '0', background: 'var(--surface-hover)' }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => openModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '36px', fontSize: '13px', borderRadius: '0' }}>
            <Plus size={16} /> New Purchase
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Active Nodes</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{activeCount}</div>
        </div>
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Monthly Vendor Cost</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>${totalMonthlyCost.toFixed(2)}</div>
        </div>
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Records</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{purchases.length}</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input type="text" placeholder="Search vendor, node, IP..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-field" style={{ paddingLeft: '36px', height: '36px', fontSize: '13px' }} />
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

        <table className="data-table" style={{ width: '100%', minWidth: '950px', fontSize: '13px' }}>
          <thead>
            <tr>
              <th onClick={() => requestSort('vendorName')} style={{ cursor: 'pointer', userSelect: 'none' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Vendor {getSortIcon('vendorName')}</div></th>
              <th>Node Name</th>
              <th>IP & Credentials</th>
              <th onClick={() => requestSort('cost')} style={{ cursor: 'pointer', userSelect: 'none' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Cost/mo {getSortIcon('cost')}</div></th>
              <th>Renewal</th>
              <th>Bill</th>
              <th onClick={() => requestSort('status')} style={{ cursor: 'pointer', userSelect: 'none' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Status {getSortIcon('status')}</div></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>No vendor purchases found.</td></tr>
            ) : (
              paginated.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{p.vendorName}</div>
                    {p.referredBy && (
                      <div style={{ fontSize: '11px', color: '#094f56', marginTop: '2px', fontWeight: '500' }}>
                        Ref: {p.referredBy.name || p.referredBy.email}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}>{p.nodeName}</div>
                    {p.vpsSales && p.vpsSales.length > 0 && p.vpsSales[0].customer && (
                      <div style={{ fontSize: '11px', color: '#094f56', marginTop: '2px', fontWeight: '500' }} title={p.vpsSales[0].customer.email}>
                        👤 {p.vpsSales[0].customer.firstName} {p.vpsSales[0].customer.lastName}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {p.ipAddress ? (
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(9,79,86,0.08)', color: '#094f56', padding: '2px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>{p.ipAddress}</span>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>—</span>
                      )}
                      {(p.username || p.password) && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', flexWrap: 'wrap' }}>
                          {p.username && <span title="Username" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>👤 {p.username}</span>}
                          {p.password && (
                            <span 
                              style={{ cursor: 'pointer', borderBottom: '1px dotted var(--text-tertiary)', color: '#094f56', fontWeight: 'bold' }} 
                              title="Click to copy password" 
                              onClick={() => {
                                navigator.clipboard.writeText(p.password || '');
                                toast.success('Password copied!');
                              }}
                            >
                              🔑 copy pass
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td><div style={{ fontWeight: '600', color: '#ef4444' }}>${p.cost.toFixed(2)}</div></td>
                  <td><div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.renewalDate ? new Date(p.renewalDate).toLocaleDateString() : '—'}</div></td>
                  <td>
                    {p.billPath ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          onClick={() => openBill(p.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(9,79,86,0.08)', color: '#094f56', border: 'none', padding: '3px 8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' }}
                          title={p.billName || 'View Bill'}
                        >
                          <Eye size={12} /> View PDF
                        </button>
                        <button
                          onClick={() => handleRemoveBill(p.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                          title="Remove bill"
                          disabled={removingBillId === p.id}
                        >
                          {removingBillId === p.id ? <Loader2 size={12} className="lucide-spin" /> : <XCircle size={13} />}
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>No bill</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${p.status === 'active' ? 'badge-success' : p.status === 'suspended' ? 'badge-warning' : ''}`} style={p.status === 'cancelled' ? { background: 'rgba(239,68,68,0.1)', color: '#ef4444' } : {}}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => openModal(p)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} disabled={deletingId === p.id}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: deletingId === p.id ? 'not-allowed' : 'pointer' }} disabled={deletingId === p.id}>
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

      {!loading && filteredAndSorted.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', fontSize: '13px' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length} entries
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? 'var(--text-tertiary)' : 'var(--text-primary)' }}><ChevronLeft size={16} /></button>
            <span style={{ margin: '0 8px', fontWeight: '500' }}>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? 'var(--text-tertiary)' : 'var(--text-primary)' }}><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-card modal-enter" style={{ width: '500px', borderRadius: '0', padding: '24px', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }} disabled={isSubmitting}><X size={20} /></button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{editingPurchase ? 'Edit Purchase' : 'New Purchase'}</h2>
            {formError && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '10px', fontSize: '13px', marginBottom: '16px' }}>{formError}</div>}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Vendor *</label>
                  <select required className="input-field" style={{ padding: '8px 12px', fontSize: '13px', appearance: 'none' }} value={formData.vendorName} onChange={e => setFormData({...formData, vendorName: e.target.value})}>
                    <option value="">Select Vendor...</option>
                    {VENDOR_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Node Name *</label>
                  <input required className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.nodeName} onChange={e => setFormData({...formData, nodeName: e.target.value})} placeholder="e.g. Node-Alpha-01" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>IP Address (Optional)</label>
                <input className="input-field" style={{ padding: '8px 12px', fontSize: '13px', fontFamily: 'monospace' }} value={formData.ipAddress} onChange={e => setFormData({...formData, ipAddress: e.target.value})} placeholder="e.g. 192.168.1.100" />
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
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Username (Optional)</label>
                  <input className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="e.g. root" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Password (Optional)</label>
                  <input className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Password / SSH Key" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Monthly Cost ($) *</label>
                  <input required type="number" step="0.01" min="0" className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.cost === '' || isNaN(formData.cost as number) ? '' : String(formData.cost)} onChange={e => { const val = parseFloat(e.target.value); setFormData({...formData, cost: isNaN(val) ? '' : val}); }} />
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
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Renewal Date (Optional)</label>
                <input type="date" className="input-field" style={{ padding: '8px 12px', fontSize: '13px' }} value={formData.renewalDate} onChange={e => setFormData({...formData, renewalDate: e.target.value})} />
              </div>

              {/* PDF Bill Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Paperclip size={13} /> Attach Vendor Bill (PDF, max 10MB)
                  </div>
                </label>
                {editingPurchase?.billPath && !selectedFile && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(9,79,86,0.06)', border: '1px dashed #094f56', marginBottom: '8px', fontSize: '12px', color: '#094f56' }}>
                    <FileText size={14} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{editingPurchase.billName || 'Attached bill'}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Upload new to replace</span>
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
                      Click to select a PDF file
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={closeModal} style={{ background: 'none', border: '1px solid var(--border)', padding: '8px 16px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '13px' }} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 size={14} className="lucide-spin" />}
                  {editingPurchase ? 'Update' : 'Save Purchase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
