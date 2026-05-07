import React,{useState,useEffect} from 'react';
import Table from '../../components/common/Table/Table';
import Switch from '../../components/common/Switch/Switch';
import api from '../../utils/api';
import Spinner from '../../components/common/Spinner/Spinner';

function Roles(){
 const [perms,setPerms]=useState([]);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{api.getPermissions().then(d=>{setPerms(d);setLoading(false);});},[]);
 const toggle=(role,index)=>{
   setPerms(prev=> prev.map((p,i)=> i===index? {...p,[role]:!p[role]}:p));
 };
 const columns=[
  {key:'perm',label:'Permission'},
  {key:'superAdmin',label:'Super Admin',width:'140px',render:(v,_,idx)=>(<Switch checked={v} onChange={()=>toggle('superAdmin',idx)} />)},
  {key:'editor',label:'Editor',width:'120px',render:(v,_,idx)=>(<Switch checked={v} onChange={()=>toggle('editor',idx)} />)},
  {key:'viewer',label:'Viewer',width:'120px',render:(v,_,idx)=>(<Switch checked={v} onChange={()=>toggle('viewer',idx)} />)},
 ];
 return (
  <div>
   <h3>Roles & Rights</h3>
   {loading? <Spinner/> : <Table columns={columns} data={perms} />}
  </div>
 );
}
export default Roles;
