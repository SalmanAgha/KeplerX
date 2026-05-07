import React,{useState,useEffect} from 'react';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

function AdminModal({ open, onClose, mode='create', initialData={}, onSave }) {
  const [form,setForm]=useState({name:'',email:'',role:'Viewer',password:''});
  const roles=['Super Admin','Editor','Viewer'];
  useEffect(()=>{if(open){setForm({...initialData,password:''});}},[open,initialData]);
  const handleChange=e=>setForm({...form,[e.target.name]:e.target.value});
  const handleSubmit=e=>{e.preventDefault(); if(!form.name||!form.email){return;}; onSave(form); onClose();};
  return (
    <Modal open={open} onClose={onClose}>
      <h3 style={{marginTop:0}}>{mode==='create'?'Add':'Edit'} Admin</h3>
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'14px',minWidth:'300px'}}>
        <Input placeholder="Name" name="name" value={form.name} onChange={handleChange} />
        <Input placeholder="Email" name="email" value={form.email} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange} style={{padding:'8px',borderRadius:'6px'}}>
          {roles.map(r=> <option key={r}>{r}</option>)}
        </select>
        <Input placeholder="Password" name="password" type="password" value={form.password} onChange={handleChange} />
        <div style={{display:'flex',justifyContent:'flex-end',gap:'12px'}}>
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
export default AdminModal;
