import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import type { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    // Automatic slide transition every 6s
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  };

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section" style={{ background: '#090909', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p className="section-subtitle">Endorsements</p>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '60px' }}>What Clients Say</h2>

        {/* Carousel Slide Wrapper */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            minHeight: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {testimonials.map((t, index) => {
            const isActive = index === activeIdx;

            return (
              <div
                key={t.id}
                className="glass-panel"
                style={{
                  position: 'absolute',
                  width: '100%',
                  opacity: isActive ? 1 : 0,
                  visibility: isActive ? 'visible' : 'hidden',
                  transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease, visibility 0.6s',
                  padding: '50px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  background: 'rgba(20, 20, 20, 0.4)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '16px'
                }}
              >
                {/* Quote Icon overlay */}
                <div style={{ color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '24px', right: '30px' }}>
                  <Quote size={80} />
                </div>

                {/* Star Ratings */}
                <div style={{ display: 'flex', gap: '4px', color: '#ffc107', zIndex: 2 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#ffc107" />
                  ))}
                </div>

                {/* Testimonial body */}
                <p
                  style={{
                    fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                    lineHeight: 1.7,
                    color: '#ffffff',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    zIndex: 2
                  }}
                >
                  "{t.content}"
                </p>

                {/* Reviewer Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2 }}>
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.95rem'
                      }}
                    >
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{t.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {t.role} {t.company ? `at ${t.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel controls */}
        {testimonials.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '40px' }}>
            <button
              onClick={handlePrev}
              className="interactive-card"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.15)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'background-color 0.3s'
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="interactive-card"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
