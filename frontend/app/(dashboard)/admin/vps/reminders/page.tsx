'use client';

import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, AlertTriangle, CheckCircle, Clock, Eye, X } from 'lucide-react';
import { systemService } from '@/services/api';
import toast from 'react-hot-toast';

export default function ReminderQueuePage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBody, setSelectedBody] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await systemService.getJobs('');
      if (res && res.data) {
        // Filter specifically for expiry reminders
        const reminderJobs = res.data.filter((job: any) => job.payload?.isReminder === true);
        setJobs(reminderJobs);
      }
    } catch (err) {
      toast.error('Failed to load reminder queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle size={14} color="#10b981" />;
      case 'FAILED': return <AlertTriangle size={14} color="#ef4444" />;
      case 'PROCESSING': return <RefreshCw size={14} className="lucide-spin" color="#3b82f6" />;
      default: return <Clock size={14} color="#f59e0b" />;
    }
  };

  return (
    <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <header>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={24} style={{ color: '#094f56' }} /> Reminder Queue
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track automated subscription expiry emails sent to customers.</p>
        </header>
        <button onClick={fetchJobs} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '36px', fontSize: '13px', borderRadius: '0' }} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'lucide-spin' : ''} /> Refresh Logs
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '0' }}>
        <table className="data-table" style={{ width: '100%', minWidth: '800px', fontSize: '13px' }}>
          <thead>
            <tr>
              <th>Status</th>
              <th>Recipient</th>
              <th>Subject</th>
              <th>Sale Created</th>
              <th>Scheduled Date</th>
              <th>Attempts</th>
              <th>Executed At</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>Loading reminders...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>No email reminders found in current queue logs.</td></tr>
            ) : (
              jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                      {getStatusIcon(job.status)} {job.status}
                    </div>
                  </td>
                  <td style={{ fontWeight: '500' }}>{job.payload?.to || '-'}</td>
                  <td>{job.payload?.subject || '-'}</td>
                  <td>{job.payload?.saleCreatedAt ? new Date(job.payload.saleCreatedAt).toLocaleString() : 'N/A'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{job.runAt ? new Date(job.runAt).toLocaleString() : '-'}</td>
                  <td>{job.attempts}</td>
                  <td style={{ color: 'var(--text-tertiary)' }}>
                    {job.status === 'COMPLETED' || job.status === 'FAILED' ? new Date(job.updatedAt).toLocaleString() : '—'}
                  </td>
                  <td>
                    <button 
                      onClick={() => setSelectedBody(job.payload?.body || '')}
                      style={{ background: 'rgba(9,79,86,0.08)', color: '#094f56', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600' }}
                    >
                      <Eye size={12} /> View Body
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Email Body Modal */}
      {selectedBody !== null && (
        <div className="modal-overlay" onClick={() => setSelectedBody(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', padding: '24px', width: '500px', borderRadius: '0', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => setSelectedBody(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20} /></button>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#1a1a2e', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Email Content</h3>
            <div 
              style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', maxHeight: '300px', overflowY: 'auto', background: '#f9fafb', padding: '16px', border: '1px solid #e5e7eb', fontFamily: 'sans-serif' }}
              dangerouslySetInnerHTML={{ __html: selectedBody }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setSelectedBody(null)} className="btn-primary" style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '0' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
