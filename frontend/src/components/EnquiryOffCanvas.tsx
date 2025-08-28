import React, { useState } from 'react';
import './EnquiryOffCanvas.css';

interface EnquiryOffCanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnquiryOffCanvas: React.FC<EnquiryOffCanvasProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting enquiry form:', formData);
      const response = await fetch('/api/forms/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const responseData = await response.json();
      console.log('Response from server:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit form');
      }
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
      });
      
      // Hide popup and close form after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        onClose();
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to submit form. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          
          {error && <div className="error-message">{error}</div>}
          
          <form className="enquiry-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                className="form-control" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required 
              />
            </div>
            
            <div className="form-group">
              <input 
                type="email" 
                className="form-control" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required 
              />
            </div>
            
            <div className="form-group">
              <input 
                type="tel" 
                className="form-control" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required 
              />
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                className="form-control" 
                name="company" 
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name (Optional)" 
              />
            </div>
            
            <div className="form-group">
              <select 
                className="form-select" 
                name="service" 
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a service</option>
                <option value="Web Development">Web Development</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>
            
            <div className="form-group">
              <textarea 
                className="form-control" 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message" 
                style={{ height: '120px' }}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <span>Send Enquiry</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>
          
          <div className="enquiry-contact-info">
            <p>Or contact us directly:</p>
            <div className="contact-methods">
              <a href="tel:+123456789" className="contact-method">
                <i className="fas fa-phone-alt icon"></i>
                <span className="text">+1 (234) 567-89</span>
              </a>
              <a href="mailto:info@example.com" className="contact-method">
                <i className="fas fa-envelope icon"></i>
                <span className="text">info@example.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-popup-content">
            <i className="fas fa-check-circle"></i>
            <h3>Thank You!</h3>
            <p>Your enquiry has been submitted successfully. We'll get back to you soon.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default EnquiryOffCanvas; 