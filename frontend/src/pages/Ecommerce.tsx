import React, { useState } from 'react';
import './Ecommerce.css';
import Breadcrumb from '../components/Breadcrumb';

const Ecommerce: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const ecommerceItems = [
    {
      id: 1,
      title: 'E-commerce Platforms',
      category: 'platforms',
      image: 'https://picsum.photos/id/44/600/400',
      description: 'Custom-built e-commerce platforms designed to showcase products and streamline online sales.',
      bgColor: '#2d2150'
    },
    {
      id: 2,
      title: 'Payment Integration',
      category: 'payment',
      image: 'https://picsum.photos/id/45/600/400',
      description: 'Seamless payment gateway integrations supporting multiple payment methods and currencies.',
      bgColor: '#1a3a4a'
    },
    {
      id: 3,
      title: 'Product Catalogs',
      category: 'catalogs',
      image: 'https://picsum.photos/id/46/600/400',
      description: 'Flexible and searchable product catalogs with filtering options and detailed product information.',
      bgColor: '#3d2d5c'
    },
    {
      id: 4,
      title: 'Shopping Cart Systems',
      category: 'cart',
      image: 'https://picsum.photos/id/47/600/400',
      description: 'User-friendly shopping cart systems that streamline the checkout process and reduce abandonment.',
      bgColor: '#4a2d1a'
    },
    {
      id: 5,
      title: 'Inventory Management',
      category: 'management',
      image: 'https://picsum.photos/id/48/600/400',
      description: 'Real-time inventory tracking and management systems that prevent overselling and stockouts.',
      bgColor: '#2d4a3a'
    },
    {
      id: 6,
      title: 'Customer Accounts',
      category: 'customers',
      image: 'https://picsum.photos/id/49/600/400',
      description: 'Personalized customer account systems with order history, wishlist, and profile management.',
      bgColor: '#4a1a2d'
    },
    {
      id: 7,
      title: 'Mobile Shopping',
      category: 'mobile',
      image: 'https://picsum.photos/id/50/600/400',
      description: 'Mobile-optimized shopping experiences that enable customers to shop on-the-go from any device.',
      bgColor: '#1a4a3d'
    },
    {
      id: 8,
      title: 'Analytics Dashboard',
      category: 'analytics',
      image: 'https://picsum.photos/id/51/600/400',
      description: 'Comprehensive analytics dashboards that provide insights into sales, customer behavior, and trends.',
      bgColor: '#3a1a4a'
    }
  ];
  
  const filteredItems = filter === 'all' 
    ? ecommerceItems 
    : ecommerceItems.filter(item => item.category === filter);
  
  return (
    <>
      <Breadcrumb 
        title="E-commerce" 
        path={['Home', 'Core Industries', 'E-commerce']} 
      />
      
      <section className="ecommerce-section">
        <div className="container">
          <div className="ecommerce-intro">
            <h2>E-commerce Solutions</h2>
            <p>
              We develop custom e-commerce solutions that help businesses sell their products and services online. 
              Our expertise spans across e-commerce platforms, payment integrations, product catalogs, and inventory management systems.
            </p>
          </div>
          
          
          
          <div className="ecommerce-grid">
            {filteredItems.map(item => (
              <div className="ecommerce-card" key={item.id}>
                <div className="ecommerce-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="ecommerce-card-content" style={{ backgroundColor: item.bgColor }}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#" className="view-details">View Details</a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="ecommerce-cta">
            <h3>Start selling online today</h3>
            <p>Contact us to discuss how our e-commerce solutions can help your business grow its online presence and sales.</p>
            <button className="contact-btn">Contact Us</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Ecommerce; 