import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaIndustry, FaHeartbeat, FaDollarSign, FaBriefcase, 
  FaGraduationCap, FaShoppingCart, FaChartLine, FaArrowRight,
  FaRobot, FaBoxes, FaShoppingBag
} from 'react-icons/fa';
import './Marketplace.css';

const industries = [
  { id: 'all', name: 'All Industries', icon: FaIndustry },
  { id: 'health', name: 'Health AI', icon: FaHeartbeat },
  { id: 'finance', name: 'Finance AI', icon: FaDollarSign },
  { id: 'management', name: 'Management AI', icon: FaBriefcase },
  { id: 'education', name: 'Education AI', icon: FaGraduationCap },
  { id: 'retail', name: 'Retail AI', icon: FaShoppingCart },
];

// Icon map helper
const iconMap: { [key: string]: any } = {
  FaHeartbeat, FaDollarSign, FaBriefcase, FaGraduationCap, FaShoppingCart, FaChartLine, FaIndustry, FaRobot, FaBoxes, FaShoppingBag
};

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/marketplace')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch marketplace projects:', err);
        setLoading(false);
      });
  }, []);

  const filteredProjects = selectedIndustry === 'all' 
    ? projects 
    : projects.filter(project => project.industry?.toLowerCase() === selectedIndustry.toLowerCase());

  const activeIndustry = industries.find(ind => ind.id === selectedIndustry);

  const handleProjectClick = (slug: string) => {
    navigate(`/marketplace/${slug}`);
  };

  return (
    <main className="marketplace-page">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="mp-hero">
        <div className="mp-hero-bg">
          <div className="mp-orb mp-orb-1"></div>
          <div className="mp-orb mp-orb-2"></div>
          <div className="mp-grid"></div>
        </div>
        <div className="container mp-hero-content">
          <div className="section-tag"><span className="dot"></span>KeplerX Marketplace</div>
          <h1 className="mp-headline">
            The Era of R&D is Over.<br />
            <span className="gradient-text">Deploy AI Today.</span>
          </h1>
          <p className="mp-sub">
            Your competitors are building. While they struggle with research, you deploy results. 
            Access our elite catalog of enterprise-ready AI infrastructure and secure your lead.
          </p>
        </div>
      </section>

      {/* ── MARKETPLACE BODY ───────────────────────────────── */}
      <section className="section mp-body">
        <div className="container">
          
          <div className="mp-header">
            <h2 className="mp-section-title">Featured Projects</h2>
            <p className="mp-section-sub">
              Discover revolutionary AI solutions crafted to transform your business and accelerate innovation.
            </p>
          </div>

          {/* Filters */}
          <div className="mp-filters-wrap">
            <div className="mp-filters">
              {industries.map((industry) => {
                const IconComponent = industry.icon;
                const isActive = selectedIndustry === industry.id;
                return (
                  <button
                    key={industry.id}
                    className={`mp-filter-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedIndustry(industry.id)}
                  >
                    <IconComponent className="filter-icon" />
                    <span>{industry.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="mp-filter-info">
              <span className="mp-filter-count">
                Showing <strong style={{color: 'var(--text-primary)'}}>{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
              </span>
              {selectedIndustry !== 'all' && (
                <span className="mp-active-filter">
                  in {activeIndustry?.name}
                </span>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="mp-empty-state">
              <span className="btn-spinner" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent', width: 30, height: 30 }}></span>
              <p>Loading projects...</p>
            </div>
          ) : (
            <div className="mp-grid-container">
              {filteredProjects.map((project, index) => {
                const IconComponent = iconMap[project.icon] || FaRobot;
                return (
                  <div 
                    key={project.slug} 
                    className="mp-card"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="mp-card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${project.color}15 0%, transparent 70%)` }}></div>
                    
                    <div className="mp-card-inner">
                      <div className="mp-card-header">
                        <div className="mp-icon-wrap" style={{ backgroundColor: `${project.color}15`, color: project.color }}>
                          <IconComponent size={22} />
                        </div>
                        <span className="mp-category" style={{ color: project.color }}>
                          {project.category}
                        </span>
                      </div>
                      
                      <div className="mp-card-body">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                      </div>

                      <div className="mp-card-footer">
                        <button className="btn-use-now" onClick={() => handleProjectClick(project.slug)}>
                          Explore
                          <FaArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="mp-empty-state">
              <FaRobot className="empty-icon" />
              <h3>No projects found</h3>
              <p>Try selecting a different industry filter.</p>
            </div>
          )}

        </div>
      </section>
      
      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="mp-cta-card">
            <div className="mp-cta-orb mp-cta-orb-1"></div>
            <div className="mp-cta-orb mp-cta-orb-2"></div>
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <h2 className="mp-section-title">
                Need a Custom <span className="gradient-text">AI Solution?</span>
              </h2>
              <p className="mp-section-sub" style={{ marginTop: '16px', margin: '0 auto' }}>
                We build bespoke artificial intelligence infrastructure tailored perfectly to your business model.
              </p>
              <div style={{ marginTop: '36px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button className="btn-primary" onClick={() => navigate('/contact')}>
                  <span>Discuss Your Project</span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Marketplace;
