import React from 'react';
import { 
  FaBrain, FaCloud, FaRobot, FaCode, FaChartLine, FaBolt,
  FaReact, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaPython,
  FaGitAlt, FaDocker, FaAws
} from 'react-icons/fa';
import styles from './Technologies.module.css';

const technologies = [
  { name: 'Machine Learning', icon: FaBrain, color: '#8b5cf6' },
  { name: 'Deep Learning', icon: FaCloud, color: '#3b82f6' },
  { name: 'NLP', icon: FaRobot, color: '#10b981' },
  { name: 'Computer Vision', icon: FaCode, color: '#f59e0b' },
  { name: 'Data Analytics', icon: FaChartLine, color: '#ef4444' },
  { name: 'API Integration', icon: FaBolt, color: '#ec4899' },
  { name: 'React', icon: FaReact, color: '#61dafb' },
  { name: 'HTML5', icon: FaHtml5, color: '#e34c26' },
  { name: 'CSS3', icon: FaCss3Alt, color: '#264de4' },
  { name: 'JavaScript', icon: FaJs, color: '#f7df1e' },
  { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
  { name: 'Python', icon: FaPython, color: '#3776ab' },
  { name: 'Git', icon: FaGitAlt, color: '#f05032' },
  { name: 'Docker', icon: FaDocker, color: '#0db7ed' },
  { name: 'AWS', icon: FaAws, color: '#FF9900' },
];

const Technologies = () => {
  return (
    <section className={styles.techSection}>
      <div className={styles.techContainer}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.techTitle}>
            Powered by Next-Generation Technology
          </h2>
          <p className={styles.techDescription}>
            Leveraging the latest advancements in AI and machine learning
          </p>
        </div>

        <div className={styles.techGridContainer}>
          <div className={styles.techGrid}>
            {/* First set of technologies */}
            {technologies.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div key={index} className={styles.techCard}>
                  <div className={styles.techIconWrapper} style={{ backgroundColor: `${tech.color}20` }}>
                    <IconComponent className={styles.techIcon} style={{ color: tech.color }} />
                  </div>
                  <h4 className={styles.techName}>{tech.name}</h4>
                </div>
              );
            })}
            {/* Duplicate set for seamless loop */}
            {technologies.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div key={`dup-${index}`} className={styles.techCard}>
                  <div className={styles.techIconWrapper} style={{ backgroundColor: `${tech.color}20` }}>
                    <IconComponent className={styles.techIcon} style={{ color: tech.color }} />
                  </div>
                  <h4 className={styles.techName}>{tech.name}</h4>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;

