import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, Calendar, User, Film } from 'lucide-react';
import type { Project } from '../types';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface StackedFramesGalleryProps {
  projects: Project[];
}

export const StackedFramesGallery: React.FC<StackedFramesGalleryProps> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Set up cards scatter and scroll trigger shuffling
  useEffect(() => {
    if (projects.length === 0) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    // Set initial scatter settings
    cards.forEach((card, index) => {
      // Alternate offsets and angles for realistic desk scatter
      const angle = index % 2 === 0 ? -4 - index : 3 + index;
      gsap.set(card, {
        rotate: angle,
        z: 0
      });
    });

    // Desktop only scroll-shuffling animation
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) return;

      // Pin the section and scatter the cards on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      });

      // Shift positions as we scroll
      tl.to(cards[0], { xPercent: -20, yPercent: -15, rotate: -12, ease: 'power1.inOut' }, 0)
        .to(cards[1], { xPercent: 20, yPercent: -18, rotate: 10, ease: 'power1.inOut' }, 0)
        .to(cards[2], { xPercent: -25, yPercent: 22, rotate: 8, ease: 'power1.inOut' }, 0)
        .to(cards[3], { xPercent: 25, yPercent: 25, rotate: -9, ease: 'power1.inOut' }, 0)
        .to(cards[4] || null, { yPercent: -5, rotate: -2, ease: 'power1.inOut' }, 0);
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [projects]);

  // Card Mouse Interaction: Lift, Tilt and Float on Hover
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    
    // Scale up, straighten rotation, increase shadow depth, and put on top
    gsap.to(card, {
      scale: 1.05,
      rotate: 0,
      z: 50,
      boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.4)',
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Calculate relative mouse coordinates (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Apply 3D perspective tilt
    gsap.to(card, {
      rotateX: -y * 15,
      rotateY: x * 15,
      transformPerspective: 1000,
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const angle = index % 2 === 0 ? -4 - index : 3 + index;

    // Reset back to original scattered state
    gsap.to(card, {
      scale: 1,
      rotate: angle,
      rotateX: 0,
      rotateY: 0,
      z: 0,
      boxShadow: '0 15px 35px rgba(0,0,0,0.5), 0 3px 10px rgba(0,0,0,0.3)',
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  };

  return (
    <div ref={containerRef} style={{ background: '#070707' }}>
      {/* Scroll Trigger Pin Element */}
      <div ref={triggerRef} id="work" className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, pointerEvents: 'none', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <p className="section-subtitle">— Featured Work</p>
            <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, fontWeight: 300 }}>
              A desk of <br /><em>selected frames.</em>
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.95rem', lineHeight: 1.6, paddingBottom: '10px' }}>
            Move your cursor across the stack. Each frame is a story — click to open the full project.
          </p>
        </div>

        {/* Scattered Deck Container */}
        <div
          className="deck-container"
          style={{
            position: 'relative',
            width: '100%',
            height: '600px',
            maxWidth: '1400px',
            margin: '0 auto'
          }}
        >
          {projects.slice(0, 5).map((project, idx) => {
            // Distinct absolute positions for the scattered style
            const positions = [
              { left: '8%', top: '8%', width: '320px' },   // Top Left
              { right: '10%', top: '4%', width: '330px' },  // Top Right
              { left: '5%', bottom: '8%', width: '300px' }, // Bottom Left
              { right: '8%', bottom: '5%', width: '340px' }, // Bottom Right
              { left: '38%', top: '22%', width: '360px' }   // Center Card
            ];

            return (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={(e) => handleMouseLeave(e, idx)}
                onClick={() => setSelectedProject(project)}
                className="project-frame interactive-card"
                style={{
                  position: 'absolute',
                  ...positions[idx],
                  background: '#141414',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '4px',
                  padding: '16px 16px 24px 16px',
                  cursor: 'pointer',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.5), 0 3px 10px rgba(0,0,0,0.3)',
                  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                  zIndex: idx === 4 ? 5 : 2
                }}
              >
                {/* Media Container inside Card */}
                <div
                  style={{
                    width: '100%',
                    height: '240px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    background: '#090909',
                    position: 'relative',
                    marginBottom: '16px'
                  }}
                >
                  {/* Always show cover image */}
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'grayscale(0.15) contrast(1.05)',
                      transition: 'opacity 0.4s ease, transform 0.5s ease',
                      position: project.video_url ? 'absolute' : 'relative',
                      top: 0,
                      left: 0,
                      zIndex: 1
                    }}
                    className="card-image"
                  />
                  {/* If project has video, show video that plays on hover */}
                  {project.video_url && (
                    <video
                      src={project.video_url}
                      muted
                      playsInline
                      loop
                      preload="none"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        opacity: 0,
                        transition: 'opacity 0.5s ease'
                      }}
                      className="card-video"
                      onMouseEnter={(e) => {
                        const v = e.currentTarget;
                        v.play();
                        v.style.opacity = '1';
                        const img = v.previousElementSibling as HTMLElement;
                        if (img) img.style.opacity = '0';
                      }}
                      onMouseLeave={(e) => {
                        const v = e.currentTarget;
                        v.pause();
                        v.style.opacity = '0';
                        const img = v.previousElementSibling as HTMLElement;
                        if (img) img.style.opacity = '1';
                      }}
                    />
                  )}
                  {/* Film badge for video projects */}
                  {project.video_url && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(9,9,9,0.7)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 3
                      }}
                    >
                      <Film size={14} color="#fff" />
                    </div>
                  )}
                </div>

                {/* Typography info inside card */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-body)', color: '#fff', marginBottom: '4px' }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      {project.category}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-title)', fontWeight: 'bold', color: 'rgba(255,255,255,0.3)', padding: '2px 0' }}>
                    {project.year}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Detail View Sheet */}
      {selectedProject && (
        <div
          className="fullscreen-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 5, 5, 0.96)',
            zIndex: 1000,
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            padding: '40px 20px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1000px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Top Bar with Title & Close button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                  {selectedProject.category}
                </span>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#fff', marginTop: '4px' }}>
                  {selectedProject.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'background-color 0.3s'
                }}
                className="interactive-card"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1 })}
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Player or Cover Image Hero */}
            {selectedProject.video_url ? (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#000',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                  position: 'relative'
                }}
              >
                {/* Embed Video Support */}
                {selectedProject.video_url.includes('youtube.com') || selectedProject.video_url.includes('youtu.be') ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      selectedProject.video_url.split('v=')[1] || selectedProject.video_url.split('/').pop()
                    }`}
                    title={selectedProject.title}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedProject.video_url.includes('vimeo.com') ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${selectedProject.video_url.split('/').pop()}`}
                    title={selectedProject.title}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  // Direct HTML5 MP4 video
                  <video
                    src={selectedProject.video_url}
                    controls
                    autoPlay
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
            ) : (
              <img
                src={selectedProject.cover_image}
                alt={selectedProject.title}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  maxHeight: '550px',
                  objectFit: 'cover',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
                }}
              />
            )}

            {/* Metadata Info Panel & Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }} className="modal-meta-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  Project Description
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
                  {selectedProject.description}
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  height: 'fit-content'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User size={16} color="rgba(255,255,255,0.4)" />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>CLIENT</p>
                    <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{selectedProject.client || 'N/A'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={16} color="rgba(255,255,255,0.4)" />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>YEAR</p>
                    <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{selectedProject.year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For VIDEO projects: show additional video clips */}
            {selectedProject.video_url && (() => {
              const moreVideos = [
                { label: 'Cinematic Edit #1', src: '/videos/lv_0_20260120180138.mp4' },
                { label: 'Cinematic Edit #2', src: '/videos/lv_0_20260126135646.mp4' },
                { label: 'Cinematic Edit #3', src: '/videos/lv_0_20260202222732.mp4' },
                { label: 'Short Reel #1', src: '/videos/copy_of_lv_0_20250831225800.mp4' },
                { label: 'Short Reel #2', src: '/videos/copy_of_lv_0_20251115032832.mp4' },
                { label: 'Short Reel #3', src: '/videos/copy_of_0926.mp4' },
                { label: 'Clip #1', src: '/videos/lv_7356006639524121874_20260118235238.mp4' },
                { label: 'Clip #2', src: '/videos/lv_7529031899897974069_20260119001419.mp4' },
                { label: 'Clip #3', src: '/videos/lv_7578525938837785861_20260119000349.mp4' },
              ].filter(v => v.src !== selectedProject.video_url);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', fontFamily: 'var(--font-serif)', fontWeight: 300 }}>
                    More Edits
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    {moreVideos.slice(0, 6).map((clip, i) => (
                      <div
                        key={i}
                        style={{
                          borderRadius: '6px',
                          overflow: 'hidden',
                          aspectRatio: '16/9',
                          background: '#0a0a0a',
                          border: '1px solid rgba(255,255,255,0.05)',
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                      >
                        <video
                          src={clip.src}
                          muted
                          playsInline
                          loop
                          preload="none"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                          onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                        />
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                          padding: '12px 10px 8px',
                          fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)'
                        }}>
                          {clip.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* For PHOTOGRAPHY projects: photo gallery grid */}
            {!selectedProject.video_url && selectedProject.gallery_images && selectedProject.gallery_images.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', fontFamily: 'var(--font-serif)', fontWeight: 300 }}>
                  Photo Gallery
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {selectedProject.gallery_images.map((img, i) => (
                    <div
                      key={i}
                      style={{
                        borderRadius: '4px',
                        overflow: 'hidden',
                        aspectRatio: '3/2',
                        background: '#111',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <img
                        src={img}
                        alt={`${selectedProject.title} photo ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inline animations and responsive styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 1024px) {
          .deck-container {
            display: flex !important;
            flex-direction: column !important;
            height: auto !important;
            gap: 24px !important;
            padding: 0 4vw !important;
          }
          .project-frame {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            right: auto !important;
            bottom: auto !important;
            width: 100% !important;
            margin-bottom: 0 !important;
            transform: none !important;
          }
          .modal-meta-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
        .project-frame:hover .card-image {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
};
