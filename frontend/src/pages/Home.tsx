import React from 'react';
import '../components/Banner.css';
import './Home.css';
import Services from '../components/Services';
import CoreIndustries from '../components/CoreIndustries';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Banner: React.FC = () => {
  return (
    <div className="banner">
      <div className="container">
        <div className="banner-content">
          <h1>
            <span className="text-white">Digitalize</span> your<br />
            <span className="text-white">Business</span> with<br />
            <span className="text-white">KEPLERX</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div>
      <Banner />
      <Services />
      <CoreIndustries />
      <Testimonials />
    </div>
  );
};

export default Home;