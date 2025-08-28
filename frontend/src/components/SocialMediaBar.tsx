import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPinterest, FaTimes, FaCheck } from 'react-icons/fa';
import './SocialMediaBar.css';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  projectDetails: string;
}

interface SocialMediaBarProps {
  showForm: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
}

const SocialMediaBar: React.FC<SocialMediaBarProps> = ({ showForm, onOpenForm, onCloseForm }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Web Development',
    budget: '5000',
    timeline: '1-3 months',
    projectDetails: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting quote form:', formData);
      const response = await fetch('/api/forms/quote', {
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
        service: 'Web Development',
        budget: '5000',
        timeline: '1-3 months',
        projectDetails: ''
      });
      
      // Hide popup after 3 seconds and close form
      setTimeout(() => {
        setShowSuccessPopup(false);
        onCloseForm();
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to submit form. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="social-media-bar-container">
      {/* Social Icons - Left Side */}
      <div className="social-icons-container">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
          <FaFacebook />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
          <FaTwitter />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
          <FaInstagram />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
          <FaLinkedin />
        </a>
        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-icon pinterest">
          <FaPinterest />
        </a>
      </div>

      {/* Quote Button - Right Side */}
      <div className="quote-button-container">
        <button className="quote-button" onClick={onOpenForm}>
          Get a Quote
        </button>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="form-popup-overlay" onClick={onCloseForm}>
          <div className="form-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={onCloseForm}>
              <FaTimes />
            </button>
            
            <div className="form-header">
              <div className="form-tag">Project Inquiry</div>
              <h2>Tell us about your project</h2>
              <p>Complete the form below, and we'll get back to you within 24 hours.</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Your Name *" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Your Email *" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Phone Number *" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="company" 
                    placeholder="Company Name" 
                    value={formData.company} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <select 
                    name="service" 
                    value={formData.service} 
                    onChange={handleChange}
                    required
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Branding">Branding & Identity</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <select 
                    name="timeline" 
                    value={formData.timeline} 
                    onChange={handleChange}
                    required
                  >
                    <option value="ASAP">As soon as possible</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months</option>
                  </select>
                </div>
              </div>
              
              <div className="budget-slider">
                <label>Estimated Budget (USD)</label>
                <div className="slider-labels">
                  <span>$1,000</span>
                  <span>$10,000+</span>
                </div>
                <input 
                  type="range" 
                  name="budget" 
                  min="1000" 
                  max="10000" 
                  step="500" 
                  value={formData.budget} 
                  onChange={handleChange} 
                />
                <div className="budget-note">Current selection: ${formData.budget}</div>
              </div>
              
              <div className="form-group">
                <textarea 
                  name="projectDetails" 
                  placeholder="Tell us about your project *" 
                  rows={5} 
                  value={formData.projectDetails} 
                  onChange={handleChange} 
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-popup-content">
            <FaCheck className="success-icon" />
            <h3>Thank You!</h3>
            <p>Your quote request has been submitted successfully. We'll get back to you soon with a customized proposal.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaBar; 