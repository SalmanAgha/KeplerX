import React, { useState } from 'react';
import { useTaskRunner } from '../../../hooks/useTaskRunner';

export default function PipelineControls() {
  const [limit, setLimit] = useState(50);
  const { run, logs, running } = useTaskRunner();

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Pipeline controls</h3>
      <div style={{ marginBottom: 8 }}>
        <label>
          Limit&nbsp;
          <input
            type="number"
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            style={{ width: 80 }}
          />
        </label>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th style={{ padding: 6 }}>Task</th>
            <th style={{ padding: 6 }}>Description</th>
            <th style={{ padding: 6 }}>Run</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['fetch_only', 'Downloads the next n conversations only (no processing)'],
            ['batch_pipeline', 'Fetch + preprocess + embed next n conversations'],
            ['demo', 'Sends demo log lines'],
            ['embed_pending', 'Embed any conversations still missing vectors'],
            ['delete_embeddings', 'Drop all embeddings & vectors from collection'],
          ].map(([task, desc], idx) => (
            <tr key={task} style={idx % 2 ? { background: '#fafafa' } : {}}>
              <td style={{ padding: 6 }}>{task.replace(/_/g, ' ')}</td>
              <td style={{ padding: 6 }}>{desc}</td>
              <td style={{ padding: 6 }}>
                <button onClick={() => run(task, { limit })} disabled={running}>
                  Run
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <pre style={{ background: '#111', color: '#0f0', height: 300, overflowY: 'auto', marginTop: 16, padding: 8, fontSize: 12 }}>
        {logs.join('\n')}
      </pre>
    </div>
  );
}
