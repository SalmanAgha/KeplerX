import React,{useState,useEffect} from 'react';
import { FaBell } from 'react-icons/fa';
import styles from './NotificationBell.module.css';
import NotificationPanel from './NotificationPanel';
import api from '../../../utils/api';

function NotificationBell(){
 const [items,setItems]=useState([]);
 const [open,setOpen]=useState(false);
 useEffect(()=>{api.getNotifications().then(setItems);},[]);
 const handleClear=()=>setItems([]);
 return (
  <div className={styles.bell} onClick={()=>setOpen(o=>!o)}>
    <FaBell />
    {items.length>0 && <span className={styles.badge}>{items.length}</span>}
    {open && <NotificationPanel items={items} onClear={handleClear} />}
  </div>
 );
}
export default NotificationBell;
