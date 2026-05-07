import React,{useState,useEffect} from 'react';
import Table from '../../components/common/Table/Table';
import Button from '../../components/common/Button/Button';
import { fetchAdmins, deleteAdmin } from '../../utils/api';
import Swal from 'sweetalert2';
import Spinner from '../../components/common/Spinner/Spinner';

function AdminList(){
 const [admins,setAdmins]=useState([]);
 const [loading,setLoading]=useState(true);
 
 useEffect(()=>{
   const token = localStorage.getItem('jwt');
   if (!token) return;
   fetchAdmins(token)
     .then(d=>{setAdmins(d);})
     .catch(err=>{Swal.fire({title:'Error',text:err.message,icon:'error'});})
     .finally(()=>setLoading(false));
 },[]);

 // creation handled in Create Admin tab
 const handleEdit=()=>{};
 const handleDelete=(admin)=>{
   Swal.fire({title:`Delete ${admin.name}?`,icon:'warning',showCancelButton:true,confirmButtonColor:'#dc2626'}).then(async res=>{
     if(res.isConfirmed){
       try{
         const token=localStorage.getItem('jwt');
         await deleteAdmin(admin.id,token);
         setAdmins(prev=> prev.filter(a=>a.id!==admin.id));
         Swal.fire({title:'Deleted',icon:'success',timer:800,showConfirmButton:false});
       }catch(err){Swal.fire({title:'Error',text:err.message,icon:'error'});}
     }
   });
 };
 const columns=[
  {key:'id',label:'ID',width:'60px'},
  {key:'name',label:'Name'},
  {key:'email',label:'Email'},
  {key:'role',label:'Role',width:'140px'},
  {key:'actions',label:'Actions',width:'120px',render:(_,row)=>(
    <div style={{display:'flex',gap:'8px'}}>
      <Button variant="danger" style={{padding:'4px 8px'}} onClick={()=>handleDelete(row)}>Delete</Button>
    </div>
  )},
 ];

 return (
  <div>
   <h3 style={{marginBottom:'16px'}}>Admin List</h3>
   {loading? <Spinner/> : <Table columns={columns} data={admins} />}
  </div>
 );
}
export default AdminList;
