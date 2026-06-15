'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import { systemService } from '@/services/api';
import toast from 'react-hot-toast';

export default function SmtpConfigPage() {
  const [formData, setFormData] = useState({
    host: '',
    port: 587,
    user: '',
    password: '',
    fromEmail: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await systemService.getSmtpConfig();
      if (res && res.data) {
        setFormData({
          host: res.data.host || '',
          port: res.data.port || 587,
          user: res.data.user || '',
          password: res.data.password || '',
          fromEmail: res.data.fromEmail || ''
        });
      }
    } catch (err) {
      toast.error('Failed to load SMTP configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await systemService.updateSmtpConfig(formData);
      toast.success('SMTP Configuration saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
      <header>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={24} color="var(--brand-primary)" /> Global SMTP Configuration
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure the email server credentials used by the background queue to send emails.</p>
      </header>

      <div className="glass-card" style={{ borderRadius: '0' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading configuration...</div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>SMTP Host *</label>
              <input 
                required 
                className="input-field" 
                value={formData.host} 
                onChange={e => setFormData({...formData, host: e.target.value})} 
                placeholder="e.g. smtp.gmail.com"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>SMTP Port *</label>
              <input 
                required 
                type="number"
                className="input-field" 
                value={formData.port} 
                onChange={e => setFormData({...formData, port: parseInt(e.target.value)})} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>SMTP Username *</label>
              <input 
                required 
                className="input-field" 
                value={formData.user} 
                onChange={e => setFormData({...formData, user: e.target.value})} 
                placeholder="e.g. your-email@gmail.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>SMTP Password *</label>
              <input 
                required 
                type="password"
                className="input-field" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                placeholder="App Password or SMTP Secret"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>From Email Address *</label>
              <input 
                required 
                className="input-field" 
                value={formData.fromEmail} 
                onChange={e => setFormData({...formData, fromEmail: e.target.value})} 
                placeholder='e.g. "CRM Support" <support@yourdomain.com>'
              />
            </div>

            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', marginTop: '8px', borderRadius: '0' }} disabled={saving}>
              {saving ? <Loader2 size={16} className="lucide-spin" /> : <Save size={16} />}
              {saving ? 'Saving Configuration...' : 'Save Configuration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
