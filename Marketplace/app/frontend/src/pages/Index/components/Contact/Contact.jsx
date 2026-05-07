import React, { useState } from 'react';
import { FaPaperPlane, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin } from 'react-icons/fa';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
    alert('Thank you for reaching out! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>
            <FaPaperPlane className={styles.badgeIcon} />
            <span>Get in Touch</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Let's Build Something Amazing Together
          </h2>
          <p className={styles.sectionDescription}>
            Have an idea or project in mind? Let's discuss how we can turn your vision into reality.
          </p>
        </div>

        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon} style={{ backgroundColor: '#3b82f640' }}>
                <FaEnvelope style={{ color: '#3b82f6' }} />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Email Us</h3>
                <p className={styles.infoText}>contact@salmanagha.com</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon} style={{ backgroundColor: '#10b98140' }}>
                <FaPhone style={{ color: '#10b981' }} />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Call Us</h3>
                <p className={styles.infoText}>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon} style={{ backgroundColorankar: '#f59e0b40' }}>
                <FaMapMarkerAlt style={{ color: '#f59e0b' }} />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Location</h3>
                <p className={styles.infoText}>San Francisco, CA</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon} style={{ backgroundColor: '#0077b540' }}>
                <FaLinkedin style={{ color: '#0077b5' }} />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Follow Us</h3>
                <p className={styles.infoText}>LinkedIn</p>
              </div>
            </div>
          </div>

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="John Doe"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Tell us about your project..."
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>
              Send Message
              <FaPaperPlane className={styles.submitIcon} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
