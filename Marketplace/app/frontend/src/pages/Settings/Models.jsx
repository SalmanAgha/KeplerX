import React, { useEffect, useState } from 'react';
import './Models.css';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import Swal from 'sweetalert2';
import {
  listModels,
  createModel,
  updateModel,
  deleteModel,
  setActiveModel,
} from '../../api/models';

function Models() {
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', provider: '', active:false });

  const refresh = () => listModels().then(setModels);
  useEffect(() => { refresh(); }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const payload = { name: form.name, provider: form.provider, active: form.active };
    const fn = form.id ? updateModel(form.id, payload) : createModel(payload);
    fn
      .then(()=>{
        Swal.fire({icon:'success',title:form.id?'Model updated':'Model created',timer:1500,showConfirmButton:false});
      })
      .then(refresh)
      .catch(err=>{
        Swal.fire('Error',err.message||'Operation failed','error');
      })
      .finally(()=>{
        setForm({ id:null, name:'', provider:'', active:false });
        setShowForm(false);
      });
  };
  const startEdit = m => { setForm(m); setShowForm(true);} ;
  const remove = id => {
    Swal.fire({title:'Delete model?',icon:'question',showCancelButton:true,confirmButtonText:'Delete'}).then(res=>{
      if(!res.isConfirmed) return;
      deleteModel(id)
        .then(()=>{
          Swal.fire({icon:'success',title:'Deleted',timer:1200,showConfirmButton:false});
          refresh();
        })
        .catch(err=> Swal.fire('Error',err.message,'error'));
    });
  };

  const activate = id => setActiveModel(id)
      .then(()=>{Swal.fire({icon:'success',title:'Set active',timer:1200,showConfirmButton:false});refresh();})
      .catch(err=>Swal.fire('Error',err.message,'error'));

  const [showForm,setShowForm]=useState(false);

  return (
    <div className="models-page-container">
      <div className="models-header">
        <h2>AI Models</h2>
        <Button variant="primary" onClick={()=>setShowForm(true)}>Add Model</Button>
      </div>

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setForm({ id: null, name: '', provider: '', active:false });
        }}
        title={form.id ? 'Edit Model' : 'Add Model'}
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowForm(false);
              setForm({ id: null, name: '', provider: '', active:false });
            }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>{form.id ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="form-group">
          <label className="field-label" htmlFor="model-name">Model Name</label>
          <input
            id="model-name"
            placeholder="e.g. gpt-4o"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="field-label" htmlFor="model-provider">Provider</label>
          <input
            id="model-provider"
            placeholder="e.g. openai"
            value={form.provider}
            onChange={e => setForm({ ...form, provider: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="field-label" htmlFor="model-active">Status</label>
          <select
            id="model-active"
            value={form.active ? 'active' : 'inactive'}
            onChange={e=>setForm({...form, active:e.target.value==='active'})}
            style={{flex:1,height:'38px',border:'1px solid var(--greyd-border-color)',borderRadius:'6px',padding:'0 8px'}}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Modal>

      <div className="models-list card">
        <table>
          <thead><tr><th>Name</th><th>Provider</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {models.map(m=>(
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.provider}</td>
                <td>{m.active ? '✓' : ''}</td>
                <td>
                  <Button variant="secondary" onClick={()=>startEdit(m)}>Edit</Button>
                  <Button variant="danger" onClick={()=>remove(m.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Models;
