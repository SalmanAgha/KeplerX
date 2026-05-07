import React from 'react';
import Tabs from '../../components/common/Tabs/Tabs';
import Modal from '../../components/common/Modal/Modal';
import { ScraperProvider, useScraper } from '../../context/ScraperContext';
import Logs from './Logs.jsx';
import HealthBadge from './HealthBadge.jsx';
import Analytics from './Analytics.jsx';
import Settings from './Settings.jsx';
import { ToastProvider, useToast } from '../../context/ToastContext';
import Swal from 'sweetalert2';
import * as api from '../../api/scraper';

function ScraperTab() {
  const toast = useToast();
  const { startScrape, loading } = useScraper();
  const [url, setUrl] = React.useState('');
  const [msg, setMsg] = React.useState(null);
  const submit = async (e) => {
    e.preventDefault();
    try {
      const job = await startScrape(url);
      toast(`Job ${job.job_id.slice(0,8)} started`);
      setUrl('');
    } catch (err) {
      setMsg(err.message);
    }
  };
  return (
    <form onSubmit={submit} style={{maxWidth:500,display:'flex',gap:8,alignItems:'center'}}>
      <input
        value={url}
        onChange={e=>setUrl(e.target.value)}
        placeholder="https://example.com"
        required
        style={{flex:1,padding:'8px 12px',border:'1px solid #999',borderRadius:4,background:'#fafafa',color:'#000',display:'block'}}
      />
      <button style={{padding:'8px 16px'}} disabled={loading||!url}>Start</button>
    </form>
  );
}

function HistoryTab(){
  const { jobs, refreshJobs } = useScraper();
  const [page,setPage]=React.useState(0);
  const [q,setQ]=React.useState('');
  const pageSize=10;
  const filtered=jobs.filter(j=>(j.id||'').includes(q));
  const slice=filtered.slice(page*pageSize,page*pageSize+pageSize);
  const pages=Math.ceil(filtered.length/pageSize);
  const toast = useToast();

  const del= async(j)=>{
    const domain=new URL(j.url).hostname;
    const res=await Swal.fire({title:`Delete ${domain}?`,showCancelButton:true,icon:'warning'});
    if(!res.isConfirmed) return;
    await api.request('/scrape/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain})});
    refreshJobs();
    toast(`${domain} deleted`);
  };

  return (
    <>
    <input placeholder="search id" value={q} onChange={e=>{setQ(e.target.value);setPage(0);}} />
    <table style={{width:'100%',borderCollapse:'collapse',marginTop:8}}>
      <thead><tr><th>ID</th><th>Status</th><th>Created</th><th>Domain</th><th>Actions</th></tr></thead>
      <tbody>
        {slice.map(j=> (
          <tr key={j.id}><td>{j.id.slice(0,8)}</td><td>{j.status}</td><td>{j.started_at?.slice(0,19).replace('T',' ')}</td><td>{new URL(j.url).hostname}</td><td><button onClick={()=>del(j)}>🗑️</button></td></tr>
        ))}
      </tbody>
    </table>
    <div style={{marginTop:8}}>
      <button disabled={page===0} onClick={()=>setPage(p=>p-1)}>Prev</button>
      <span style={{margin:'0 8px'}}>{page+1}/{pages||1}</span>
      <button disabled={page+1>=pages} onClick={()=>setPage(p=>p+1)}>Next</button>
    </div>
    </>
  );
}

function Inner(){
  const tabs=[
    {id:'analytics',label:'Analytics',content:<Analytics/>},
    {id:'scraper',label:'Scraper',content:<ScraperTab/>},
    {id:'history',label:'History',content:<HistoryTab/>},
    {id:'logs',label:'Logs',content:<Logs/>},
    {id:'settings',label:'Settings',content:<Settings/>},
  ];
  return (
    <div style={{padding:'16px'}}>
      <h2>Data Scraper</h2>
      <Tabs tabs={tabs}/>
    </div>
  );
}

export default function Scraper(){
  return (
    <ToastProvider>
      <ScraperProvider>
        <Inner />
      </ScraperProvider>
    </ToastProvider>
  );
}
