import React, { useEffect, useState } from 'react';
import Spinner from '../../../components/common/Spinner/Spinner';

const MONITOR_API_URL = process.env.REACT_APP_MONITOR_API_URL || 'http://localhost:8000';

export default function StatsMonitor(){
  const [stats,setStats]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  const fetchStats=async()=>{
    try{
      const res=await fetch(`${MONITOR_API_URL}/monitor`);
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data=await res.json();
      setStats(data);
    }catch(err){
      setError('Unable to fetch stats');
    }finally{setLoading(false);} };

  useEffect(()=>{fetchStats();},[]);

  if(loading) return <Spinner/>;
  if(error)   return <p style={{color:'red'}}>{error}</p>;

  const gap=stats.embed_gap??0;
  return (
    <div style={{marginTop:24}}>
      <h3 style={{marginTop:0}}>Infrastructure Stats</h3>
      <p>Last updated: {new Date(stats.timestamp).toLocaleString()}</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'16px'}}>
        <div style={{border:'1px solid var(--greyd-border-color)',borderRadius:'8px',padding:'16px'}}>
          <h4>PostgreSQL</h4>
          <ul>
            <li>Conversations: {stats.postgres.conversations}</li>
            <li>Ticket chunks: {stats.postgres.rag_tickets}</li>
            <li>Pending Embeds: {stats.postgres.pending_embeds}</li>
          </ul>
        </div>
        <div style={{border:'1px solid var(--greyd-border-color)',borderRadius:'8px',padding:'16px'}}>
          <h4>Qdrant</h4>
          <ul>
            <li>Status: {stats.qdrant.enabled?'🟢 Connected':'🔴 Unreachable'}</li>
            <li>Collection: {stats.qdrant.collection}</li>
            <li>Vectors: {stats.qdrant.vectors}</li>
            <li>Vectors missing: <span style={{color:gap>0?'red':'green',fontWeight:600}}>{gap}</span></li>
            <li>Dimension: {stats.qdrant.dimension}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
