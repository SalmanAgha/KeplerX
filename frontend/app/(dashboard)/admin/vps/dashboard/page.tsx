'use client';

import React from 'react';

export default function VpsDashboardPage() {
  return (
    <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>VPS Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Overview of server metrics and active instances.</p>
      </header>
      <div className="glass-card" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>VPS metrics will be displayed here.</p>
      </div>
    </div>
  );
}
