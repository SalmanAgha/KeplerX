import React, { useState } from 'react';
import './tests.css';

function Tests() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = e => {
    const f = e.target.files[0];
    setFile(f);
    setResult(null);
  };

  const handleRun = () => {
    if (!file) return;
    // TODO integrate backend eval endpoint
    setResult({ accuracy: 92.4, latency: 1.6 });
  };

  return (
    <div className="tests-wrapper">
      <h2>Evaluation Tests</h2>
      <div className="tests-inputs">
        <input type="file" accept=".csv,.json" onChange={handleUpload} />
        <button disabled={!file} onClick={handleRun}>
          Run Test
        </button>
      </div>
      {result && (
        <div className="test-result">
          <p>Accuracy: {result.accuracy}%</p>
          <p>Avg Latency: {result.latency}s</p>
        </div>
      )}
    </div>
  );
}

export default Tests;
