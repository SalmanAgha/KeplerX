import React, { useState } from 'react';
import './Education.css';
import Breadcrumb from '../components/Breadcrumb';

const Education: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const educationItems = [
    {
      id: 1,
      title: 'E-Learning Platforms',
      category: 'digital',
      image: 'https://picsum.photos/id/28/600/400',
      description: 'Comprehensive e-learning platforms that deliver interactive educational content to students of all ages.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'School Management',
      category: 'systems',
      image: 'https://picsum.photos/id/29/600/400',
      description: 'Integrated school management systems that streamline administrative tasks and improve communication.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'Virtual Classrooms',
      category: 'digital',
      image: 'https://picsum.photos/id/30/600/400',
      description: 'Interactive virtual classroom environments that facilitate remote learning and student engagement.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'Educational Content',
      category: 'content',
      image: 'https://picsum.photos/id/31/600/400',
      description: 'High-quality educational content development services for various subjects and grade levels.',
      bgColor: '#4a2d1a'
    },
    {
      id: 5,
      title: 'Assessment Tools',
      category: 'systems',
      image: 'https://picsum.photos/id/32/600/400',
      description: 'Comprehensive assessment and evaluation tools that measure student progress and learning outcomes.',
      bgColor: '#2d4a3a'
    },
    {
      id: 6,
      title: 'Campus Facilities',
      category: 'facilities',
      image: 'https://picsum.photos/id/33/600/400',
      description: 'Modern educational facilities designed to create optimal learning environments for students.',
      bgColor: '#4a1a2d'
    },
    {
      id: 7,
      title: 'Student Portals',
      category: 'digital',
      image: 'https://picsum.photos/id/34/600/400',
      description: 'Personalized student portals that provide access to courses, assignments, and academic resources.',
      bgColor: '#1a4a3d'
    },
    {
      id: 8,
      title: 'Educational Research',
      category: 'content',
      image: 'https://picsum.photos/id/35/600/400',
      description: 'Cutting-edge educational research initiatives that develop new teaching methodologies and learning approaches.',
      bgColor: '#3a1a4a'
    }
  ];
  
  const filteredItems = filter === 'all' 
    ? educationItems 
    : educationItems.filter(item => item.category === filter);
  
  return (
    <>
      <Breadcrumb 
        title="Education" 
        path={['Home', 'Core Industries', 'Education']} 
      />
      
      <section className="education-section">
        <div className="container">
          <div className="education-intro">
            <h2>Educational Solutions</h2>
            <p>
              We develop innovative educational solutions that enhance learning experiences and improve educational outcomes. 
              Our expertise spans across digital learning platforms, educational content, school management systems, and educational facilities.
            </p>
          </div>
          
      
          
          <div className="education-grid">
            {filteredItems.map(item => (
              <div className="education-card" key={item.id}>
                <div className="education-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="education-card-content" style={{ backgroundColor: item.bgColor }}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#" className="view-details">View Details</a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="education-cta">
            <h3>Looking for educational solutions?</h3>
            <p>Contact us to discuss how our educational expertise can help improve learning outcomes and institutional efficiency.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Education; 