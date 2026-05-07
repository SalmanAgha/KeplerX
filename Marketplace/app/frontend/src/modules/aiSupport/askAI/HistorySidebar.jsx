import React from 'react';
import { useChat } from '../../../context/ChatContext';
import { createConversation } from '../../../utils/api';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Button from '../../../components/common/Button/Button';

function HistorySidebar({ className='' }) {
  const { chats, activeChatId, newChat, setActiveChat, deleteChat, renameChat } = useChat();

  const handleNewChat = async () => {
    try {
      const user_info = JSON.parse(localStorage.getItem('user_info')||'{}');
      const uname = user_info.username || user_info.email || user_info.name;
      const convId = await createConversation(uname);
      const chatId = newChat(convId); // modify reducer to return id? we can't
      // After dispatch, newest chat is at end
      renameChat(Date.now(), convId);
    } catch (e) {
      console.error('Failed to create conversation', e);
      newChat(); // fallback local new chat without convId
    }
  };
  return (
    <aside className={`chat-history-sidebar ${className}`.trim()} style={{  padding: '16px', borderLeft: '1px solid #e5e7eb', height: '100%' }}>
      <Button variant="secondary" style={{marginBottom:'12px',width:'100%',background:'#303030',color:'#fff'}} onClick={handleNewChat}>New Chat</Button>
      {chats.length === 0 && <p style={{ fontSize: '0.9rem', color: '#555' }}>No history yet</p>}
      {chats.map(chat => (
        <div
          key={chat.id}
          style={{
            display:'flex',alignItems:'center',justifyContent:'space-between',
            padding: '8px',
            marginBottom: '6px',
            cursor: 'pointer',
            background: chat.id === activeChatId ? '#303030' : 'transparent',
            borderRadius: '6px',
            fontSize: '0.9rem'
          }}
        >
          <span onClick={() => setActiveChat(chat.id)} style={{flex:1}}>{chat.title || 'Untitled'}</span>
          <span style={{display:'flex',gap:'6px'}}>
            <FaEdit style={{cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(); Swal.fire({title:'Rename chat',input:'text',inputValue:chat.title,showCancelButton:true,confirmButtonColor:'#dfb600'}).then(res=>{if(res.isConfirmed){renameChat(chat.id,res.value||'Untitled');}});}} />
            <FaTrash style={{cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(); Swal.fire({title:'Delete chat?',icon:'warning',showCancelButton:true,confirmButtonColor:'#dfb600'}).then(res=>{if(res.isConfirmed){deleteChat(chat.id);}});}} />
          </span>
        </div>
      ))}
    </aside>
  );
}

export default HistorySidebar;
