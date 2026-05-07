import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './Home.css';

/* ─── DATA ─────────────────────────────────────────────── */
const services = [
  {
    num: '01',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: 'Custom Software Development',
    desc: 'We architect software that survives the real world — millions of concurrent users, zero-downtime deployments, and the kind of clean, maintainable code that future teams will thank you for. From greenfield platforms to untangling decade-old monoliths, we own the full journey.',
    features: [
      'Greenfield architecture & full system design',
      'Legacy modernisation & platform migration',
      'High-throughput APIs & microservices engineering',
    ],
    outcome: 'Proven to cut time-to-market by up to 40%',
  },
  {
    num: '02',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: 'Web & Mobile Applications',
    desc: 'Interfaces that earn trust the moment they load. We obsess over performance, accessibility, and the micro-interactions that turn casual visitors into committed users — built to the same standard across web, iOS, and Android.',
    features: [
      'React, Next.js & full-stack web applications',
      'Native iOS & Android app development',
      'PWA, cross-platform & offline-first builds',
    ],
    outcome: 'Sub-1s load times and 95+ Lighthouse scores',
  },
  {
    num: '03',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'AI & Machine Learning',
    desc: 'Not AI as a feature — AI as a competitive weapon. We build intelligent systems that reason, retrieve, and act: from fine-tuned language models to production-grade RAG pipelines and autonomous agents that deliver real, measurable ROI.',
    features: [
      'LLM fine-tuning, RAG systems & prompt engineering',
      'Autonomous AI agents & workflow automation',
      'Predictive analytics & real-time inference at scale',
    ],
    outcome: 'GPT-4o, Claude, Gemini & open-source model stacks',
  },
  {
    num: '04',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>
      </svg>
    ),
    title: 'DevOps & Cloud Infrastructure',
    desc: 'Reliability is the foundation every other feature stands on. We design cloud infrastructure that self-heals, auto-scales, and keeps your engineers shipping — not firefighting. Secure, observable, and built for the long run from day one.',
    features: [
      'Cloud architecture across AWS, GCP & Azure',
      'Kubernetes, Docker & container orchestration',
      'CI/CD pipelines, observability & incident response',
    ],
    outcome: 'Infrastructure architected for 99.9% uptime',
  },
];

const stats = [
  { value: '23+', label: 'Years Combined Experience' },
  { value: '150+', label: 'Projects Delivered' },
  { value: '100+', label: 'Clients Served' },
  { value: '10+', label: 'Industries Covered' },
];

const techStack = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Go',
  'Rust', 'AWS', 'GCP', 'Azure', 'Kubernetes', 'Terraform',
  'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'Docker', 'CI/CD',
];

const process = [
  { num: '01', title: 'Discovery', desc: 'Deep-dive into your business goals, technical landscape, and growth ambitions.' },
  { num: '02', title: 'Architecture', desc: 'Design scalable system blueprints built for your specific requirements.' },
  { num: '03', title: 'Build', desc: 'Agile sprints with continuous delivery, weekly demos, and transparent communication.' },
  { num: '04', title: 'Launch & Scale', desc: 'Zero-downtime deployment, monitoring, and ongoing optimization.' },
];

const testimonials = [
  {
    text: '"KeplerX transformed our legacy infrastructure into a cloud-native platform that handles 10× the traffic at half the cost."',
    name: 'Sarah Chen',
    role: 'CTO, FinanceFlow Inc.',
    avatar: 'SC',
  },
  {
    text: '"Their AI integration increased our customer retention by 34%. The team operates at a level I\'ve never experienced."',
    name: 'Marcus Reynolds',
    role: 'VP Engineering, ScaleAI',
    avatar: 'MR',
  },
  {
    text: '"Delivered a full-stack platform in 8 weeks. Clean code, great docs, and zero critical bugs at launch. Remarkable."',
    name: 'Priya Nair',
    role: 'Founder, MedTech Ventures',
    avatar: 'PN',
  },
];

/* ─── COMPONENT ─────────────────────────────────────────── */
const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/marketplace')
      .then(res => res.json())
      .then(data => {
        setFeaturedProjects(data.slice(0, 3));
      })
      .catch(err => console.error('Failed to fetch featured projects:', err));
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 30;
      const y = (clientY / innerHeight - 0.5) * 30;
      heroRef.current.style.setProperty('--rx', `${y}deg`);
      heroRef.current.style.setProperty('--ry', `${x}deg`);
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <main className="home-page">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-grid"></div>
        </div>

        <div className="container hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Boutique AI & Engineering Studio
          </div>

          <h1 className="hero-headline">
            The Window for AI<br />
            <span className="gradient-text">Dominance</span> is<br />
            Closing.
          </h1>

          <p className="hero-sub">
            KeplerX is the elite engineering strike-team for enterprise AI systems,
            hyperscale cloud architecture, and mission-critical software. We deliver 
            the technical edge that separates market leaders from everyone else.
          </p>

          <div className="hero-ctas">
            <Link to="/contact" className="btn-primary">
              <span>Secure Your Advantage</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/about" className="btn-secondary">
              <span>About Us</span>
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map(s => (
              <div key={s.label} className="hero-stat">
                <span className="stat-value gradient-text">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating badges */}
        <div className="hero-floating">
          <div className="float-badge float-1">
            <span className="float-icon" role="img" aria-label="robot">🤖</span> AI-Powered
          </div>
          <div className="float-badge float-2">
            <span className="float-icon" role="img" aria-label="cloud">☁️</span> Cloud Native
          </div>
          <div className="float-badge float-3">
            <span className="float-icon" role="img" aria-label="lightning">⚡</span> 99.9% Uptime
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────── */}
      <section id="services" className="section services-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot"></span>What We Do</div>
            <h2 className="section-title">
              End-to-End Engineering,<br />
              <span className="gradient-text">Built for Scale.</span>
            </h2>
            <p className="section-sub">
              From first commit to global scale — we cover every layer of the stack with elite engineers.
            </p>
          </div>

          <div className="svc-grid">
            {services.map((s, i) => (
              <div key={i} className="svc-card">
                <div className="svc-card-inner">
                  <div className="svc-header">
                    <div className="svc-icon">{s.icon}</div>
                    <span className="svc-num">{s.num}</span>
                  </div>
                  <h3 className="svc-title">{s.title}</h3>
                  <p className="svc-desc">{s.desc}</p>
                  <ul className="svc-features">
                    {s.features.map(f => (
                      <li key={f}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="svc-outcome">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    {s.outcome}
                  </div>
                  <div className="svc-footer">
                    <Link to="/contact" className="svc-btn">
                      Start a Conversation
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ── FEATURED MARKETPLACE ──────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="section mp-home-section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag"><span className="dot"></span>AI Marketplace</div>
              <h2 className="section-title">
              Deployment-Ready AI<br />
              <span className="gradient-text">Stop Waiting. Start Scaling.</span>
            </h2>
            <p className="section-sub">
              Your competitors are already automating. Leapfrog the market with our pre-engineered, enterprise-grade AI infrastructure.
            </p>
          </div>

            <div className="services-grid">
              {featuredProjects.map((p, i) => (
                <div key={i} className="service-card" style={{ border: `1px solid ${p.color}30` }}>
                  <div className="service-card-inner">
                    <div className="service-icon" style={{ color: p.color }}>⬡</div>
                    <div className="section-tag" style={{ fontSize: '10px', padding: '2px 8px', marginBottom: '12px', color: p.color, borderColor: `${p.color}40`, background: `${p.color}10` }}>
                      {p.category}
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.description.substring(0, 100)}...</p>
                    <div className="service-cta">
                      <Link to={`/marketplace/${p.slug}`} style={{ color: p.color }}>
                        Explore Project
                        <FaArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                  <div className="service-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${p.color}20 0%, transparent 70%)` }}></div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link to="/marketplace" className="btn-secondary">
                <span>View Full Marketplace</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TECH TICKER ────────────────────────────────────── */}
      <section className="tech-ticker-section">
        <div className="ticker-fade ticker-fade-left"></div>
        <div className="ticker-fade ticker-fade-right"></div>
        <div className="ticker-track">
          {[...techStack, ...techStack].map((t, i) => (
            <div key={i} className="ticker-item">
              <span className="ticker-dot"></span>
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ────────────────────────────────────────── */}
      <section className="section process-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot"></span>How We Work</div>
            <h2 className="section-title">
              A Proven Process for<br />
              <span className="gradient-text-cyan">Exceptional Outcomes</span>
            </h2>
          </div>

          <div className="process-grid">
            {process.map((p, i) => (
              <div key={i} className="process-card">
                <div className="process-num">{p.num}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                {i < process.length - 1 && <div className="process-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ─────────────────────────────────────────── */}
      <section className="section why-section">
        <div className="container">
          <div className="why-inner">
            <div className="why-left">
              <div className="section-tag"><span className="dot"></span>Why KeplerX</div>
              <h2 className="section-title">
                We Don't Just Build.<br />
                <span className="gradient-text">We Weaponize Technology.</span>
              </h2>
              <p className="section-sub" style={{ marginTop: '20px' }}>
                The gap between the "AI-haves" and "AI-have-nots" is widening every day. 
                KeplerX bridges that gap with ruthless engineering efficiency and strategic foresight.
              </p>
              <Link to="/contact" className="btn-primary" style={{ marginTop: '32px' }}>
                <span>Book a Strategy Call</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="why-right">
              {[
                { icon: '🎯', title: 'Outcome-Driven', desc: 'Every sprint is tied to measurable business metrics. We track what matters.' },
                { icon: '🔒', title: 'Security-First', desc: 'SOC2-ready practices, zero-trust architecture, and compliance built in from day one.' },
                { icon: '⚡', title: 'Move Fast', desc: 'Lean teams, agile rituals, and AI-assisted development. We ship faster without cutting corners.' },
                { icon: '🤝', title: 'True Partnership', desc: 'Dedicated architects, weekly reviews, and complete IP ownership transfer to you.' },
              ].map((item, i) => (
                <div key={i} className="why-card">
                  <div className="why-icon">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot"></span>Client Stories</div>
            <h2 className="section-title">
              What Leaders Say<br />
              <span className="gradient-text">About Working With Us</span>
            </h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card glass-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.avatar}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-orb cta-orb-1"></div>
            <div className="cta-orb cta-orb-2"></div>
            <div className="cta-content">
              <h2>Ready to Build Something<br /><span className="gradient-text">Extraordinary?</span></h2>
              <p>Let's talk about your next platform, product, or system. No sales pitch — just an honest conversation about what's possible.</p>
              <div className="cta-actions">
                <Link to="/contact" className="btn-primary">
                  <span>Schedule a Call</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link to="/about" className="btn-secondary">
                  <span>Learn About Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;