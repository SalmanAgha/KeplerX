import React from 'react';
import Tabs from '../../components/common/Tabs/Tabs';

function PreProcessor() {
  const tabs = [
    { id: 'analytics',   label: 'Analytics',   content: <h3>Analytics coming soon</h3> },
    { id: 'preprocessor',label: 'Preprocessor',content: <h3>Preprocessor main UI</h3> },
    { id: 'history',     label: 'History',     content: <h3>Preprocessor history</h3> },
    { id: 'logs',        label: 'Logs',        content: <h3>Preprocessor logs</h3> },
    { id: 'settings',    label: 'Settings',    content: <h3>Preprocessor settings</h3> },
  ];
  return (
    <div style={{padding:'16px'}}>
      <h2>Pre-Processor</h2>
      <Tabs tabs={tabs} />
    </div>
  );
}
export default PreProcessor;
