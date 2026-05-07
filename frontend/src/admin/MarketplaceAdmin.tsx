import React, { useState, useEffect } from 'react';

interface Project {
  slug: string;
  title: string;
  category: string;
  industry: string;
  description: string;
  metrics: Array<{label: string, value: string}>;
  implementationTime: string;
  icon: string;
  color: string;
  features: string[];
  integrations: string[];
}

const initialFormState: Project = {
  slug: '',
  title: '',
  category: '',
  industry: '',
  description: '',
  metrics: [{label: '', value: ''}],
  implementationTime: '',
  icon: 'FaRobot',
  color: '#06b6d4',
  features: [''],
  integrations: ['']
};

const MarketplaceAdmin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>(initialFormState);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/marketplace');
      const data = await res.json();
      // Ensure JSON strings are parsed
      const parsedData = data.map((d: any) => ({
        ...d,
        metrics: typeof d.metrics === 'string' ? JSON.parse(d.metrics) : (d.metrics || []),
        features: typeof d.features === 'string' ? JSON.parse(d.features) : (d.features || []),
        integrations: typeof d.integrations === 'string' ? JSON.parse(d.integrations) : (d.integrations || [])
      }));
      setProjects(parsedData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch marketplace projects:', err);
      setLoading(false);
    }
  };

  const handleOpenForm = (project?: Project) => {
    if (project) {
      setEditingSlug(project.slug);
      setFormData({ ...project });
    } else {
      setEditingSlug(null);
      setFormData({ ...initialFormState });
    }
    setIsFormOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await fetch(`/api/marketplace/${slug}`, { method: 'DELETE' });
      fetchProjects();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: 'features' | 'integrations', index: number, value: string) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArr }));
  };

  const handleMetricChange = (index: number, key: 'label' | 'value', value: string) => {
    const newMetrics = [...formData.metrics];
    newMetrics[index] = { ...newMetrics[index], [key]: value };
    setFormData(prev => ({ ...prev, metrics: newMetrics }));
  };

  const addArrayItem = (field: 'features' | 'integrations') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };
  
  const removeArrayItem = (field: 'features' | 'integrations', index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const addMetric = () => {
    setFormData(prev => ({ ...prev, metrics: [...prev.metrics, {label: '', value: ''}] }));
  };
  const removeMetric = (index: number) => {
    setFormData(prev => ({ ...prev, metrics: prev.metrics.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSlug ? `/api/marketplace/${editingSlug}` : '/api/marketplace';
      const method = editingSlug ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        slug: editingSlug ? editingSlug : formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsFormOpen(false);
        fetchProjects();
      } else {
        alert('Failed to save project');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save project');
    }
  };

  return (
    <div className="marketplace-admin" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Marketplace AI Projects</h2>
        <button onClick={() => handleOpenForm()} className="add-portfolio-btn">
          <i className="fas fa-plus"></i> Add New Project
        </button>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {projects.map(p => (
            <div key={p.slug} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: `${p.color}20`, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fas ${p.icon.replace('Fa', 'fa-').toLowerCase()}`}></i>
                </div>
                <h3 style={{ fontSize: '16px', margin: 0 }}>{p.title}</h3>
              </div>
              <p style={{ color: '#666', fontSize: '12px', margin: '4px 0' }}>{p.category} &bull; {p.industry}</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button onClick={() => handleOpenForm(p)} style={{ flex: 1, padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(p.slug)} style={{ flex: 1, padding: '8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p>No projects found. Seed the database!</p>}
        </div>
      )}

      {/* Slide-out Offcanvas Modal */}
      <div className={`portfolio-offcanvas ${isFormOpen ? 'open' : ''}`} style={{ width: '600px' }}>
        <div className="portfolio-offcanvas-header">
          <h3>{editingSlug ? 'Edit Project' : 'Add New Project'}</h3>
          <button className="close-offcanvas" onClick={() => setIsFormOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="portfolio-offcanvas-body">
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label>Title</label>
              <input type="text" className="admin-form-control" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Category</label>
                <input type="text" className="admin-form-control" name="category" value={formData.category} onChange={handleChange} required />
              </div>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Industry</label>
                <input type="text" className="admin-form-control" name="industry" value={formData.industry} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Theme Color (HEX)</label>
                <input type="text" className="admin-form-control" name="color" value={formData.color} onChange={handleChange} required />
              </div>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Icon Name (e.g. FaRobot)</label>
                <input type="text" className="admin-form-control" name="icon" value={formData.icon} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="admin-form-group">
              <label>Implementation Time</label>
              <input type="text" className="admin-form-control" name="implementationTime" value={formData.implementationTime} onChange={handleChange} />
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea className="admin-form-control" name="description" value={formData.description} onChange={handleChange} rows={3} required></textarea>
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Metrics</span>
                <button type="button" onClick={addMetric} style={{ background: 'none', border: 'none', color: '#045e63', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Metric</button>
              </label>
              {formData.metrics.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" className="admin-form-control" placeholder="Label" value={m.label} onChange={e => handleMetricChange(i, 'label', e.target.value)} style={{ flex: 1 }} />
                  <input type="text" className="admin-form-control" placeholder="Value" value={m.value} onChange={e => handleMetricChange(i, 'value', e.target.value)} style={{ flex: 1 }} />
                  <button type="button" onClick={() => removeMetric(i)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '0 8px' }}><i className="fas fa-trash"></i></button>
                </div>
              ))}
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Features</span>
                <button type="button" onClick={() => addArrayItem('features')} style={{ background: 'none', border: 'none', color: '#045e63', fontWeight: 'bold', cursor: 'pointer' }}>+ Add</button>
              </label>
              {formData.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" className="admin-form-control" value={f} onChange={e => handleArrayChange('features', i, e.target.value)} style={{ flex: 1 }} />
                  <button type="button" onClick={() => removeArrayItem('features', i)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '0 8px' }}><i className="fas fa-trash"></i></button>
                </div>
              ))}
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Integrations</span>
                <button type="button" onClick={() => addArrayItem('integrations')} style={{ background: 'none', border: 'none', color: '#045e63', fontWeight: 'bold', cursor: 'pointer' }}>+ Add</button>
              </label>
              {formData.integrations.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" className="admin-form-control" value={f} onChange={e => handleArrayChange('integrations', i, e.target.value)} style={{ flex: 1 }} />
                  <button type="button" onClick={() => removeArrayItem('integrations', i)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '0 8px' }}><i className="fas fa-trash"></i></button>
                </div>
              ))}
            </div>

            <div className="admin-form-actions" style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-cancel" onClick={() => setIsFormOpen(false)} style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn-submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#045e63', color: '#fff', cursor: 'pointer' }}>Save Project</button>
            </div>
          </form>
        </div>
      </div>

      {isFormOpen && (
        <div className="offcanvas-overlay" onClick={() => setIsFormOpen(false)}></div>
      )}
    </div>
  );
};

export default MarketplaceAdmin;
