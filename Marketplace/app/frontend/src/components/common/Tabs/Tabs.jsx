import React,{useState} from 'react';
import styles from './Tabs.module.css';

function Tabs({tabs,defaultId}){ // tabs=[{id,label,content}]
 const [active,setActive]=useState(defaultId||tabs[0]?.id);
 const activeTab=tabs.find(t=>t.id===active);
 return (
  <div className={styles.wrapper}>
   <div className={styles.bar}>
     {tabs.map(t=> (
       <button key={t.id} onClick={()=>setActive(t.id)} className={`${styles.tab} ${active===t.id?styles.active:''}`}>{t.label}</button>
     ))}
   </div>
   <div className={styles.content}>{activeTab?.content}</div>
  </div>
 );
}
export default Tabs;
