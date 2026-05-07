import React, { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, ttl = 3000) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ttl);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{position:'fixed',top:16,right:16,zIndex:1000}}>
        {toasts.map(t => (
          <div key={t.id} style={{marginBottom:8,padding:'8px 12px',background:'#333',color:'#fff',borderRadius:4}}>{t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if(!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx.addToast;
};
