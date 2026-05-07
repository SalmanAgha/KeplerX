import React, { useEffect, useState } from 'react';
import * as api from '../../api/scraper';

export default function Settings(){
  const [cfg,setCfg]=useState(null);
  const [msg,setMsg]=useState(null);
  useEffect(()=>{
    api.request('/scrape/settings').then(setCfg).catch(()=>{});
  },[]);
  if(!cfg) return <div>Loading…</div>;
  const save=async(e)=>{
    e.preventDefault();
    try{
      await api.updateSettings(cfg);
      setMsg('Saved');
    }catch(err){setMsg(err.message);}  };
  return (
    <form onSubmit={save} style={{maxWidth:500}}>
      <label>Concurrent requests</label>
      <input type="number" value={cfg.concurrent_requests} onChange={e=>setCfg({...cfg,concurrent_requests:+e.target.value})}/>
      <label>Download delay (s)</label>
      <input type="number" step="0.1" value={cfg.download_delay} onChange={e=>setCfg({...cfg,download_delay:+e.target.value})}/>
      <button>Save</button>
      {msg&&<p>{msg}</p>}
    </form>
  );
}
