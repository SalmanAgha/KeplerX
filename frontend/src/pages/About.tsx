import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const values = [
  { icon: '🎯', title: 'Mission-Aligned', desc: 'We tie every technical decision to your strategic business outcomes — not just technical metrics.' },
  { icon: '🔬', title: 'Research-Driven', desc: 'Our engineers stay at the cutting edge, continuously evaluating and adopting technologies that give you a competitive edge.' },
  { icon: '🤝', title: 'Radical Transparency', desc: 'Real-time dashboards, weekly video check-ins, and complete visibility into every sprint.' },
  { icon: '♾️', title: 'Built to Last', desc: 'Clean architecture, thorough documentation, and code you can confidently hand to any future team.' },
];

const team = [
  {
    name: 'Baqar Shah',
    role: 'Co-Founder & Principal Senior Software Engineer',
    photo: '/BaqarShah.PNG',
    email: 'baqarshah@keplerx.co',
    desc: '18 years of industry experience building enterprise-grade systems. A principal engineer who turns complex technical challenges into scalable, production-ready solutions.',
  },
  {
    name: 'Salman Agha',
    role: 'Co-Founder & AI Engineer',
    photo: '/SalmanAgha.PNG',
    email: 'salmanagha@keplerx.co',
    desc: '5 years of full-stack development experience with 2 years specialising in AI/ML. Focused on bringing intelligent, modern products from prototype to production.',
  },
];

const milestones = [
  { year: '2018', event: 'Founded in San Francisco with a team of 4 engineers.' },
  { year: '2019', event: 'Delivered first enterprise SaaS platform, achieving $10M ARR for client.' },
  { year: '2021', event: 'Launched AI practice; first RAG system in production at scale.' },
  { year: '2022', event: 'Expanded to 40+ engineers across 3 continents.' },
  { year: '2024', event: 'Named top 10 technology partner by Enterprise Innovation Review.' },
  { year: '2026', event: 'Serving 150+ clients across fintech, health tech, and deep tech.' },
];

const About: React.FC = () => (
  <main className="about-page">

    {/* ── PAGE HERO ─────────────────────────────────────── */}
    <section className="about-hero">
      <div className="about-hero-bg">
        <div className="ah-orb ah-orb-1"></div>
        <div className="ah-orb ah-orb-2"></div>
        <div className="ah-grid"></div>
      </div>
      <div className="container">
        <div className="section-tag"><span className="dot"></span>About KeplerX</div>
        <h1 className="about-headline">
          The Engineering Strike Team<br />
          <span className="gradient-text">You Deserved</span>
        </h1>
        <p className="about-sub">
          We don't hire "developers". We hire the top 1% of computer scientists. 
          KeplerX is a premium technology agency built for ambitious companies 
          who understand that technical superiority is the only sustainable competitive advantage.
        </p>
      </div>
    </section>

    {/* ── TEAM ──────────────────────────────────────────── */}
    <section className="section team-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag"><span className="dot"></span>The Team</div>
          <h2 className="section-title">
            Led by Engineers,<br />
            <span className="gradient-text">Built for Builders</span>
          </h2>
          <p className="section-sub">
            Our leadership team has shipped products used by hundreds of millions of people.
          </p>
        </div>
        <div className="team-grid team-grid-founders">
          {team.map((t, i) => (
            <a key={i} href={`mailto:${t.email}`} className="team-card team-card-link">
              <img src={t.photo} alt={t.name} className="team-photo" />
              <div className="team-info">
                <h4>{t.name}</h4>
                <span className="team-role">{t.role}</span>
                <p>{t.desc}</p>
                <span className="team-email">{t.email}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* ── MISSION ───────────────────────────────────────── */}
    <section className="section mission-section">
      <div className="container">
        <div className="mission-inner">
          <div className="mission-left">
            <div className="section-tag"><span className="dot"></span>Our Mission</div>
            <h2 className="section-title">
              Engineering the Systems<br />
              <span className="gradient-text-cyan">That Shape Industries</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginTop: '20px', fontSize: '16px' }}>
              We believe the best technology is invisible — it just works, at any scale, without friction.
              Our mission is to build the digital infrastructure that powers the next generation of market leaders.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginTop: '16px', fontSize: '16px' }}>
              Every project we take on is a commitment. We don't operate as a body shop — we operate
              as a strategic partner, fully invested in your outcomes from kickoff to long after launch.
            </p>
          </div>
          <div className="mission-right">
            <div className="mission-card">
              <div className="mc-number gradient-text">150+</div>
              <div className="mc-label">Projects Delivered</div>
            </div>
            <div className="mission-card">
              <div className="mc-number gradient-text">23+</div>
              <div className="mc-label">Years Combined Experience</div>
            </div>
            <div className="mission-card">
              <div className="mc-number gradient-text">100+</div>
              <div className="mc-label">Clients Served</div>
            </div>
            <div className="mission-card">
              <div className="mc-number gradient-text">10+</div>
              <div className="mc-label">Industries Covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── VALUES ────────────────────────────────────────── */}
    <section className="section values-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag"><span className="dot"></span>Our Values</div>
          <h2 className="section-title">
            Principles That Drive<br />
            <span className="gradient-text">Every Decision</span>
          </h2>
        </div>
        <div className="values-grid">
          {values.map((v, i) => (
            <div key={i} className="value-card glass-card">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── TIMELINE ──────────────────────────────────────── */}
    <section className="section timeline-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag"><span className="dot"></span>Our Journey</div>
          <h2 className="section-title">
            Six Years of<br />
            <span className="gradient-text-cyan">Building the Future</span>
          </h2>
        </div>
        <div className="timeline">
          {milestones.map((m, i) => (
            <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-card">
                <div className="timeline-year">{m.year}</div>
                <p>{m.event}</p>
              </div>
              <div className="timeline-dot"></div>
            </div>
          ))}
          <div className="timeline-line"></div>
        </div>
      </div>
    </section>

    {/* ── CTA ───────────────────────────────────────────── */}
    <section className="section">
      <div className="container">
        <div className="about-cta-card">
          <div className="cta-orb cta-orb-1"></div>
          <div className="cta-orb cta-orb-2"></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h2 className="section-title">
              Our Capacity is Limited.<br />
              <span className="gradient-text">Your Ambition Is Not.</span>
            </h2>
            <p className="section-sub" style={{ marginTop: '16px' }}>
              We limit our intake to 5 major enterprise partners per quarter to ensure zero compromise on quality. 
              Secure your Q3/Q4 engineering slot today.
            </p>
            <div style={{ marginTop: '36px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/contact" className="btn-primary">
                <span>Get in Touch</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>
);

export default About;
