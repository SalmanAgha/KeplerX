import React, { useState, useEffect, useRef } from 'react';
import './askAI.css';
import { Container } from '../../../components/common';
import Button from '../../../components/common/Button/Button';
import { useChat } from '../../../context/ChatContext';
import { ask, submitRemark, createConversation } from '../../../utils/api';
import { listModels } from '../../../api/models';
import HistorySidebar from './HistorySidebar';
import Spinner from '../../../components/common/Spinner/Spinner';
import ReactMarkdown from 'react-markdown';
import { getTicketIds, fetchTicketData } from '../../../api/tickets';
import Drawer from '../../../components/common/Drawer/Drawer';

// Resizable modal component
function InformationModal({ sections, onClose, tokensTotal, activeChat }){
  const [width,setWidth]=useState(600);
  const [dragging,setDragging]=useState(false);
  useEffect(()=>{
    const onMove=e=>{if(dragging){
      const newW = Math.max(300, Math.min(window.innerWidth-100, e.clientX));
      setWidth(newW);
    }};
    const onUp=()=>setDragging(false);
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);
    return ()=>{window.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp);}    
  },[dragging]);

  const renderSection=(section)=>{
    switch(section){
      case 'Tokens':
        return (
          <div className="info-card" key={section}>
            <h4>Tokens</h4>
            <div className="token-stat"><span className="label">Total</span><span className="value">{tokensTotal}</span></div>
            <div className="token-stat"><span className="label">Question</span><span className="value">{activeChat?.q_total||0}</span></div>
            <div className="token-stat"><span className="label">Answer</span><span className="value">{activeChat?.a_total||0}</span></div>
          </div>
        );
      case 'Help Scout':
        return (
          <div className="info-card" key={section}>
            <h4>Help Scout</h4>
            <div className="token-stat"><span className="label">Customer Info</span><span className="value">-</span></div>
            <div className="token-stat"><span className="label">Ticket History</span><span className="value">-</span></div>
            <div className="token-stat"><span className="label">Open Tickets</span><span className="value">-</span></div>
          </div>
        );
      default:
        return (<div className="info-card" key={section}><h4>{section}</h4><p>No data yet</p></div>);
    }
  };

  return (
    <div className="modal-overlay left">
      <div className="modal-container" style={{width}}>
        <header className="modal-header">
          <h3>Information Modal</h3>
          <button onClick={onClose}>×</button>
        </header>
        <div className="modal-body">
          {sections.map(renderSection)}
        </div>
        <div className="resize-handle" onMouseDown={()=>setDragging(true)} />
      </div>
    </div>
  );
}

// Accordion card component
function WidgetCard({ title, defaultOpen=false, children, hideToggle=false, addText=false, addLabel='Add to modal', onAdd }){
  const [open,setOpen]=useState(defaultOpen);
  return (
    <div className="widget-card">
      <div className="widget-card-header" onClick={()=>!hideToggle && setOpen(o=>!o)}>
        <span>{title}</span>
        {addText && <span className="add-remove-link" onClick={(e)=>{e.stopPropagation();onAdd&&onAdd();}}>{addLabel}</span>}
        {!hideToggle && <button className="widget-toggle-btn">{open? '−':'+'}</button>}
      </div>
      {(open || hideToggle) && <div className="widget-card-content">{children}</div>}
    </div>
  );
}

function AskAI() {
  const { activeChat, sendMessage, setConvId, updateChatMeta, appendAssistantChunk } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const [loading,setLoading]=useState(false);
  const ctrlRef = useRef(null);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  // helper to get delta tokens

  // scroll to bottom on new message
  useEffect(()=>{ if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:'smooth'}); },[activeChat?.messages]);

  const [image, setImage] = useState(null);
  const [models, setModels] = useState([]);
  const [purpose,setPurpose]=useState('general');
  const LOCAL_KEY = 'greyd-selected-model';
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem(LOCAL_KEY) || '');

  useEffect(() => {
    listModels().then(ms=>{
      setModels(ms);
      if(!selectedModel && ms.length){
        const active=ms.find(m=>m.active) || ms[0];
        setSelectedModel(active.name);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, selectedModel || '');
  }, [selectedModel]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!input.trim() && !image) return;
    const userMsg = input.trim();
    setInput('');

    try{
      if(ctrlRef.current) ctrlRef.current.abort();
      const ctrl = new AbortController();
      ctrlRef.current = ctrl;
      setLoading(true);

      sendMessage('user', userMsg + (image ? ' [image attached]' : ''), 0);
      const { answer, convId: newId } = await ask(userMsg, activeChat?.convId, image, ctrl.signal, selectedModel,purpose);

      sendMessage('ai', answer ?? '', 0);

      if (newId && !activeChat.convId) setConvId(activeChat.id, newId);
       
    }catch(err){
      console.error(err);
      sendMessage('user', userMsg, 0);
      sendMessage('ai', 'Sorry, I could not reach the server. Please try again later.', 0);
    } finally {
      ctrlRef.current = null;
      setLoading(false);
    }
    setImage(null);
  };

  const [showFeedback,setShowFeedback]=useState(false);
  const [intentDetection,setIntentDetection]=useState(false);
  const [rating,setRating]=useState(5);
  const [remark,setRemark]=useState('');
  const chars = remark.length;
  const tokensTotal = (activeChat?.q_total||0) + (activeChat?.a_total||0);

  const handleSubmitRemark=async()=>{
    const cid = activeChat?.convId || localStorage.getItem('conv_id');
    if(!cid){ alert('Conversation not initialised yet. Send a message first.'); return; }
    try{
      await submitRemark(cid, rating, remark);
      setRemark('');
      alert('Thank you for your feedback!');
    }catch(err){
      if(err.message.includes('Comment exceeds')) alert(err.message);
      else alert('Failed to submit feedback');
    }  };

  const [modalOpen,setModalOpen]=useState(false);
  const [modalSections,setModalSections]=useState([]);

  const openInfoModal=()=>setModalOpen(true);
  const closeInfoModal=()=>setModalOpen(false);

  const toggleSection = section => {
    setModalSections(prev => {
      const exists = prev.includes(section);
      const updated = exists ? prev.filter(s => s !== section) : [...prev, section];
      return updated;
    });
    openInfoModal();
  };

  // Help-Scout widget state
  const [ticketOptions,setTicketOptions]=useState([]);
  const [ticketId,setTicketId]=useState('');
  const [hsLoading,setHsLoading]=useState(false);
  const [hsSummary,setHsSummary]=useState('');
  const [hsRaw,setHsRaw]=useState(null);
  const [showRaw,setShowRaw]=useState(false);
  const [rawOpen,setRawOpen]=useState(false);
  const hsCache=useRef(new Map());
  useEffect(()=>{(async()=>{try{const opts=await getTicketIds();setTicketOptions(opts);}catch(e){console.error('load ids',e);}})();},[]);

  const handleFetchHs=async()=>{
    if(!ticketId) return;
    // cache check
    if(hsCache.current.has(ticketId)){
      const {summary,raw}=hsCache.current.get(ticketId);
      setHsSummary(summary);setHsRaw(raw);return;
    }
    setHsLoading(true);
    try{
      const { summary, raw } = await fetchTicketData(ticketId);
      hsCache.current.set(ticketId,{summary,raw});
      setHsSummary(summary); setHsRaw(raw);
    }catch(e){console.error(e);setHsSummary('Error fetching summary');setHsRaw(null);}
    finally{setHsLoading(false);}  };

  const handleAskAiFromHs=()=>{
    if(!hsSummary) return;
    setInput(hsSummary);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const startNewChat = async () => {
    try {
      const convId = await createConversation();
      setConvId(activeChat.id, convId);
      localStorage.setItem('conv_id', convId);
      // Clear messages UI for new chat
      activeChat.messages.length = 0;
    } catch (err) {
      console.error('Failed to start new chat', err);
    }
  };

  return (
    <Container>
      <div className="askai-layout">
        <div className="chat-pane">
          <div className="chat-header">
            <div className="chat-header-left">
              <h2>Ask Greyden</h2>
              <select className="chat-select" value={purpose} onChange={e=>setPurpose(e.target.value)}>
                <option value="general">Purpose: General</option>
                <option value="bug">Debug</option>
                <option value="doc">Documentation</option>
              </select>
              <select className="chat-select" value={selectedModel} onChange={handleModelChange} disabled={loading}> {/* Use Select component */}
                {models.length===0 && <option value="">Loading models...</option>}
                {models.map(model => (
                  <option key={model.id} value={model.name}>
                    Model: {model.name} ({model.provider}) {model.active ? '(Active)' : ''}
                  </option>
                ))}
              </select>
              <button className="history-toggle-btn" onClick={()=>setSidebarOpen(o=>!o)}>&#9776;</button>
            </div>
          </div>
          <div className="chat-window">
        {activeChat?.messages.map((m, idx) => (
          <div key={idx} className={`chat-bubble ${m.role}`}>
            <ReactMarkdown>{m.text}</ReactMarkdown>
          </div>
        ))}
        <div ref={bottomRef}></div>
        {loading && <Spinner className="chat-spinner"/>}
        </div>
        {/* model + input bar */}
        <form onSubmit={handleSubmit} className="chat-input-bar">
          <textarea disabled={loading}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){handleSubmit(e);}}}
            placeholder="Type your question… (Enter to send, Shift+Enter new line)"
          />
          <label className="img-upload-btn">
            📎
            <input type="file" accept="image/*" hidden onChange={e=>{
              const file=e.target.files?.[0];
              if(file){
                const reader=new FileReader();
                reader.onload=ev=>setImage(ev.target.result);
                reader.readAsDataURL(file);
              }
            }} />
          </label>
          <button type="submit" disabled={loading}>Send</button>
        </form>
        {/* Feedback below chat box */}
        {showFeedback ? (
          <div className="chat-feedback feedback-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
              <strong>Feedback</strong>
              <button className="close-feedback-btn" onClick={()=>setShowFeedback(false)}>×</button>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}}>
              <label><input type="checkbox" checked={intentDetection} onChange={e=>setIntentDetection(e.target.checked)} /> Intent Detection</label>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'6px',marginBottom:'6px'}}>
              <span style={{fontSize:'0.85rem'}}>Rate Response:</span>
              <div className="rating-group">
                {[...Array(10)].map((_,i)=>{
                  const val=i+1;
                  return <button type="button" key={val} className={`rating-btn ${rating===val?'active':''}`} onClick={()=>setRating(val)}>{val}</button>;
                })}
              </div>
            </div>
            <textarea value={remark} onChange={e=>setRemark(e.target.value)} placeholder="Your remarks…" style={{width:'100%',height:'60px',resize:'vertical',marginBottom:'4px'}} />
            <div style={{fontSize:'0.75rem',textAlign:'right',color: chars>10000? 'var(--greyd-danger-color)':'var(--greyd-text-muted)'}}>
              {chars}/10000 characters
            </div>
            <button className="open-modal-btn" onClick={handleSubmitRemark} disabled={!rating || chars===0}>Submit Feedback</button>
          </div>
        ) : (
          <button className="give-feedback-btn" onClick={()=>setShowFeedback(true)}>Give Feedback</button>
        )}
        </div>
        {/* widget column */}
        <aside className="widget-column">
          {/* Information Modal trigger card */}
          <WidgetCard title="Information Modal" defaultOpen={false} hideToggle addText addLabel="Open Modal" onAdd={openInfoModal} />

          <WidgetCard key="Tokens" title="Tokens" defaultOpen addText addLabel={modalSections.includes('Tokens')? 'Remove from modal':'Add to modal'} onAdd={()=>toggleSection('Tokens')}>
            <div>
              <div className="token-stat"><span className="label">Total</span><span className="value">{tokensTotal}</span></div>
              <div className="token-stat"><span className="label">Question</span><span className="value">{activeChat?.q_total||0}</span></div>
              <div className="token-stat"><span className="label">Answer</span><span className="value">{activeChat?.a_total||0}</span></div>
            </div>
          </WidgetCard>

          <WidgetCard key="Storyline" title="Storyline" addText addLabel={modalSections.includes('Storyline')? 'Remove from modal':'Add to modal'} onAdd={()=>toggleSection('Storyline')}>
            <p style={{fontSize:'0.85rem',color:'var(--greyd-text-muted)'}}>No data yet</p>
          </WidgetCard>

          <WidgetCard key="HelpScout" title="Help Scout" defaultOpen>
            <div style={{display:'flex',gap:'6px',alignItems:'center',marginBottom:'6px'}}>
              <input list="ticket-ids" value={ticketId} onChange={e=>setTicketId(e.target.value)} placeholder="Conv ID" className="hs-select" />
              <datalist id="ticket-ids">
                {ticketOptions.map(o=> <option key={o.id} value={o.id}>{`${o.id} | ${o.customer??'-'} | ${o.status}`}</option>)}
              </datalist>
              <button className="hs-btn" onClick={handleFetchHs} disabled={hsLoading}>Fetch</button>
            </div>
            {hsLoading && <p>Loading…</p>}
            {hsSummary && !hsLoading && (
              <>
                <h4 style={{margin:'6px 0'}}>Summary</h4>
                <p style={{whiteSpace:'pre-wrap',maxHeight:'150px',overflowY:'auto'}}>{hsSummary}</p>
                <div className="hs-actions">
                  {hsRaw && (
                    <button className="hs-btn" onClick={()=>setRawOpen(true)}>View Raw</button>
                  )}
                  <button className="hs-btn" onClick={handleAskAiFromHs}>Ask AI</button>
                </div>
              </>
            )}
          </WidgetCard>
          <Drawer open={rawOpen} onClose={()=>setRawOpen(false)} title={`Ticket #${ticketId} Raw JSON`}>
            {hsRaw && <pre className="ticket-json-display">{JSON.stringify(hsRaw,null,2)}</pre>}
          </Drawer>

          {['HubSpot','Jira','AI Response'].map(t=> (
            <WidgetCard key={t} title={t} addText addLabel={modalSections.includes(t)? 'Remove from modal':'Add to modal'} onAdd={()=>toggleSection(t)}>
              <p style={{fontSize:'0.85rem',color:'var(--greyd-text-muted)'}}>No data yet</p>
            </WidgetCard>
          ))}
        </aside>
        {modalOpen && <InformationModal sections={modalSections} onClose={closeInfoModal} tokensTotal={tokensTotal} activeChat={activeChat} />}
      </div>
      <HistorySidebar className={sidebarOpen? 'open':''} />
    </Container>
  );
}

export default AskAI;
