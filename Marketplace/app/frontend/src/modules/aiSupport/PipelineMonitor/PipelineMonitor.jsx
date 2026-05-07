import React, { useEffect, useState } from 'react';
import Spinner from '../../../components/common/Spinner/Spinner';
import PipelineControls from './PipelineControls';

const MONITOR_API_URL = process.env.REACT_APP_MONITOR_API_URL || 'http://localhost:8000';

function PipelineMonitor() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${MONITOR_API_URL}/monitor`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('monitor fetch err', err);
      setError('Unable to fetch monitoring data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <Spinner/>;
  if (error)   return <p style={{color:'red',padding:24}}>{error}</p>;

  const gap = stats?.embed_gap ?? 0;
  return (
    <div style={{padding:'16px'}}>
      <h2>Pipeline Monitor</h2>
      <p style={{marginBottom:'12px'}}>Embedding gap: <strong>{gap}</strong></p>
      <PipelineControls />
    </div>
  );
}
export default PipelineMonitor;
