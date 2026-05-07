import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaIndustry, FaHeartbeat, FaDollarSign, FaBriefcase, 
  FaGraduationCap, FaShoppingCart, FaChartLine, FaArrowRight,
  FaAward
} from 'react-icons/fa';
import styles from './FeaturedProjects.module.css';

const industries = [
  { id: 'all', name: 'All Industries', icon: FaIndustry },
  { id: 'health', name: 'Health AI', icon: FaHeartbeat },
  { id: 'finance', name: 'Finance AI', icon: FaDollarSign },
  { id: 'business', name: 'Management AI', icon: FaBriefcase },
  { id: 'education', name: 'Education AI', icon: FaGraduationCap },
  { id: 'retail', name: 'Retail AI', icon: FaShoppingCart },
];

const projects = [
  { 
    id: 1, 
    name: 'HealthAI Diagnostics', 
    description: 'Revolutionary AI-powered medical diagnosis saving lives through early detection',
    icon: FaHeartbeat,
    category: 'Health AI',
    industry: 'health',
    color: '#dc2626'
  },
  { 
    id: 2, 
    name: 'FinanceAI Trader', 
    description: 'Intelligent automated trading maximizing returns with predictive analytics',
    icon: FaDollarSign,
    category: 'Finance AI',
    industry: 'finance',
    color: '#16a34a'
  },
  { 
    id: 3, 
    name: 'ProjectManager AI', 
    description: 'Seamless team collaboration powered by AI-driven project intelligence',
    icon: FaBriefcase,
    category: 'Management AI',
    industry: 'business',
    color: '#6366f1'
  },
  { 
    id: 4, 
    name: 'SmartLearning AI', 
    description: 'Personalized education experiences adapting to every learner\'s unique journey',
    icon: FaGraduationCap,
    category: 'Education AI',
    industry: 'education',
    color: '#8b5cf6'
  },
  { 
    id: 5, 
    name: 'RetailAI Assistant', 
    description: 'Next-gen customer experience with AI-powered shopping intelligence',
    icon: FaShoppingCart,
    category: 'Retail AI',
    industry: 'retail',
    color: '#f59e0b'
  },
  { 
    id: 6, 
    name: 'HealthAI Wellness', 
    description: 'Empowering individuals to take control of their health journey',
    icon: FaHeartbeat,
    category: 'Health AI',
    industry: 'health',
    color: '#ef4444'
  },
  { 
    id: 7, 
    name: 'FinanceAI Analyzer', 
    description: 'Advanced financial intelligence delivering unprecedented market insights',
    icon: FaDollarSign,
    category: 'Finance AI',
    industry: 'finance',
    color: '#10b981'
  },
  { 
    id: 8, 
    name: 'BusinessAI Insights', 
    description: 'Data-driven decisions transforming businesses into industry leaders',
    icon: FaChartLine,
    category: 'Management AI',
    industry: 'business',
    color: '#3b82f6'
  },
];

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const filteredProjects = selectedIndustry === 'all' 
    ? projects 
    : projects.filter(project => project.industry === selectedIndustry);

  const activeIndustry = industries.find(ind => ind.id === selectedIndustry);

  const createProjectSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleProjectClick = (projectName) => {
    const slug = createProjectSlug(projectName);
    navigate(`/${slug}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.sectionHeader}>
        <div className={styles.badgeContainer}>
          <div className={styles.badge}>
            <FaAward className={styles.badgeIcon} />
            <span>Featured Projects</span>
          </div>
        </div>
        <h2 className={styles.sectionTitle}>
          Empower Your Vision with Cutting-Edge AI
        </h2>
        <p className={styles.sectionDescription}>
          Discover revolutionary AI solutions crafted to transform your business and accelerate innovation
        </p>
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterContainer}>
          {industries.map((industry) => {
            const IconComponent = industry.icon;
            const isActive = selectedIndustry === industry.id;
            
            return (
              <button
                key={industry.id}
                className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ''}`}
                onClick={() => setSelectedIndustry(industry.id)}
              >
                <IconComponent className={styles.filterIcon} />
                <span>{industry.name}</span>
              </button>
            );
          })}
        </div>
        
        <div className={styles.filterInfo}>
          <span className={styles.filterCount}>
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
          {selectedIndustry !== 'all' && (
            <span className={styles.activeFilter}>
              in {activeIndustry?.name}
            </span>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className={styles.projectsGrid}>
        {filteredProjects.map((project, index) => {
          const IconComponent = project.icon;
          return (
            <div 
              key={project.id} 
              className={styles.projectCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper} style={{ backgroundColor: `${project.color}20` }}>
                  <IconComponent className={styles.projectIcon} style={{ color: project.color }} />
                </div>
                <span className={styles.category} style={{ color: project.color }}>
                  {project.category}
                </span>
              </div>
              
              <div className={styles.cardBody}>
                <h3 className={styles.projectName}>{project.name}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.buttonGroup}>
                  <button className={styles.viewButton} onClick={() => handleProjectClick(project.name)}>
                    Explore Now
                    <FaArrowRight className={styles.arrowIcon} />
                  </button>
                  <button className={styles.useButton} onClick={() => handleProjectClick(project.name)}>
                    Use Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className={styles.emptyState}>
          <FaIndustry className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No projects found</h3>
          <p className={styles.emptyDescription}>
            Try selecting a different industry filter
          </p>
        </div>
      )}
    </main>
  );
};

export default FeaturedProjects;

