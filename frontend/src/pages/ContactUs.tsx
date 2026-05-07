import React, { useState } from 'react';
import './ContactUs.css';

const services = [
  'Software Development',
  'Web & App Development',
  'AI & Machine Learning',
  'DevOps & Cloud',
  'Technical Consulting',
  'Other',
];

const budgets = ['< $25K', '$25K – $100K', '$100K – $500K', '$500K+', 'Let\'s Discuss'];

const ContactUs: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', budget: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Map frontend fields to backend quote fields
      const payload = {
        name: form.name,
        email: form.email,
        company: form.company,
        service: form.service,
        budget: form.budget,
        message: form.message,
        description: form.message, // Map to both for backend compatibility
        timeline: 'ASAP', // Default to urgent
        projectDetails: form.message
      };

      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        setStatus('sent');
        // Google Analytics Conversion Tracking
        if ((window as any).gtag) {
          (window as any).gtag('event', 'generate_lead', {
            'event_category': 'engagement',
            'event_label': 'Mission Brief Submitted',
            'value': 1
          });
        }
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="contact-page">
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="contact-hero">
        <div className="contact-hero-bg">
          <div className="ch-orb ch-orb-1"></div>
          <div className="ch-orb ch-orb-2"></div>
          <div className="ch-grid"></div>
        </div>
        <div className="container">
          <div className="section-tag"><span className="dot"></span>Get in Touch</div>
          <h1 className="contact-headline">
            The Future Won't Wait.<br />
            <span className="gradient-text">Neither Should You.</span>
          </h1>
          <p className="contact-sub">
            Our engineering bandwidth is strictly limited to ensure elite delivery standards. 
            Submit your project brief now to secure a technical assessment and lock in your deployment window.
          </p>
        </div>
      </section>

      {/* ── CONTACT BODY (VERTICAL ROWS) ─────────────────────────────── */}
      <section className="section contact-body">
        <div className="container">
          
          {/* Row 1: The Terminal Protocol Form */}
          <div className="contact-row terminal-form-row">
            <div className="terminal-wrap">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="terminal-title">mission_brief.sys</div>
              </div>
              
              <div className="terminal-body">
                {status === 'sent' ? (
                  <div className="form-success">
                    <div className="success-icon-wrap">
                      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                      </svg>
                    </div>
                    <h3>Mission Brief Received</h3>
                    <p>Transmission successful. Our engineers will respond within 24 hours.</p>
                    <button className="btn-secondary" onClick={() => setStatus('idle')} style={{ marginTop: '24px' }}>New Transmission</button>
                  </div>
                ) : (
                  <form className="protocol-form" onSubmit={handleSubmit}>
                    <div className="protocol-field">
                      <label>01. FULL_NAME</label>
                      <input id="name" type="text" name="name" placeholder="E.g. Alex Morgan" value={form.name} onChange={handleChange} required />
                    </div>
                    
                    <div className="protocol-field">
                      <label>02. WORK_EMAIL</label>
                      <input id="email" type="email" name="email" placeholder="alex@company.com" value={form.email} onChange={handleChange} required />
                    </div>
                    
                    <div className="protocol-field">
                      <label>03. ORGANIZATION</label>
                      <input id="company" type="text" name="company" placeholder="Company Name" value={form.company} onChange={handleChange} />
                    </div>
                    
                    <div className="protocol-grid">
                      <div className="protocol-field">
                        <label>04. CORE_SERVICE</label>
                        <select id="service" name="service" value={form.service} onChange={handleChange}>
                          <option value="">Select Service</option>
                          {services.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="protocol-field">
                        <label>05. BUDGET_RANGE</label>
                        <select id="budget" name="budget" value={form.budget} onChange={handleChange}>
                          <option value="">Select Budget</option>
                          {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="protocol-field">
                      <label>06. MISSION_DETAILS</label>
                      <textarea id="message" name="message" rows={3} placeholder="Describe your objectives..." value={form.message} onChange={handleChange} required />
                    </div>

                    {status === 'error' && <div className="form-error">Connection failed. Please retry.</div>}

                    <button type="submit" className="protocol-submit" disabled={status === 'sending'}>
                      <span>{status === 'sending' ? 'TRANSMITTING...' : 'EXECUTE MISSION BRIEF'}</span>
                      <div className="btn-glow"></div>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Prefer to Talk? (Horizontal Banner) */}
          <div className="contact-row talk-row">
            <div className="talk-card glass-card">
              <div className="talk-content">
                <div className="section-tag"><span className="dot"></span>Immediate Assistance</div>
                <h3>Prefer a Direct Conversation?</h3>
                <p>Book a strategy session with a senior engineer to discuss feasibility and architecture.</p>
              </div>
              <div className="talk-actions">
                <a href="mailto:info@keplerx.co" className="talk-btn">
                  <span role="img" aria-label="email">📧</span> info@keplerx.co
                </a>
                <div className="talk-office">
                  <div className="office-item">
                    <strong>USA</strong> +1 925 3414413
                  </div>
                  <div className="office-item">
                    <strong>PK</strong> +92 314 6963877
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: What Happens Next (Visual Steps) */}
          <div className="contact-row process-row">
            <div className="section-tag" style={{ textAlign: 'center', marginBottom: '32px' }}><span className="dot"></span>The Protocol</div>
            <div className="process-horizontal-grid">
              {[
                { n: '01', t: 'Brief Review', d: 'Senior engineers analyze your technical requirements within 12 hours.' },
                { n: '02', t: 'Discovery Call', d: 'A 30-min deep dive into architecture and technical feasibility.' },
                { n: '03', t: 'Proposal', d: 'Comprehensive roadmap, pricing, and resource allocation plan.' },
                { n: '04', t: 'Kickoff', d: 'Your dedicated strike-team begins engineering the first sprint.' },
              ].map((s, i) => (
                <div key={i} className="process-step-card">
                  <div className="step-num">{s.n}</div>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                  {i < 3 && <div className="step-connector"></div>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── FAQ SECTION ─────────────────────────────── */}
      <section className="section contact-faq">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="section-tag"><span className="dot"></span>Got Questions?</div>
            <h2 className="section-title">Common Project <span className="gradient-text">Inquiries</span></h2>
          </div>
          
          <div className="faq-grid">
            {[
              { q: 'How quickly can we start?', a: 'Once the brief is approved, we can usually assemble an elite strike-team and kick off discovery within 7-10 business days.' },
              { q: 'Do you handle IP ownership?', a: 'Absolutely. All IP, source code, and infrastructure blueprints are 100% owned by your organization upon final milestone delivery.' },
              { q: 'What is your typical project scale?', a: 'We specialize in enterprise-grade transformations. Most projects range from $50K to $500K+, though we offer focused AI consulting for smaller scopes.' },
              { q: 'Do you provide post-launch support?', a: 'Yes. Every project includes a 60-day intensive hyper-care period, followed by optional managed services for ongoing scaling.' }
            ].map((item, i) => (
              <div key={i} className="faq-card glass-card">
                <h4>{item.q}</h4>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;