import React from 'react';
import Table from '../../components/common/Table/Table';
import { useState } from 'react';
import Drawer from '../../components/common/Drawer/Drawer';
import { getTicketDetails, getTicketSummary, createTicketSummary } from '../../api/tickets';
import { useEffect } from 'react';

function AllTickets({ tickets=[] }){
  const [pageSize,setPageSize] = useState('all');
  const [page,setPage] = useState(1);
  const [search,setSearch] = useState('');
  const [statusFilter,setStatusFilter] = useState('');
  const [dateFrom,setDateFrom] = useState('');
  const [dateTo,setDateTo] = useState('');
  const [sortKey,setSortKey] = useState('created_at');
  const [sortDir,setSortDir] = useState('desc');
  const [selected,setSelected] = useState(null);
  const [details,setDetails] = useState(null);
  const [loadingDetails,setLoadingDetails] = useState(false);
  const [detailsErr,setDetailsErr] = useState('');
  const [summary,setSummary]=useState('');
  const [loadingSummary,setLoadingSummary]=useState(false);
  const [summaryErr,setSummaryErr]=useState('');
  const [summaryMissing,setSummaryMissing]=useState(false);
  const [toast,setToast]=useState('');

  useEffect(()=>{
    if(toast){
      const t=setTimeout(()=>setToast(''),3000);
      return ()=>clearTimeout(t);
    }
  },[toast]);

  const filtered = tickets.filter(t=>{
    const matchSearch = search? (t.customer?.toLowerCase().includes(search.toLowerCase())|| String(t.conv_id).includes(search)) : true;
    const matchStatus = statusFilter? t.status===statusFilter : true;
    const created = new Date(t.created_at);
    const matchFrom = dateFrom? created >= new Date(dateFrom) : true;
    const matchTo   = dateTo?   created <= new Date(dateTo)   : true;
    return matchSearch && matchStatus && matchFrom && matchTo;
  });

  const sorted=[...filtered].sort((a,b)=>{
    if(sortKey==='created_at'||sortKey==='extracted_at'){
      const va=new Date(a[sortKey]); const vb=new Date(b[sortKey]);
      return sortDir==='asc'? va-vb : vb-va;
    }
    if(sortKey==='conv_id'){
      return sortDir==='asc'? a.conv_id-b.conv_id : b.conv_id-a.conv_id;
    }
    const va=(a[sortKey]||'').toString().toLowerCase();
    const vb=(b[sortKey]||'').toString().toLowerCase();
    return sortDir==='asc'? va.localeCompare(vb):vb.localeCompare(va);
  });

  const totalPages = pageSize==='all' ? 1 : Math.max(1,Math.ceil(sorted.length / pageSize));
  const start = pageSize==='all'? 0 : (page-1)*pageSize;
  const pageData = pageSize==='all'? sorted : sorted.slice(start,start+pageSize);

  const exportCsv = () => {
    const rows = [
      ['conv_id','customer','status','created_at','extracted_at'],
      ...filtered.map(t=>[t.conv_id,t.customer,t.status,t.created_at,t.extracted_at])
    ];
    const csv = rows.map(r=> r.map(v=>`"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href=url;
    link.download='tickets.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (tickets.length === 0) return <p>No tickets found.</p>;

  const columns=[
    { key:'conv_id', label:'ID', width:'120px' },
    { key:'customer', label:'Customer' },
    { key:'status', label:'Status', width:'120px', render:v=> <span className={`badge ${v}`}>{v}</span> },
    { key:'created_at', label:'Created', render:v=> new Date(v).toLocaleString() },
    { key:'extracted_at', label:'Extracted', render:v=> new Date(v).toLocaleString() },
    { key:'actions',label:'', width:'140px', render:(_,row)=> (
      <div className="row-actions">
        <button className="table-action" onClick={async ()=>{
          setSelected(row);
          setDetails(null);setDetailsErr('');setLoadingDetails(true);
          try{ const json = await getTicketDetails(row.conv_id); setDetails(json);}catch(e){setDetailsErr(e.message||'Failed');}
          finally{setLoadingDetails(false);} }}>View</button>
        <button className="table-action" onClick={async ()=>{
          setSelected(row);
          setSummary('');setSummaryErr('');setLoadingSummary(true);
          try{
            let res = await getTicketSummary(row.conv_id).catch(err=>{
              if(err.response && err.response.status===404){ setSummaryMissing(true); return null; }
              throw err;});
            if(res){ setSummary(res.summary||JSON.stringify(res)); setSummaryMissing(false);}             
          }catch(e){setSummaryErr(e.message||'Failed');}
          finally{setLoadingSummary(false);}  
        }}>Summary</button>
      </div>
    ) },
  ];

  const handleSort=key=>{
    if(key===sortKey){setSortDir(d=>d==='asc'?'desc':'asc');}
    else{setSortKey(key);setSortDir('asc');}
  };

  return (
    <>
      <div className="tickets-controls">
        <input className="tickets-search" placeholder="Search" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} />
        <label className="date-filter">From <input type="date" value={dateFrom} onChange={e=>{setDateFrom(e.target.value);setPage(1);}} /></label>
        <label className="date-filter">To <input type="date" value={dateTo} onChange={e=>{setDateTo(e.target.value);setPage(1);}} /></label>
        <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}}>
          <option value="">All Status</option>
          <option value="active">active</option>
          <option value="closed">closed</option>
        </select>
        <label className="tickets-page-size">
          Show&nbsp;
          <select value={pageSize} onChange={e=>{const v=e.target.value==='all'?'all':parseInt(e.target.value,10);setPageSize(v);setPage(1);}}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
        </label>
        <button className="tickets-export" onClick={exportCsv}>Export CSV</button>
      </div>
      <Table columns={columns} data={pageData} onSort={handleSort} />
      <div style={{marginTop:'12px',display:'flex',gap:'8px',alignItems:'center'}}>
        <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
        <span style={{marginLeft:'auto'}}>Showing {pageData.length} of {filtered.length}</span>
      </div>
      <Drawer open={!!selected} onClose={()=>{setSelected(null);setDetails(null);}} title={selected?`Ticket #${selected.conv_id}`:''}>
        {loadingDetails && <p>Loading…</p>}
        {detailsErr && <p style={{color:'red'}}>{detailsErr}</p>}
        {loadingSummary && <p>Generating summary…</p>}
        {summaryErr && <p style={{color:'red'}}>{summaryErr}</p>}
        {toast && <div className="toast">{toast}</div>}
        {summary && !loadingSummary && (
          <>
            <h3>Summary</h3>
            <button className="table-action" style={{marginBottom:'8px'}} onClick={async ()=>{
              setLoadingSummary(true);setSummaryErr('');
              try{
                await createTicketSummary(selected.conv_id,{force:true});
                const fresh=await getTicketSummary(selected.conv_id);
                setSummary(fresh.summary);
                setToast('Summary regenerated');
              }catch(e){setSummaryErr(e.message||'Failed');}
              finally{setLoadingSummary(false);}  }}>Regenerate Summary</button>
            <p style={{whiteSpace:'pre-wrap'}}>{summary}</p>
          </>
        )}
        {summaryMissing && !loadingSummary && (
          <button className="table-action" onClick={async ()=>{
            setLoadingSummary(true); setSummaryErr('');
            try{ const res= await createTicketSummary(selected.conv_id,{force:true}); setSummary(res.summary); setSummaryMissing(false);}catch(e){setSummaryErr(e.message||'Failed');}
            finally{setLoadingSummary(false);}  }}>Create Summary</button>
        )}
        {details && !loadingDetails && !loadingSummary && !summary && (
          <pre className="ticket-json-display">{JSON.stringify(details,null,2)}</pre>
        )}
      </Drawer>
    </>
  );
}

export default AllTickets;
