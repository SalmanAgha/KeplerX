import React from 'react';
import './AppDevelopment.css';
import Breadcrumb from '../components/Breadcrumb';
import TechnologiesSlider from '../components/TechnologiesSlider';
import DevelopmentTimeline from '../components/DevelopmentTimeline';

const AppDevelopment: React.FC = () => {
  // Detailed list of App Development services
  const appServices = [
    {
      name: 'React Native Development',
      logo: '/images/react.webp',
      description: 'Build cross-platform apps with React Native for native performance and scalability across iOS and Android.'
    },
    {
      name: 'Flutter Development',
      logo: '/images/vue.png',
      description: 'Craft beautiful, high-performance apps with Google\'s Flutter framework and a single code-base.'
    },
    {
      name: 'iOS App Development',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
      description: 'Native iOS solutions using Swift and the latest Apple technologies for immersive user experiences.'
    },
    {
      name: 'Android App Development',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
      description: 'Native Android apps built with Kotlin/Java, optimized for performance and wide device coverage.'
    },
    {
      name: 'Progressive Web Apps (PWA)',
      logo: '/images/responsive.png',
      description: 'Installable, offline-capable web apps delivering near-native experiences directly from the browser.'
    },
    {
      name: 'App UI/UX Design',
      logo: '/images/ui.png',
      description: 'Intuitive interfaces and engaging user journeys tailored to boost satisfaction and retention.'
    },
    {
      name: 'Backend & API Development',
      logo: '/images/api.png',
      description: 'Secure, scalable APIs and cloud backends powering seamless app functionality.'
    },
    {
      name: 'QA & Testing',
      logo: '/images/security.png',
      description: 'Comprehensive manual & automated testing ensuring flawless performance, security and usability.'
    },
    {
      name: 'Maintenance & Support',
      logo: '/images/maintenance.png',
      description: 'Continuous monitoring, updates and feature enhancements keeping your app at peak performance.'
    },
  ];

  return (
    <>
      <Breadcrumb title="App Development" path={['Home', 'Services', 'App Development']} />
      <section className="app-dev-section">
        <div className="app-dev-intro">
          <h2>App Development</h2>
          <p>We craft high-performance mobile and web applications with exceptional user experiences, leveraging modern frameworks and native technologies.</p>
        </div>
        <div className="appdev-services-grid">
          {appServices.map((srv, idx) => (
            <div className="appdev-card" key={idx}>
              <h3>{srv.name}</h3>
              <p>{srv.description}</p>
            </div>
          ))}
        </div>

        {/* Technologies slider reused */}
        <TechnologiesSlider />

        {/* Generic development timeline */}
        <DevelopmentTimeline />
      </section>
    </>
  );
};

export default AppDevelopment; 