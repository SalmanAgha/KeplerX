import React,{useState,useEffect} from 'react';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import Spinner from '../../components/common/Spinner/Spinner';

function Profile(){
 const [loading,setLoading]=useState(true);
 const [form,setForm]=useState({name:'',email:'',password:'',avatar:''});
 useEffect(()=>{ // mock current admin
   setTimeout(()=>{setForm({name:'Alice Johnson',email:'alice@greyd.io',password:'',avatar:'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120'});setLoading(false);},300);
 },[]);
 const handleChange=e=>setForm({...form,[e.target.name]:e.target.value});
 const handleAvatar=e=>{
   const file=e.target.files[0];
   if(file){
     const url=URL.createObjectURL(file);
     setForm({...form,avatar:url});
   }
 };
 const handleSubmit=e=>{e.preventDefault();Swal.fire({title:'Profile Saved',icon:'success'});};
 if(loading)return <Spinner/>;
 return (
  <div style={{maxWidth:'500px'}}>
   <h3>Admin Profile</h3>
   <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
     <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
       <img src={form.avatar} alt="avatar" style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',background:'#ccc'}} />
       <input type="file" accept="image/*" onChange={handleAvatar} />
     </div>
     <input name="name" placeholder="Name" style={{padding:'10px',borderRadius:'6px',border:'1px solid #999',width:'100%',height:'44px'}} value={form.name} onChange={handleChange} />
     <input name="email" placeholder="Email" style={{padding:'10px',borderRadius:'6px',border:'1px solid #999',width:'100%',height:'44px'}} value={form.email} onChange={handleChange} />
     <input type="password" name="password" placeholder="New Password" style={{padding:'10px',borderRadius:'6px',border:'1px solid #999',width:'100%',height:'44px'}} value={form.password} onChange={handleChange} />
     <Button type="submit">Save</Button>
   </form>
  </div>
 );
}
export default Profile;
