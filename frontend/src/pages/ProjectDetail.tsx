import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaHeartbeat, FaDollarSign, FaBriefcase, FaGraduationCap, 
  FaShoppingCart, FaChartLine, FaIndustry, FaRobot, FaCheckCircle, FaArrowLeft,
  FaBoxes, FaShoppingBag
} from 'react-icons/fa';
import './ProjectDetail.css';

const iconMap: { [key: string]: any } = {
  FaHeartbeat, FaDollarSign, FaBriefcase, FaGraduationCap, FaShoppingCart, FaChartLine, FaIndustry, FaRobot, FaBoxes, FaShoppingBag
};

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/marketplace/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch project details:', err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="pd-loading">
        <span className="btn-spinner" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent', width: 40, height: 40 }}></span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="pd-error">
        <h2>Project Not Found</h2>
        <button className="btn-primary" onClick={() => navigate('/marketplace')}>Back to Marketplace</button>
      </div>
    );
  }

  const IconComponent = iconMap[project.icon] || FaRobot;
  const metrics = typeof project.metrics === 'string' ? JSON.parse(project.metrics) : (project.metrics || []);
  const features = typeof project.features === 'string' ? JSON.parse(project.features) : (project.features || []);
  const integrations = typeof project.integrations === 'string' ? JSON.parse(project.integrations) : (project.integrations || []);

  return (
    <main className="project-detail-page">
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="pd-hero">
        <div className="pd-hero-bg">
          <div className="pd-orb pd-orb-1" style={{ background: project.color }}></div>
          <div className="pd-orb pd-orb-2" style={{ background: project.color }}></div>
          <div className="pd-grid"></div>
        </div>
        
        <div className="container">
          <button 
            onClick={() => navigate('/marketplace')} 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '40px', fontSize: '14px', fontWeight: 600 }}
          >
            <FaArrowLeft size={12} /> Back to Marketplace
          </button>

          <div className="pd-header">
            <div className="pd-icon-wrap" style={{ backgroundColor: `${project.color}20`, color: project.color }}>
              <IconComponent size={40} />
            </div>
            <div className="section-tag" style={{ color: project.color, borderColor: `${project.color}40`, background: `${project.color}10` }}>
              <span className="dot" style={{ background: project.color }}></span>
              {project.category}
            </div>
            <h1 className="pd-title">{project.title}</h1>
            <p className="pd-description">{project.description}</p>
          </div>
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────────── */}
      <section className="pd-body">
        <div className="container pd-content-grid">
          
          <div className="pd-main-content">
            {metrics && metrics.length > 0 && (
              <div className="pd-section">
                <h2>Performance Metrics</h2>
                <div className="metrics-grid">
                  {metrics.map((m: any, i: number) => (
                    <div key={i} className="metric-card">
                      <div className="metric-value" style={{ color: project.color }}>{m.value}</div>
                      <div className="metric-label">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {features && features.length > 0 && (
              <div className="pd-section">
                <h2>Core Features</h2>
                <ul className="pd-list">
                  {features.map((f: string, i: number) => (
                    <li key={i}>
                      <FaCheckCircle color={project.color} size={18} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {integrations && integrations.length > 0 && (
              <div className="pd-section">
                <h2>Supported Integrations</h2>
                <ul className="pd-list">
                  {integrations.map((int: string, i: number) => (
                    <li key={i}>
                      <FaCheckCircle color="var(--text-secondary)" size={18} />
                      <span>{int}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="pd-sidebar">
            <div className="sidebar-card">
              <h3>Project Snapshot</h3>
              <div className="sidebar-stat">
                <span className="sidebar-stat-label">Industry</span>
                <span className="sidebar-stat-value" style={{ textTransform: 'capitalize' }}>{project.industry}</span>
              </div>
              <div className="sidebar-stat">
                <span className="sidebar-stat-label">Time to Deploy</span>
                <span className="sidebar-stat-value">{project.implementationTime}</span>
              </div>
            </div>

            <div className="sidebar-card" style={{ background: `linear-gradient(135deg, #094F56 0%, #063137 100%)`, borderColor: 'transparent' }}>
              <h3 style={{ color: '#fff' }}>Ready to implement?</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                Get in touch with our engineering team to discuss how {project.title} can be integrated into your infrastructure.
              </p>
              <button 
                className="btn-primary" 
                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
                onClick={() => {
                  if ((window as any).gtag) {
                    (window as any).gtag('event', 'select_content', {
                      'content_type': 'project',
                      'item_id': project.slug,
                      'event_label': 'Request Demo Clicked'
                    });
                  }
                  navigate(`/contact?project=${project.slug}`);
                }}
              >
                Request Demo
              </button>
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
};

export default ProjectDetail;
