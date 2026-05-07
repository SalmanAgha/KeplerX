import React, { useEffect, useRef, useState } from 'react';
import { useScraper } from '../../context/ScraperContext';

const API_BASE = process.env.REACT_APP_SCRAPER_API || 'http://localhost:9000';

export default function Logs(){
  const { jobs } = useScraper();
  const [jobId,setJobId]=useState(jobs[0]?.job_id||'');
  const [lines,setLines]=useState([]);
  const wsRef = useRef(null);
  const boxRef=useRef(null);

  useEffect(()=>{
    if(!jobId) return;
    const wsUrl = API_BASE.replace(/^http/,'ws')+`/scrape/${jobId}/stream`;
    const ws = new WebSocket(wsUrl);
    wsRef.current=ws;
    ws.onmessage = (e)=>{
      setLines(prev=>[...prev, e.data]);
    };
    return ()=> ws.close();
  },[jobId]);

  useEffect(()=>{
    if(boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  },[lines]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'80vh'}}>
      <select value={jobId} onChange={e=>{setLines([]);setJobId(e.target.value);}}>
        {jobs.map(j=> <option key={j.job_id} value={j.job_id}>{j.job_id.slice(0,8)}… ({j.status})</option>)}
      </select>
      <pre ref={boxRef} style={{flex:1,overflowY:'auto',background:'#000',color:'#0f0',padding:8,marginTop:8}}>
        {lines.join('\n')}
      </pre>
    </div>
  );
}
