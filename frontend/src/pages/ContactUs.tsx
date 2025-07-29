import React, { useState } from 'react';
import './ContactUs.css';
import Breadcrumb from '../components/Breadcrumb';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting form data:', formData);
      const response = await fetch('http://localhost:5000/api/forms/contact', {
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
      
      setFormSubmitted(true);
      setShowPopup(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
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
      <Breadcrumb 
        title="Contact Us" 
        path={['Home', 'Contact Us']} 
      />
      
      <section className="contact-us-section">
        <div className="">
          <div className="contact-us-info">
            <h2>We're Here To Help With Your <span>Questions</span> & Needs</h2>
            <p>Reach out to our team for personalized assistance with your inquiries, feedback, or support needs. We're committed to providing exceptional service and timely responses to all your communications.</p>
          </div>
          <div className="contact-us-main">
            <div className="contact-us-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243646.08334004995!2d-0.3817838!3d51.5287718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761cbf1b8b1b1b%3A0x2f9e4b9b1b8b1b1b!2sLondon%2C%20UK!5e0!3m2!1sen!2s!4v1618311234567!5m2!1sen!2s"
                width="100%"
                height="610"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Office Location"
              ></iframe>
            </div>
            
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  required 
                />
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number" 
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address" 
                  required 
                />
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject" 
                  required 
                />
              </div>
              <div className="form-group">
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message" 
                  required 
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="send-now-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : formSubmitted ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Success Popup */}
      {showPopup && (
        <div className="success-popup">
          <div className="success-popup-content">
            <i className="fas fa-check-circle"></i>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. We'll get back to you soon.</p>
          </div>
        </div>
      )}
      
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-header">
            <h2>Get In Touch <span>With Our Team</span></h2>
            <p>We offer multiple ways to connect with our specialists who are ready to assist you. Choose the most convenient method below to reach us.</p>
          </div>
          
          <div className="contact-info-boxes">
            <div className="contact-info-box">
              <div className="contact-icon">
                <div className="icon-circle">
                  <i className="fas fa-phone-alt"></i>
                </div>
              </div>
              <h3>Call Us Now</h3>
              <p className="contact-detail">(+23) 765-897-908</p>
              <p className="contact-description">Our customer support team is available Monday through Friday from 9 AM to 6 PM to assist you.</p>
              <a href="tel:+23765897908" className="contact-action">Call Now <span className="arrow-icon">→</span></a>
            </div>
            
            <div className="contact-info-box">
              <div className="contact-icon">
                <div className="icon-circle">
                  <i className="fab fa-instagram"></i>
                </div>
              </div>
              <h3>Social Media</h3>
              <p className="contact-detail">@KeplerX.Official</p>
              <p className="contact-description">Follow us on social media for updates, promotions, and to join our growing online community.</p>
              <a href="#" className="contact-action">Connect Now <span className="arrow-icon">→</span></a>
            </div>
            
            <div className="contact-info-box">
              <div className="contact-icon">
                <div className="icon-circle">
                  <i className="fas fa-envelope"></i>
                </div>
              </div>
              <h3>Email Address</h3>
              <p className="contact-detail">support@keplerx.com</p>
              <p className="contact-description">Send us an email for any inquiries, feedback, or partnership opportunities.</p>
              <a href="mailto:support@keplerx.com" className="contact-action">Send Email <span className="arrow-icon">→</span></a>
            </div>
            
            <div className="contact-info-box">
              <div className="contact-icon">
                <div className="icon-circle">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
              </div>
              <h3>Location</h3>
              <p className="contact-detail">123 Business Avenue, London</p>
              <p className="contact-description">Visit our headquarters to meet our team in person and discuss your needs face-to-face.</p>
              <a href="#" className="contact-action">Visit Us Now <span className="arrow-icon">→</span></a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs; 