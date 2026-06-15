'use client';

import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { systemService } from '@/services/api';
import toast from 'react-hot-toast';

export default function EmailsAuditPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await systemService.getJobs('EMAIL');
      if (res && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      toast.error('Failed to load email queue');
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
            <Mail size={24} color="var(--brand-primary)" /> Email Queue Audit
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor all outgoing emails processed by the background worker.</p>
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
              <th>Attempts</th>
              <th>Created At</th>
              <th>Error Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>Loading queue...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>No email jobs found.</td></tr>
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
                  <td>{job.attempts}</td>
                  <td style={{ color: 'var(--text-tertiary)' }}>{new Date(job.createdAt).toLocaleString()}</td>
                  <td style={{ color: '#ef4444', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={job.error || ''}>
                    {job.error || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
