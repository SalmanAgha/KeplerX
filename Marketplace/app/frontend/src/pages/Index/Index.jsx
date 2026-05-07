import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaRobot, FaArrowRight, FaSignInAlt, 
  FaRocket, FaCode, FaLightbulb
} from 'react-icons/fa';
import HeroBackground from '../../components/HeroBackground/HeroBackground';
import Stats from './components/Stats/Stats';
import FeaturedProjects from './components/FeaturedProjects/FeaturedProjects';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Technologies from './components/Technologies/Technologies';
import FinalCTA from './components/FinalCTA/FinalCTA';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import styles from './Index.module.css';

function Index() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <HeroBackground />
        <button className={styles.loginButton} onClick={() => navigate('/login')}>
          <FaSignInAlt className={styles.loginIcon} />
          Login
        </button>
        
        <div className={styles.heroContent}>
          <div className={styles.badgeContainer}>
            <div className={styles.badge}>
              <FaRobot className={styles.badgeIcon} />
              <span>AI Marketplace</span>
            </div>
            <div className={styles.badge}>
              <span>SAAS</span>
            </div>
            <div className={styles.badge}>
              <span>PAAS</span>
            </div>
          </div>
          
          <div className={styles.titleContainer}>
            <h1 className={styles.heroTitle}>
              Transform Your Future with AI
            </h1>
            <p className={styles.heroSubtitle}>
              created by <strong>Salman Agha</strong>
            </p>
          </div>
          
          <p className={styles.heroDescription}>
            Pioneering the next generation of artificial intelligence solutions.
            Join thousands of innovators transforming their industries today.
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/login')}>
              Start Your Journey
              <FaArrowRight className={styles.ctaIcon} />
            </button>
            <button className={styles.ctaSecondary}>
              Explore Possibilities
            </button>
          </div>
        </div>

        {/* Floating elements */}
        <div className={styles.floatingElements}>
          <div className={styles.float1} style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
            <FaRocket />
          </div>
          <div className={styles.float2} style={{ transform: `translateY(${scrollY * 0.15}px)` }}>
            <FaCode />
          </div>
          <div className={styles.float3} style={{ transform: `translateY(${scrollY * 0.08}px)` }}>
            <FaLightbulb />
          </div>
        </div>
      </header>

      {/* Stats Section */}
      {/* <Stats /> */}

      {/* Featured Projects Section */}
      <FeaturedProjects />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Technologies Section */}
      <Technologies />

      {/* Final CTA Section */}
      <FinalCTA />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Index;
