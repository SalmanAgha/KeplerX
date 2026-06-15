'use client';

import React, { useState, useEffect } from 'react';
import { Save, Bell, Mail, Loader2, Info, Check } from 'lucide-react';
import { vpsSettingsService } from '@/services/api';
import toast from 'react-hot-toast';

export default function VpsSettingsPage() {
  const [formData, setFormData] = useState({
    reminder1Days: 7,
    reminder1Enabled: true,
    reminder2Days: 3,
    reminder2Enabled: true,
    emailSubject: '',
    emailBody: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await vpsSettingsService.getSettings();
        if (res?.data) {
          setFormData({
            reminder1Days: res.data.reminder1Days,
            reminder1Enabled: res.data.reminder1Enabled,
            reminder2Days: res.data.reminder2Days,
            reminder2Enabled: res.data.reminder2Enabled,
            emailSubject: res.data.emailSubject || '',
            emailBody: res.data.emailBody || ''
          });
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await vpsSettingsService.updateSettings(formData);
      toast.success('Settings saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Loader2 size={32} className="lucide-spin" style={{ color: '#094f56' }} />
      </div>
    );
  }

  return (
    <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <header>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>VPS Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure automated subscription expiry reminders and email notifications.</p>
      </header>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Subscription Reminders Card */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '0', border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-primary)' }}>
            <Bell size={18} style={{ color: '#094f56' }} /> Expiry Reminders
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Reminder 1 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(9,79,86,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Reminder 1</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>First notification to send to customer before expiration.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="number" 
                  min="1" 
                  className="input-field" 
                  style={{ width: '80px', height: '36px', textAlign: 'center', padding: '0' }}
                  value={formData.reminder1Days} 
                  disabled={!formData.reminder1Enabled}
                  onChange={e => setFormData({ ...formData, reminder1Days: parseInt(e.target.value, 10) || 1 })}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>days before</span>
                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.reminder1Enabled} 
                    onChange={e => setFormData({ ...formData, reminder1Enabled: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                    background: formData.reminder1Enabled ? '#094f56' : '#ccc',
                    transition: '.2s', borderRadius: '20px'
                  }}>
                    <span style={{
                      position: 'absolute', content: '""', height: '14px', width: '14px', left: '3px', bottom: '3px',
                      background: 'white', transition: '.2s', borderRadius: '50%',
                      transform: formData.reminder1Enabled ? 'translateX(20px)' : 'none'
                    }} />
                  </span>
                </label>
              </div>
            </div>

            {/* Reminder 2 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(9,79,86,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Reminder 2</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Final urgency notification to send to customer before expiration.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="number" 
                  min="1" 
                  className="input-field" 
                  style={{ width: '80px', height: '36px', textAlign: 'center', padding: '0' }}
                  value={formData.reminder2Days} 
                  disabled={!formData.reminder2Enabled}
                  onChange={e => setFormData({ ...formData, reminder2Days: parseInt(e.target.value, 10) || 1 })}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>days before</span>
                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.reminder2Enabled} 
                    onChange={e => setFormData({ ...formData, reminder2Enabled: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                    background: formData.reminder2Enabled ? '#094f56' : '#ccc',
                    transition: '.2s', borderRadius: '20px'
                  }}>
                    <span style={{
                      position: 'absolute', content: '""', height: '14px', width: '14px', left: '3px', bottom: '3px',
                      background: 'white', transition: '.2s', borderRadius: '50%',
                      transform: formData.reminder2Enabled ? 'translateX(20px)' : 'none'
                    }} />
                  </span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Email Templates Card */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '0', border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            <Mail size={18} style={{ color: '#094f56' }} /> Email Notification Template
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Subject</label>
              <input 
                required 
                type="text" 
                className="input-field" 
                style={{ padding: '8px 12px', fontSize: '13px' }}
                value={formData.emailSubject} 
                onChange={e => setFormData({ ...formData, emailSubject: e.target.value })}
                placeholder="e.g. Subscription Expiry Warning"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Body</label>
              <textarea 
                required 
                rows={8}
                className="input-field" 
                style={{ padding: '10px 12px', fontSize: '13px', fontFamily: 'monospace', lineHeight: '1.5', resize: 'vertical' }}
                value={formData.emailBody} 
                onChange={e => setFormData({ ...formData, emailBody: e.target.value })}
                placeholder="Compose email template..."
              />
            </div>

            {/* Informational Placeholders */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(9,79,86,0.05)', padding: '12px 16px', borderLeft: '3px solid #094f56' }}>
              <Info size={16} style={{ color: '#094f56', marginTop: '2px', minWidth: '16px' }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Available Dynamic Placeholders:</span>
                You can insert the following variables into the email subject and body:
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px', fontFamily: 'monospace', color: '#094f56', fontSize: '11px' }}>
                  <span>{"{invoice}"}</span>
                  <span>{"{product}"}</span>
                  <span>{"{days}"}</span>
                  <span>{"{endDate}"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" style={{ padding: '0 24px', height: '40px', fontSize: '13px', borderRadius: '0', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={saving}>
            {saving ? <Loader2 size={16} className="lucide-spin" /> : <Save size={16} />} Save Settings
          </button>
        </div>

      </form>
    </div>
  );
}
