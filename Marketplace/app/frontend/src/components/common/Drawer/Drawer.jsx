import React from 'react';
import './Drawer.css';

function Drawer({ open, onClose, children }){
  if(!open) return null;
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={e=>e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose}>×</button>
        <div className="drawer-content">{children}</div>
      </div>
    </div>
  );
}
export default Drawer;
