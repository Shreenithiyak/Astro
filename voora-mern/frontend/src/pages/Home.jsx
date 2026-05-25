import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { submitEnquiry } from '../api';

const PROJECTS = [
  { num: '01', type: 'Luxury · ECR · Sea Facing', name: 'Voora One Sea', loc: 'ECR, Chennai', price: '₹7,199 / sqft', tags: ['3, 4, 5 BHK', 'IGBC Gold', 'Ongoing'], image: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80' },
  { num: '02', type: 'Apartments · Ramapuram · Smart Living', name: 'Voora Westside', loc: 'Ramapuram, Chennai', price: 'From ₹1 Cr', tags: ['2 & 3 BHK', 'Smart Home', 'Ongoing'], image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80' },
  { num: '03', type: 'Luxury · Tondiarpet · Sea Facing', name: 'Voora Agastya', loc: 'Tondiarpet, Chennai', price: 'From ₹2.3 Cr', tags: ['3 & 4 BHK', 'Sea View', 'Ongoing'], image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
  { num: '04', type: 'Plots · Kanchipuram · NH48', name: 'Voora Highway Haven', loc: 'Panapakkam, Kanchipuram', price: '₹1,500 / sq.ft', tags: ['DTCP Approved', 'RERA', 'Gated Community'], image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' }
];

const PROJECT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80';

export default function Home() {
  const curRef = useRef(null);
  const curRingRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', interestedProject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Cursor
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (curRef.current) curRef.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    const anim = () => {
      rx += (mx - rx) * .11;
      ry += (my - ry) * .11;
      if (curRingRef.current) curRingRef.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(anim);
    };
    document.addEventListener('mousemove', onMove);
    anim();

    // Scroll nav
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);

    // Reveal
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('vis'), i * 90);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    return () => {
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async () => {
    const { fullName, phone, email, interestedProject } = form;
    if (!fullName || !phone || !email || !interestedProject) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitEnquiry(form);
      if (res.data.success) {
        showToast('🏗️ Enquiry submitted! We\'ll contact you soon.');
        setForm({ fullName: '', phone: '', email: '', interestedProject: '', message: '' });
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Submission failed. Please try again.', 'error');
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="cur" ref={curRef} id="cur" />
      <div className="cur-ring" ref={curRingRef} id="curR" />

      {/* NAV */}
      <nav id="nav" className={navScrolled ? 'scrolled' : ''}>
        <a href="/" className="logo">VOORA<small>CONSTRUCTION & REAL ESTATE</small></a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#why">Why Us</a>
          <a href="#testi">Stories</a>
          <a href="#contact">Contact</a>
        </div>
        <Link to="/admin" className="nav-btn">Admin Panel</Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <svg className="hero-skyline" viewBox="0 0 1440 300" xmlns="http://www.w3.org/2000/svg" fill="rgba(201,168,76,0.5)">
          <rect x="0" y="100" width="80" height="200"/>
          <rect x="90" y="60" width="60" height="240"/>
          <rect x="160" y="20" width="100" height="280"/>
          <rect x="270" y="80" width="50" height="220"/>
          <rect x="330" y="40" width="70" height="260"/>
          <rect x="410" y="100" width="90" height="200"/>
          <rect x="510" y="10" width="60" height="290"/>
          <rect x="580" y="60" width="80" height="240"/>
          <rect x="670" y="30" width="120" height="270"/>
          <rect x="800" y="90" width="70" height="210"/>
          <rect x="880" y="50" width="50" height="250"/>
          <rect x="940" y="70" width="100" height="230"/>
          <rect x="1050" y="20" width="80" height="280"/>
          <rect x="1140" y="80" width="60" height="220"/>
          <rect x="1210" y="40" width="90" height="260"/>
          <rect x="1310" y="100" width="130" height="200"/>
        </svg>
        <div className="hero-vline" />
        <div className="hero-hline" />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-tag"><span className="hero-tag-line" />SINCE 1994 · CHENNAI'S FINEST BUILDERS</div>
          <h1>Building <em>Legacy,</em><br />Crafting <em>Homes</em></h1>
          <p className="hero-sub">Three decades of landmark construction across Chennai — luxury residences, sea-facing apartments, and premium plots designed for generations.</p>
          <div className="hero-actions">
            <button className="btn-gold" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Book Free Site Visit</button>
            <button className="btn-ghost" onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>View Projects</button>
          </div>
        </div>
        <div className="hero-stats">
          {[['30+', 'Years Legacy'], ['265+', 'Quality Checks'], ['1000+', 'Happy Families'], ['20 Yr', 'Warranty']].map(([n, t]) => (
            <div key={t} className="stat-block"><div className="stat-num">{n}</div><div className="stat-txt">{t}</div></div>
          ))}
        </div>
        <div className="scroll-ind"><span>SCROLL</span><div className="scroll-bar" /></div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-inner">
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ display: 'inline-flex', gap: 0 }}>
              {['Voora One Sea', 'IGBC Gold Certified', 'Voora Westside', '20-Year Warranty', 'Voora Agastya', 'RERA Approved', 'Highway Haven', '30+ Years Legacy'].map((t, j) => (
                <span key={j} className="marquee-item">{t} <span className="marquee-dot">✦</span></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="reveal">
          <div className="about-img">
            <div className="about-img-overlay" />
            <img src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80" alt="Construction site with workers and equipment" />
          </div>
        </div>
        <div className="about-body reveal reveal-delay-1">
          <div className="sec-label">About Voora</div>
          <h2 className="sec-title">Chennai's <em>Most</em><br />Trusted Builder</h2>
          <div className="gold-rule" />
          <p>For over three decades, Voora Construction has been synonymous with trust, quality, and timeless design. From the shores of ECR to the heart of Nungambakkam, our projects stand as landmarks of excellence.</p>
          <p>We are India's first builder to offer a 20-year structural warranty — a testament to our unwavering commitment to quality and customer satisfaction.</p>
          <div className="about-features">
            {[['IGBC', 'Gold Rated'], ['RERA', 'Certified'], ['265+', 'Quality Points'], ['1000+', 'Families']].map(([n, l]) => (
              <div key={l} className="af-item"><div className="af-num">{n}</div><div className="af-label">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects" id="projects">
        <div className="proj-header reveal">
          <div>
            <div className="sec-label">Our Portfolio</div>
            <h2 className="sec-title">Signature <em>Projects</em></h2>
          </div>
          <div className="gold-rule" style={{ margin: 0, alignSelf: 'flex-end' }} />
        </div>
        <div className="proj-grid">
          {PROJECTS.map((p, i) => (
            <div key={p.name} className={`proj-card reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
              <img
                className="proj-card-img"
                src={p.image}
                alt={p.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PROJECT_IMAGE_FALLBACK;
                }}
              />
              <div className="proj-overlay" />
              <div className="proj-geo"><div className="proj-num">{p.num}</div></div>
              <div className="proj-arrow">↗</div>
              <div className="proj-inner">
                <div className="proj-type">{p.type}</div>
                <div className="proj-name">{p.name}</div>
                <div className="proj-loc">📍 {p.loc}</div>
                <div className="proj-price">{p.price}</div>
                <div className="proj-tags">{p.tags.map(t => <span key={t} className="proj-tag">{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="why" id="why">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 0 }}>
          <div className="sec-label" style={{ textAlign: 'center' }}>Why Choose Us</div>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>The Voora <em>Promise</em></h2>
        </div>
        <div className="why-grid">
          {[
            ['🏆', '30+ Years Legacy', 'Three decades of delivering landmark projects across Chennai — trust earned, never assumed.'],
            ['🌿', 'IGBC Gold Rated', 'Eco-certified green homes with 1000+ trees, water conservation and energy-efficient design.'],
            ['🔒', '20-Year Warranty', "India's first 20-year structural warranty. 10-year warranty on fittings — built to last generations."],
            ['⏱', 'On-Time Delivery', '265+ quality checkpoints. Stringent project management ensures your home is delivered as promised.']
          ].map(([icon, title, desc], i) => (
            <div key={title} className={`why-card reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
              <div className="why-num">0{i + 1}</div>
              <span className="why-icon">{icon}</span>
              <div className="why-title">{title}</div>
              <div className="why-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testi" id="testi">
        <div className="reveal">
          <div className="sec-label">Happy Families</div>
          <h2 className="sec-title">Client <em>Stories</em></h2>
          <div className="gold-rule" />
        </div>
        <div className="testi-grid">
          {[
            ['Ramesh Krishnamurthy', 'Voora One Sea · ECR', 'The sea view from Voora One Sea is breathtaking. The quality of construction, transparency, and timely updates gave us complete confidence.'],
            ['Priya Subramaniam', 'Voora Westside · Ramapuram', "Westside's zero dead space design and smart home integration was exactly what our family needed. Premium quality at excellent value."],
            ['Anand Venkatesh', 'Highway Haven · Kanchipuram', "Invested in Highway Haven plots for the NH48 connectivity and growth potential. Voora's 30-year reputation and DTCP approval made the decision easy."]
          ].map(([name, proj, text], i) => (
            <div key={name} className={`testi-card reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">"{text}"</p>
              <div className="testi-name">{name}</div>
              <div className="testi-proj">{proj}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="contact-glow" />
        <div className="sec-label reveal" style={{ marginBottom: 18 }}>Get In Touch</div>
        <h2 className="reveal"><em>Begin Your</em><br />Journey</h2>
        <p className="contact-sub reveal">Book a free site visit — our team is ready to guide you</p>
        <div className="contact-grid">
          <div className="reveal">
            {[
              ['Address', 'Chennai, Tamil Nadu, India'],
              ['Website', 'www.voora.co.in'],
              ['Projects', 'ECR · Ramapuram · Tondiarpet · Kanchipuram · Nungambakkam'],
              ['For NRI Buyers', 'Dedicated NRI assistance available']
            ].map(([label, val]) => (
              <div key={label} className="contact-info-block">
                <div className="ci-label">{label}</div>
                <div className="ci-val">{val}</div>
              </div>
            ))}
          </div>
          <div className="reveal reveal-delay-1">
            <div className="form-row">
              <div className="f-group">
                <label className="f-label">Full Name *</label>
                <input className="f-input" type="text" placeholder="Your name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="f-group">
                <label className="f-label">Phone *</label>
                <input className="f-input" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="f-group">
              <label className="f-label">Email *</label>
              <input className="f-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="f-group">
              <label className="f-label">Interested Project *</label>
              <select className="f-select" value={form.interestedProject} onChange={e => setForm({ ...form, interestedProject: e.target.value })}>
                <option value="">Select a project</option>
                <option>Voora One Sea — ECR (₹7,199/sqft)</option>
                <option>Voora Westside — Ramapuram (From ₹1 Cr)</option>
                <option>Voora Agastya — Tondiarpet (From ₹2.3 Cr)</option>
                <option>Voora Beckford — Nungambakkam</option>
                <option>Voora Highway Haven — Kanchipuram Plots</option>
                <option>Other / Not sure</option>
              </select>
            </div>
            <div className="f-group">
              <label className="f-label">Message</label>
              <textarea className="f-area" placeholder="Tell us about your requirements..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Book Free Site Visit →'}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">VOORA</div>
        <div className="footer-copy">© 2025 Voora Construction & Real Estate · All Rights Reserved</div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Disclaimer</a>
          <a href="#">Careers</a>
          <a href="https://voora.co.in" target="_blank" rel="noreferrer">Visit Site</a>
        </div>
      </footer>

      <a className="wa" href="https://wa.me/914400000000" title="WhatsApp">💬</a>

      {toast && <div className={`toast${toast.type === 'error' ? ' error' : ''}`}>{toast.msg}</div>}
    </>
  );
}
