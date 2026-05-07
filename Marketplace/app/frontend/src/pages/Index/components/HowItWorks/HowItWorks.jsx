import React from 'react';
import { 
  FaCheckCircle, 
  FaRocket, 
  FaLightbulb, 
  FaCog as FaSetup
} from 'react-icons/fa';
import styles from './HowItWorks.module.css';

const howItWorks = [
  { 
    step: '01', 
    title: 'Discover', 
    description: 'Explore our collection of innovative AI solutions tailored to your needs', 
    icon: FaLightbulb,
    color: '#f59e0b'
  },
  { 
    step: '02', 
    title: 'Choose', 
    description: 'Select the perfect AI tool that aligns with your business objectives', 
    icon: FaCheckCircle,
    color: '#10b981'
  },
  { 
    step: '03', 
    title: 'Transform', 
    description: 'Implement cutting-edge AI technology and watch your business thrive', 
    icon: FaRocket,
    color: '#3b82f6'
  },
];

const HowItWorks = () => {
  return (
    <section className={styles.howItWorksSection}>
      <div className={styles.howItWorksContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.badgeContainer}>
            <div className={styles.badge}>
              <FaSetup className={styles.badgeIcon} />
              <span>How It Works</span>
            </div>
          </div>
          <h2 className={styles.sectionTitle}>
            Your Journey Starts Here
          </h2>
          <p className={styles.sectionDescription}>
            Simple steps to unlock the power of artificial intelligence
          </p>
        </div>

        <div className={styles.stepsContainer}>
          {howItWorks.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className={styles.stepCard}>
                <div 
                  className={styles.stepIconWrapper}
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  <IconComponent 
                    className={styles.stepIcon} 
                    style={{ color: step.color }} 
                  />
                </div>
                <h3 className={styles.stepTitle}>
                  <span className={styles.stepNumber} style={{ color: step.color }}>{step.step}</span> : {step.title}
                </h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
