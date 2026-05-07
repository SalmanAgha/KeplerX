import React,{useState} from 'react';
import Button from '../../components/common/Button/Button';
import { register as registerAdmin } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function CreateAdmin(){
 const [form,setForm]=useState({name:'',email:'',password:'',role:'admin'});
 const navigate = useNavigate();
 const roles=['admin','user'];
 const handleChange=e=>setForm({...form,[e.target.name]:e.target.value});
 const handleSubmit=async e=>{
   e.preventDefault();
   try {
     await registerAdmin({
       name: form.name,
       email: form.email,
       password: form.password,
       role: form.role
     });
     Swal.fire({title:'Admin created',icon:'success'}).then(()=>{
       navigate('/admin-management/list');
     });
   } catch(err){
     Swal.fire({title:'Error',text:err.message||'Failed',icon:'error'});
   }
 };
 const inputStyle={padding:'10px',borderRadius:'6px',border:'1px solid #999',background:'#fff',width:'100%',height:'44px',fontSize:'1rem',display:'block',boxSizing:'border-box'};
 return (
  <div style={{maxWidth:'420px'}}>
   <h3>Create Admin</h3>
   <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'20px'}}>
     <div>
       <label>Name</label>
       <input name="name" placeholder="Name" style={inputStyle} value={form.name} onChange={handleChange} />
     </div>
     <div>
       <label>Email</label>
       <input name="email" placeholder="Email" style={inputStyle} value={form.email} onChange={handleChange} />
     </div>
     <div>
       <label>Password</label>
       <input type="password" name="password" placeholder="Password" style={inputStyle} value={form.password} onChange={handleChange} />
     </div>
     <div>
       <label>Role</label>
       <select name="role" style={inputStyle} value={form.role} onChange={handleChange}>
         {roles.map(r=> <option key={r}>{r}</option>)}
       </select>
     </div>
     <Button type="submit">Create</Button>
   </form>
  </div>
 );
}
export default CreateAdmin;
