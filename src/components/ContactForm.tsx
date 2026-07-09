import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../utils/db';
import type { ProfileSettings } from '../types';

interface ContactFormProps {
  profile: ProfileSettings;
}

export const ContactForm: React.FC<ContactFormProps> = ({ profile }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setStatus('idle');

    try {
      await db.sendMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Direct Contact Request',
        message: formData.message
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section" style={{ background: '#070707', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '80px' }} className="contact-grid">
          
          {/* Left Column: Direct Info & Social Connections */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px' }}>
            <div>
              <p className="section-subtitle">— Contact</p>
              <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, fontWeight: 300 }}>
                Let's create <br /><em>something amazing.</em>
              </h2>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '450px' }}>
              Have an idea for a project, need high-end commercial video editing, videography, or want to collaborate? Get in touch and let's start the discussion.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Email */}
              <a
                href={`mailto:${profile.email || 'hello@adarshkuncham.com'}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 400
                }}
                className="interactive-card social-row-link"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>{profile.email || 'hello@adarshkuncham.com'}</span>
                </div>
                <span className="arrow-hover" style={{ transition: 'transform 0.3s' }}>→</span>
              </a>

              {/* Instagram */}
              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 400
                  }}
                  className="interactive-card social-row-link"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span>Instagram</span>
                  </div>
                  <span className="arrow-hover" style={{ transition: 'transform 0.3s' }}>→</span>
                </a>
              )}

              {/* LinkedIn */}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 400
                  }}
                  className="interactive-card social-row-link"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    <span>LinkedIn</span>
                  </div>
                  <span className="arrow-hover" style={{ transition: 'transform 0.3s' }}>→</span>
                </a>
              )}

              {/* WhatsApp */}
              {profile.whatsapp && (
                <a
                  href={profile.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 400
                  }}
                  className="interactive-card social-row-link"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    <span>WhatsApp</span>
                  </div>
                  <span className="arrow-hover" style={{ transition: 'transform 0.3s' }}>→</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-panel" style={{ padding: '40px', background: 'rgba(20,20,20,0.5)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="name" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px 16px', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none' }}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="email" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px 16px', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none' }}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="subject" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px 16px', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none' }}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="message" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px 16px', color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical' }}
                  className="form-input"
                />
              </div>

              {/* Status indicators */}
              {status === 'success' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4caf50', fontSize: '0.9rem', background: 'rgba(76, 175, 80, 0.1)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                  <CheckCircle2 size={16} />
                  <span>Message sent successfully! Adarsh will get back to you soon.</span>
                </div>
              )}
              {status === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f44336', fontSize: '0.9rem', background: 'rgba(244, 67, 54, 0.1)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(244, 67, 54, 0.2)' }}>
                  <AlertCircle size={16} />
                  <span>Failed to send message. Please try again.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px 28px',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'opacity 0.3s, transform 0.2s',
                  opacity: loading ? 0.7 : 1
                }}
                className="interactive-card"
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
        }
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
        .form-input:focus {
          border-color: rgba(255,255,255,0.2) !important;
          background: rgba(255,255,255,0.04) !important;
        }
        .social-row-link {
          transition: border-color 0.3s, color 0.3s;
        }
        .social-row-link:hover {
          border-bottom-color: rgba(255, 255, 255, 0.2) !important;
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .social-row-link:hover .arrow-hover {
          transform: translateX(6px);
          color: #fff;
        }
      `}</style>
    </section>
  );
};
