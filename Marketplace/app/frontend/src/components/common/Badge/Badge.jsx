import React from 'react';

const colorMap = {
  info: 'var(--greyd-primary-color)',
  running: 'var(--greyd-primary-color)',
  queued: 'var(--greyd-text-muted)',
  warn: '#f59e0b',
  error: 'var(--greyd-danger-color)',
  completed: 'var(--greyd-success-color)',
};

function Badge({ label, type = 'info' }) {
  return (
    <span
      style={{
        background: colorMap[type] || 'var(--greyd-primary-color)',
        color: '#fff',
        padding: '2px 8px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        userSelect: 'none',
      }}
    >
      {label || type}
    </span>
  );
}

export default Badge;
