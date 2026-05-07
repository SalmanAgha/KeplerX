import React, { useState } from 'react';
import './settings.css';

function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="slider" />
      <span className="label-text">{label}</span>
    </label>
  );
}

function Settings() {
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [vectorSize, setVectorSize] = useState(1024);
  const [model, setModel] = useState('gpt-4');

  return (
    <div className="settings-wrapper">
      <h2>AI Support Settings</h2>

      <div className="setting-block">
        <h4>General</h4>
        <Toggle label="Enable HelpScout Webhook" checked={webhookEnabled} onChange={setWebhookEnabled} />
      </div>

      <div className="setting-block">
        <h4>Embedding Parameters</h4>
        <label>
          Vector Size&nbsp;
          <input
            type="number"
            value={vectorSize}
            onChange={e => setVectorSize(Number(e.target.value))}
            min={128}
            max={4096}
          />
        </label>
      </div>

      <div className="setting-block">
        <h4>Model</h4>
        <select value={model} onChange={e => setModel(e.target.value)}>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="local-model">Local Model</option>
        </select>
      </div>
    </div>
  );
}

export default Settings;
