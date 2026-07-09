import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { isMockMode } from '../supabaseClient';

interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Showcase', value: 'home' },
    { label: 'Featured Work', value: 'work' },
    { label: 'Photography', value: 'photography' },
    { label: 'Videography', value: 'videography' },
    { label: 'About', value: 'about' },
    { label: 'Services', value: 'services' },
    { label: 'Contact', value: 'contact' }
  ];

  const handleNavClick = (value: string) => {
    onNavigate(value);
    setMobileMenuOpen(false);
    
    // Smooth scroll to section
    const targetElement = document.getElementById(value);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-4 bg-[#090909]/70 backdrop-blur-md border-b border-white/5'
            : 'py-6 bg-transparent'
        }`}
        style={{
          transition: 'padding 0.3s ease, background-color 0.3s ease, border-bottom 0.3s ease'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo / Brand Name */}
          <div
            onClick={() => handleNavClick('home')}
            style={{
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            className="interactive-card"
          >
            ADARSH KUNCHAM
            {isMockMode && (
              <span 
                style={{ 
                  fontSize: '0.65rem', 
                  background: 'rgba(255, 170, 0, 0.1)', 
                  color: '#ffa500', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 170, 0, 0.2)'
                }}
                title="Supabase credentials not configured. Running locally with browser memory."
              >
                LOCAL PREVIEW
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentSection === item.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  padding: '4px 0',
                  borderBottom: currentSection === item.value ? '1px solid #fff' : '1px solid transparent',
                  transition: 'color 0.3s, border-bottom 0.3s'
                }}
                className="interactive-card"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('cms')}
              style={{
                padding: '8px 18px',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '100px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'background-color 0.3s, border-color 0.3s'
              }}
              className="interactive-card cms-portal-btn"
            >
              Studio CMS
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="mobile-toggle" style={{ display: 'none' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#090909',
            zIndex: 49,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px'
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => handleNavClick(item.value)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontFamily: 'var(--font-title)',
                fontSize: '2rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('cms');
              setMobileMenuOpen(false);
            }}
            style={{
              padding: '12px 30px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '100px',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Studio CMS
          </button>
        </div>
      )}

      {/* Inline styles for responsive layout details */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
        .cms-portal-btn:hover {
          background-color: #ffffff !important;
          color: #000000 !important;
          border-color: #ffffff !important;
        }
      `}</style>
    </>
  );
};
