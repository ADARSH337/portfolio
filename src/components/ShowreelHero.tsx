import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ShowreelHeroProps {
  name: string;
  role: string;
  tagline: string;
  videoUrl: string;
  onViewWorkClick: () => void;
  onConnectClick: () => void;
}

export const ShowreelHero: React.FC<ShowreelHeroProps> = ({
  name,
  role,
  tagline,
  videoUrl,
  onViewWorkClick,
  onConnectClick
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const rolesRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const rolesText = rolesRef.current;
    const taglineText = taglineRef.current;
    const buttons = buttonContainerRef.current;
    const scrollInd = scrollIndicatorRef.current;

    if (!title || !subtitle || !rolesText || !taglineText || !buttons || !scrollInd) return;

    // Reset initial states for reveal animation
    gsap.set(subtitle, { opacity: 0, y: 20 });
    gsap.set(rolesText, { opacity: 0, y: 20 });
    gsap.set(taglineText, { opacity: 0, y: 20 });
    gsap.set(buttons, { opacity: 0, y: 20 });
    gsap.set(scrollInd, { opacity: 0 });

    // Split title text for luxury character animation
    const chars = title.innerText.split('');
    title.innerHTML = chars
      .map(
        (char) =>
          `<span class="char-span" style="display: inline-block; opacity: 0; transform: translateY(30px);">${
            char === ' ' ? '&nbsp;' : char
          }</span>`
      )
      .join('');

    const titleChars = title.querySelectorAll('.char-span');

    // Sequence timeline
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .to(
        titleChars,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.03,
          ease: 'power3.out'
        },
        '-=0.3'
      )
      .to(rolesText, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .to(taglineText, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .to(buttons, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .to(scrollInd, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.2');

    // Smooth moving segment animation inside the vertical line indicator
    gsap.to(scrollInd.querySelector('.scroll-line-indicator'), {
      y: '100%',
      duration: 1.6,
      repeat: -1,
      ease: 'power2.inOut'
    });
  }, [name]);

  // Magnetic Button Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000'
      }}
    >
      {/* Looping video showreel backdrop */}
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            opacity: 0.35,
            zIndex: 1
          }}
          src={videoUrl}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)',
            opacity: 0.4,
            zIndex: 1
          }}
        />
      )}

      {/* Dark Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, transparent 20%, rgba(9,9,9,0.85) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Hero Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          maxWidth: '900px',
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginBottom: '18px',
            fontWeight: 500
          }}
        >
          — Portfolio &bull; {new Date().getFullYear()}
        </p>

        {/* Main Name Heading */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 'clamp(3rem, 9vw, 6.8rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            color: '#fff',
            marginBottom: '16px'
          }}
        >
          {name}
        </h1>

        {/* Roles Spaced Row */}
        <p
          ref={rolesRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginBottom: '16px'
          }}
        >
          {role.toUpperCase().split(',').map((r) => r.trim()).join(' \u2022 ')}
        </p>

        {/* Tagline */}
        <p
          ref={taglineRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: 'rgba(255, 255, 255, 0.5)',
            maxWidth: '600px',
            marginBottom: '40px',
            lineHeight: 1.5
          }}
        >
          {tagline}
        </p>

        {/* Action Buttons */}
        <div
          ref={buttonContainerRef}
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={onViewWorkClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="magnetic-btn interactive-card"
            style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600 }}
          >
            Explore Portfolio &rarr;
          </button>
          
          <button
            onClick={onConnectClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="magnetic-btn-outline interactive-card"
            style={{ fontWeight: 500 }}
          >
            Contact Me
          </button>
        </div>
      </div>

      {/* Elegant Vertical Line Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        onClick={onViewWorkClick}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
        className="interactive-card"
      >
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.12)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            className="scroll-line-indicator"
            style={{
              width: '100%',
              height: '35%',
              background: '#fff',
              position: 'absolute',
              top: '-35%'
            }}
          />
        </div>
      </div>
    </section>
  );
};
