import React from 'react';
import './About.css';
import AboutBanner from '../components/AboutBanner';
import WhyChooseUs from '../components/WhyChooseUs';
import OurMission from '../components/OurMission';

const About: React.FC = () => {
  return (
    <>
      <AboutBanner />
      <WhyChooseUs />
      <OurMission />
    </>
  );
};

export default About; 