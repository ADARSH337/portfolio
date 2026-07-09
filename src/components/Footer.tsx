import React from 'react';

interface FooterProps {
  email?: string;
}

export const Footer: React.FC<FooterProps> = ({ email }) => {
  const mailToLink = email ? `mailto:${email}` : 'mailto:kunchamadarsh2006@gmail.com';

  return (
    <footer
      style={{
        background: '#090909',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        padding: '60px 0 40px 0',
        color: 'var(--text-secondary)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '30px'
          }}
        >
          {/* Brand branding */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: '#fff', letterSpacing: '-0.01em', marginBottom: '8px' }}>
              Adarsh <em>Kuncham</em>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              Video &bull; Photography &bull; Story
            </p>
          </div>

          {/* Navigation links and mail button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }} className="footer-right">
            <div style={{ display: 'flex', gap: '24px' }} className="footer-links">
              {['Work', 'Photography', 'Videography', 'About', 'Contact'].map((label) => {
                const sectionId = label.toLowerCase() === 'work' ? 'work' : label.toLowerCase();
                return (
                  <button
                    key={label}
                    onClick={() => {
                      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      transition: 'color 0.3s'
                    }}
                    className="interactive-card footer-nav-btn"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            
            <a
              href={mailToLink}
              className="interactive-card"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background-color 0.3s, border-color 0.3s'
              }}
              title="Send Mail"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
