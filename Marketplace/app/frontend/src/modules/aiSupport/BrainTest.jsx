import React,{useState,useRef,useEffect} from 'react';
import { Container, Grid } from '../../components/common';
import ReactMarkdown from 'react-markdown';

function BrainTest(){
 const [msgs,setMsgs]=useState([]);
 const [input,setInput]=useState('');
 const [error,setError]=useState(null);
 const [system,setSystem]=useState('[markdown concise]');
 const bottomRef=useRef(null);
 // RAG answer endpoint – pick same host, port 8002
 const base=`${window.location.protocol}//${window.location.hostname}:8002`;

 useEffect(()=>{ if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:'smooth'});},[msgs]);

 const buildPrompt=()=>{
   // Build a multi-turn prompt by concatenating history
   const history=msgs.map(m=>`${m.role}: ${m.text}`).join('\n');
   return `${system}\n${history}\nuser: ${input.trim()}`;
 };

 const send=async e=>{
   e.preventDefault();
   if(!input.trim()) return;
   const q=input.trim();
   setInput('');
   setError(null);
   setMsgs(m=>[...m,{role:'user',text:q}]);
   try{
     const crafted=buildPrompt();
     const res=await fetch(`${base}/answer?q=${encodeURIComponent(crafted)}&k=5`);
     if(!res.ok) throw new Error(`HTTP ${res.status}`);
     const {answer,sources=[]}=await res.json();
     setMsgs(m=>[...m,{role:'ai',text:answer,sources}]);
   }catch(err){
     console.error(err);
     setError('Something went wrong. Please try again.');
   }
 };

 const clearChat=()=>{
   setMsgs([]);
   setError(null);
 };

 return (
  <Container>
    <Grid cols={1} lg={4}>
      <div className="chat-pane" style={{gridColumn:'span 4'}}>
        <div className="chat-header"><h2>Brain Test</h2>
          <button onClick={clearChat} style={{marginLeft:'auto'}}>Clear</button>
        </div>
        {error && <div className="chat-error">{error}</div>}
        <div className="chat-window">
          {msgs.map((m,i)=>(
            <div key={i} className={`chat-bubble ${m.role}`}>
              <ReactMarkdown>{m.text}</ReactMarkdown>
              {m.role==='ai' && m.sources?.length>0 && (
                <div className="source-tiles" style={{marginTop:'8px',display:'flex',gap:'6px',flexWrap:'wrap'}}>
                  {m.sources.map((s,idx)=>(
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display:'inline-block',
                        padding:'6px 10px',
                        background:'var(--greyd-gradient-banner)',
                        opacity:0.75,
                        borderRadius:'20px',
                        fontSize:'0.8rem',
                        color:'#1d4ed8',
                        textDecoration:'none'
                      }}
                    >
                      {s.display || `Source ${idx+1}`}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>
        <form onSubmit={send} className="chat-input-bar">
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Prompt…" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey) send(e);}} />
          <button type="submit">Send</button>
        </form>
      </div>
    </Grid>
  </Container>
 );
}
export default BrainTest;
