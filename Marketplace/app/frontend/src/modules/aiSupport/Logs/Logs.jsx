import React,{useState,useEffect} from 'react';
import './logs.css';
import Table from '../../../components/common/Table/Table';
import Badge from '../../../components/common/Badge/Badge';
import api from '../../../utils/api';
import Spinner from '../../../components/common/Spinner/Spinner';

function Logs(){
 const [logs,setLogs]=useState([]);
 const [loading,setLoading]=useState(true);
 const [tab,setTab]=useState('all');
 const [page,setPage]=useState(1);
 const rowsPerPage=50;
 useEffect(()=>{api.getLogs().then(d=>{setLogs(d);setLoading(false);});},[]);
 const filtered=tab==='all'?logs:logs.filter(l=>l.level===tab || (tab==='warn' && l.level==='warning'));
 const totalPages=Math.max(1,Math.ceil(filtered.length/rowsPerPage));
 const pageData=filtered.slice((page-1)*rowsPerPage,page*rowsPerPage);
 const columns=[
  {key:'time',label:'Time',width:'180px'},
  {key:'level',label:'Level',width:'120px',render:(v)=> <Badge type={v}/>},
  {key:'request_id',label:'Req Id',width:'140px'},
  {key:'message',label:'Message'},
 ];

const levelTabs=['all','info','warn','error'];

 return (
  <div className='logs-wrapper'>
   <h2>Logs</h2>
   <div style={{display:'flex',gap:'16px',marginBottom:'12px'}}>
    {levelTabs.map(t=> (
      <button key={t} onClick={()=>setTab(t)} style={{padding:'6px 12px',border:'none',background:tab===t?'var(--greyd-primary-color)':'var(--greyd-bg-light)',color:tab===t?'#fff':'var(--greyd-text-dark)',borderRadius:'6px',cursor:'pointer'}}>{t.toUpperCase()}</button>
    ))}
   </div>
   {loading? <Spinner/> : <>
  <Table columns={columns} data={pageData} zebra={false}/>
  <div style={{marginTop:'12px',display:'flex',gap:'8px',alignItems:'center'}}>
    <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
    <span>{page}/{totalPages}</span>
    <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
  </div>
  </>} 
  </div>
 );
}
export default Logs;
