import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ChatContext=createContext();

const STORAGE_KEY='greyd-askai-chats';

const initialState={
  chats:[{id:1,title:'New chat',messages:[],convId:null,q_total:0,a_total:0}],
  activeChatId:1,
};

const loadState=()=>{
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved||initialState;
  }catch(err){
    return initialState;
  }
};

function reducer(state,action){
  switch(action.type){
    case'NEW_CHAT':{
      const id= Date.now();
      const { convId=null } = action;
      if(convId) localStorage.setItem('conv_id', convId); else localStorage.removeItem('conv_id');
      return {...state,chats:[...state.chats,{id,title:convId || 'New chat',messages:[],convId:convId,q_total:0,a_total:0}],activeChatId:id};
    }
    case 'SET_ACTIVE': {
      const chat = state.chats.find(c=>c.id===action.id);
      if (chat) {
        if (chat.convId) localStorage.setItem('conv_id', chat.convId);
        else localStorage.removeItem('conv_id');
      }
      return { ...state, activeChatId: action.id };
    }
    case'SEND':{
      const {role,text,tokens}=action;
      return {
        ...state,
        chats: state.chats.map(c=>
          c.id===state.activeChatId
            ? {...c,messages:[...c.messages,{role,text,tokens}]}
            :c)
      };
    }
    case 'APPEND_CHUNK':{
      return {
        ...state,
        chats: state.chats.map(c=>{
          if(c.id!==state.activeChatId) return c;
          if(c.messages.length===0) return c;
          const last = c.messages[c.messages.length-1];
          if(last.role!=='ai') return c;
          const updated = {...last, text: (last.text||'') + action.text};
          return {...c, messages:[...c.messages.slice(0,-1), updated]};
        })
      };
    }
    case 'DELETE_CHAT':{
      const filtered=state.chats.filter(c=>c.id!==action.id);
      const newActive= filtered.length? filtered[0].id : null;
      return {...state,chats:filtered,activeChatId:newActive};
    }
    case 'RENAME_CHAT':{
      return {...state,chats: state.chats.map(c=> c.id===action.id? {...c,title:action.title}:c)};
    }
    case 'UPDATE_CHAT_META':{
      const { id, convId, q_total, a_total } = action;
      return {
        ...state,
        chats: state.chats.map(c=>
          c.id===id ? { ...c,
            convId: convId ?? c.convId,
            q_total: q_total ?? c.q_total,
            a_total: a_total ?? c.a_total } : c)
      };
    }
    case 'SET_CONV_ID':{
      return {...state,chats: state.chats.map(c=> c.id===action.id? {...c,convId:action.convId}:c)};
    }
    default:return state;
  }
}

export function ChatProvider({children}){
  const [state,dispatch]=useReducer(reducer,loadState());

  useEffect(()=>{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  },[state]);
  const value={
    chats:state.chats,
    activeChatId:state.activeChatId,
    activeChat: state.chats.find(c=>c.id===state.activeChatId),
    newChat:(convId)=>dispatch({type:'NEW_CHAT',convId}),
    setActiveChat:(id)=>dispatch({type:'SET_ACTIVE',id}),
    sendMessage:(role,text,tokens)=>dispatch({type:'SEND',role,text,tokens}),
    deleteChat:(id)=>dispatch({type:'DELETE_CHAT',id}),
    renameChat:(id,title)=>dispatch({type:'RENAME_CHAT',id,title}),
    setConvId:(id,convId)=>dispatch({type:'SET_CONV_ID',id,convId}),
    updateChatMeta:(meta)=>dispatch({type:'UPDATE_CHAT_META',...meta}),
    appendAssistantChunk:(text)=>dispatch({type:'APPEND_CHUNK',text}),
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
export const useChat=()=>useContext(ChatContext);
