import React from 'react';
import { Video, Camera, Film, MonitorPlay, Sparkles, Paintbrush, Clapperboard, Tv, Smartphone, Compass } from 'lucide-react';
import type { ServiceItem } from '../types';

interface ServicesProps {
  services: ServiceItem[];
}

export const Services: React.FC<ServicesProps> = ({ services }) => {
  // Map icons to services by title keyword matching
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('editing') && t.includes('commercial')) return <Clapperboard size={24} />;
    if (t.includes('editing')) return <Video size={24} />;
    if (t.includes('photography')) return <Camera size={24} />;
    if (t.includes('videography')) return <Film size={24} />;
    if (t.includes('graphics')) return <MonitorPlay size={24} />;
    if (t.includes('grading')) return <Paintbrush size={24} />;
    if (t.includes('film')) return <Tv size={24} />;
    if (t.includes('reels') || t.includes('shorts')) return <Smartphone size={24} />;
    if (t.includes('creation')) return <Sparkles size={24} />;
    return <Compass size={24} />;
  };

  return (
    <section id="services" className="section" style={{ background: '#090909', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div className="container">
        <p className="section-subtitle">What I Do</p>
        <h2 className="section-title">Creative Services</h2>

        {/* Editorial services grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '50px'
          }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="glass-panel interactive-card service-card"
              style={{
                padding: '40px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '8px',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s'
              }}
            >
              {/* Icon frame */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                {getIcon(service.title)}
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .service-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255,255,255,0.12) !important;
        }
      `}</style>
    </section>
  );
};
