import React from 'react';
import './EnquiryOffCanvas.css';

interface EnquiryOffCanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnquiryOffCanvas: React.FC<EnquiryOffCanvasProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`enquiry-offcanvas-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`enquiry-offcanvas ${isOpen ? 'active' : ''}`}>
        <div className="enquiry-offcanvas-header">
          <h2>Enquire Now</h2>
          <button className="close-button" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        
        <div className="enquiry-offcanvas-content">
          <div className="enquiry-intro">
            <h3>Get in Touch with Us</h3>
            <p>Have a project in mind? Fill the form below and our team will get back to you within 24 hours.</p>
          </div>
          
          <form className="enquiry-form">
            <div className="form-floating mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="fullName" 
                placeholder="Full Name"
                required 
              />
              <label htmlFor="fullName">Full Name</label>
            </div>
            
            <div className="form-floating mb-3">
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="Email Address"
                required 
              />
              <label htmlFor="email">Email Address</label>
            </div>
            
            <div className="form-floating mb-3">
              <input 
                type="tel" 
                className="form-control" 
                id="phone" 
                placeholder="Phone Number" 
              />
              <label htmlFor="phone">Phone Number</label>
            </div>
            
            <div className="form-floating mb-3">
              <select className="form-select" id="serviceInterest" required>
                <option value="" disabled selected>Select a service</option>
                <option value="web-development">Web Development</option>
                <option value="graphic-design">Graphic Design</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="ui-ux-design">UI/UX Design</option>
                <option value="digital-marketing">Digital Marketing</option>
              </select>
              <label htmlFor="serviceInterest">Service Interest</label>
            </div>
            
            <div className="form-floating mb-3">
              <textarea 
                className="form-control" 
                id="message" 
                placeholder="Your Message" 
                style={{ height: '120px' }}
                required
              ></textarea>
              <label htmlFor="message">Your Message</label>
            </div>
            
            <div className="form-check mb-3">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="privacyPolicy" 
                required 
              />
              <label className="form-check-label" htmlFor="privacyPolicy">
                I agree to the Privacy Policy and Terms of Service
              </label>
            </div>
            
            <button type="submit" className="submit-btn">
              <span>Send Enquiry</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
          
          <div className="enquiry-contact-info">
            <p>Or contact us directly:</p>
            <div className="contact-methods">
              <a href="tel:+123456789" className="contact-method">
                <span className="icon">📞</span>
                <span className="text">+1 (234) 567-89</span>
              </a>
              <a href="mailto:info@example.com" className="contact-method">
                <span className="icon">✉️</span>
                <span className="text">info@example.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryOffCanvas; 