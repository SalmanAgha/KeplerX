'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Eye, 
  X,
  FileText,
  Clock
} from 'lucide-react';
import { cronService } from '@/services/api';
import toast from 'react-hot-toast';

interface CronLog {
  id: string;
  name: string;
  status: string;
  processedJobsCount: number;
  details: string | null;
  error: string | null;
  startedAt: string;
  completedAt: string | null;
}

export default function CronPage() {
  const [logs, setLogs] = useState<CronLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [selectedLog, setSelectedLog] = useState<CronLog | null>(null);

  const fetchLogs = async (quiet = false) => {
    try {
      if (!quiet) setLoading(true);
      const res = await cronService.getLogs();
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch cron logs');
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleTriggerCron = async () => {
    try {
      setTriggering(true);
      toast.loading('Triggering cron job execution...', { id: 'cron-trigger' });
      const res = await cronService.triggerCron();
      if (res.status === 'success') {
        toast.success('Cron job triggered in background successfully', { id: 'cron-trigger' });
        // Poll for updates after 2 seconds to see the new execution log
        setTimeout(() => fetchLogs(true), 2000);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to trigger cron job', { id: 'cron-trigger' });
    } finally {
      setTriggering(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', background: 'rgba(16, 185, 129, 0.08)', padding: '4px 10px', fontSize: '12px', fontWeight: '600' }}>
            <CheckCircle2 size={14} /> Success
          </div>
        );
      case 'FAILED':
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', padding: '4px 10px', fontSize: '12px', fontWeight: '600' }}>
            <XCircle size={14} /> Failed
          </div>
        );
      case 'PROCESSING':
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.08)', padding: '4px 10px', fontSize: '12px', fontWeight: '600' }}>
            <Loader2 size={14} className="lucide-spin" /> Processing
          </div>
        );
      default:
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b7280', background: 'rgba(107, 114, 128, 0.08)', padding: '4px 10px', fontSize: '12px', fontWeight: '600' }}>
            {status}
          </div>
        );
    }
  };

  const getDuration = (startStr: string, endStr: string | null) => {
    if (!endStr) return '—';
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 1000) return `${diffMs}ms`;
    return `${(diffMs / 1000).toFixed(2)}s`;
  };

  return (
    <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={24} style={{ color: '#094f56' }} /> Cron Job logs
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor automated email reminder and task scheduler cron runs (executes every 3 hours).</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => fetchLogs()} 
            className="btn-primary" 
            style={{ background: 'white', color: 'var(--text-primary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '38px', fontSize: '13px', borderRadius: '0' }}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'lucide-spin' : ''} /> Refresh Logs
          </button>
          
          <button 
            onClick={handleTriggerCron} 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '38px', fontSize: '13px', borderRadius: '0' }}
            disabled={triggering}
          >
            <Play size={14} /> Run Cron Job Now
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '0' }}>
        <table className="data-table" style={{ width: '100%', minWidth: '800px', fontSize: '13px' }}>
          <thead>
            <tr>
              <th>Status</th>
              <th>Cron Job Name</th>
              <th>Started At</th>
              <th>Duration</th>
              <th>Processed Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>Loading execution logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>No cron logs found. Run the cron job manually to initialize logs.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td>{getStatusBadge(log.status)}</td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{log.name}</td>
                  <td>{new Date(log.startedAt).toLocaleString()}</td>
                  <td>{getDuration(log.startedAt, log.completedAt)}</td>
                  <td style={{ fontWeight: '700' }}>{log.processedJobsCount} items</td>
                  <td>
                    <button 
                      onClick={() => setSelectedLog(log)}
                      style={{ background: 'rgba(9,79,86,0.08)', color: '#094f56', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600' }}
                    >
                      <Eye size={12} /> View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Detailed Log Modal */}
      {selectedLog !== null && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', padding: '24px', width: '550px', borderRadius: '0', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button onClick={() => setSelectedLog(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20} /></button>
            
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e', borderBottom: '1px solid #eee', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: '#094f56' }} /> Execution Log Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '12px' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontWeight: '500' }}>Status</span>
                <span style={{ display: 'block', marginTop: '4px' }}>{getStatusBadge(selectedLog.status)}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontWeight: '500' }}>Duration</span>
                <span style={{ display: 'block', marginTop: '6px', fontWeight: '600' }}>{getDuration(selectedLog.startedAt, selectedLog.completedAt)}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontWeight: '500' }}>Started At</span>
                <span style={{ display: 'block', marginTop: '4px', color: 'var(--text-primary)' }}>{new Date(selectedLog.startedAt).toLocaleString()}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontWeight: '500' }}>Completed At</span>
                <span style={{ display: 'block', marginTop: '4px', color: 'var(--text-primary)' }}>{selectedLog.completedAt ? new Date(selectedLog.completedAt).toLocaleString() : '—'}</span>
              </div>
            </div>

            {selectedLog.error && (
              <div style={{ marginBottom: '16px' }}>
                <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Error Details</span>
                <div style={{ background: 'rgba(239, 68, 68, 0.04)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', fontSize: '12px', fontFamily: 'monospace', maxHeight: '120px', overflowY: 'auto' }}>
                  {selectedLog.error}
                </div>
              </div>
            )}

            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Execution Trace / Process Details</span>
              <div style={{ background: '#f9fafb', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '12px', fontSize: '12px', fontFamily: 'monospace', maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {selectedLog.details || 'No trace information generated.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setSelectedLog(null)} className="btn-primary" style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '0' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
