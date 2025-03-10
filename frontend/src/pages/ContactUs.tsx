import React from 'react';
import './ContactUs.css';
import Breadcrumb from '../components/Breadcrumb';

const ContactUs: React.FC = () => {
  return (
    <>
      <Breadcrumb 
        title="Contact Us" 
        path={['Home', 'Contact Us']} 
      />
      
      <section className="contact-us-section">
        <div className="container">
          <div className="contact-us-info">
            <h2>We Are Open With Your <span>Opinion</span> & New Ideas</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
            <button className="learn-more-btn">Learn More</button>
          </div>
          <div className="contact-us-main">
            <div className="contact-us-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243646.08334004995!2d-0.3817838!3d51.5287718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761cbf1b8b1b1b%3A0x2f9e4b9b1b8b1b1b!2sLondon%2C%20UK!5e0!3m2!1sen!2s!4v1618311234567!5m2!1sen!2s"
                width="100%"
                height="410"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="contact-us-form">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" />
                  <input type="text" placeholder="Phone Number" />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Email" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Message"></textarea>
                </div>
                <button type="submit" className="send-now-btn">Send Now</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-header">
            <h2>Contact Us <span>For More Information</span></h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
          </div>
          
          <div className="contact-info-boxes">
            <div className="contact-info-box">
              <div className="contact-icon">
                <div className="icon-circle">
                  <span className="phone-icon">📞</span>
                </div>
              </div>
              <h3>Call Us Now</h3>
              <p className="contact-detail">(+23) 765-897-908</p>
              <p className="contact-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit.</p>
              <a href="tel:+23765897908" className="contact-action">Call Now <span className="arrow-icon">→</span></a>
            </div>
            
            <div className="contact-info-box">
              <div className="contact-icon">
                <div className="icon-circle">
                  <span className="social-icon">🌐</span>
                </div>
              </div>
              <h3>Social Media</h3>
              <p className="contact-detail">Fluxco.Official</p>
              <p className="contact-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit.</p>
              <a href="#" className="contact-action">Connect Now <span className="arrow-icon">→</span></a>
            </div>
            
            <div className="contact-info-box">
              <div className="contact-icon">
                <div className="icon-circle">
                  <span className="email-icon">✉️</span>
                </div>
              </div>
              <h3>Email Address</h3>
              <p className="contact-detail">fluxco@site.com</p>
              <p className="contact-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit.</p>
              <a href="mailto:fluxco@site.com" className="contact-action">Send Email <span className="arrow-icon">→</span></a>
            </div>
            
            <div className="contact-info-box">
              <div className="contact-icon">
                <div className="icon-circle">
                  <span className="location-icon">📍</span>
                </div>
              </div>
              <h3>Location</h3>
              <p className="contact-detail">Nusa Dua, Bali</p>
              <p className="contact-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit.</p>
              <a href="#" className="contact-action">Visit Us Now <span className="arrow-icon">→</span></a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs; 