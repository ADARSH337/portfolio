import React, { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';
import type { Project } from '../types';

interface VideoGalleryProps {
  projects: Project[];
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ projects }) => {
  const [videoProjects, setVideoProjects] = useState<Project[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    // Filter projects containing a video URL
    const items = projects.filter((p) => p.video_url && p.published);
    
    if (items.length === 0) {
      // Fallback default videos
      const fallbackProjects: Project[] = [
        {
          id: 'v1',
          title: 'Cinematic Forest Flight',
          slug: 'cinematic-forest-flight',
          description: 'A cinematic drone film studying the fog-shrouded morning mist and towering pine trees.',
          category: 'Videography',
          client: 'Visual Explorers',
          year: '2025',
          cover_image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop',
          gallery_images: [],
          video_url: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-fog-shrouded-pine-forest-41982-large.mp4',
          featured: true,
          published: true
        },
        {
          id: 'v2',
          title: 'Instapage Campaign Ad',
          slug: 'instapage-campaign-ad',
          description: 'Brand landing page commercial mockups and transition motion graphics.',
          category: 'Commercial',
          client: 'Instapage Corp',
          year: '2025',
          cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
          gallery_images: [],
          video_url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-three-smartphones-with-mockup-screens-on-table-41618-large.mp4',
          featured: true,
          published: true
        },
        {
          id: 'v3',
          title: 'Social App UI Concept',
          slug: 'social-app-ui-concept',
          description: 'A mobile application visual campaign edit focused on typography and fast pacing.',
          category: 'Social Media',
          client: 'Tech Startups',
          year: '2026',
          cover_image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop',
          gallery_images: [],
          video_url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-displaying-mockup-app-profile-42861-large.mp4',
          featured: true,
          published: true
        }
      ];
      setVideoProjects(fallbackProjects);
    } else {
      setVideoProjects(items);
    }
  }, [projects]);

  const handleMouseEnter = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  // Helper to detect if a URL is direct video file (MP4) vs embed
  const isDirectMp4 = (url: string) => {
    return url.endsWith('.mp4') || url.includes('/videos/') || url.includes('.mov') || url.includes('.webm');
  };

  return (
    <section id="videography" className="section" style={{ background: '#070707' }}>
      <div className="container">
        <p className="section-subtitle">Motion</p>
        <h2 className="section-title">Videography</h2>

        {/* Video Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '30px',
            marginTop: '50px'
          }}
        >
          {videoProjects.map((proj) => {
            const hasDirectVideo = isDirectMp4(proj.video_url);

            return (
              <div
                key={proj.id}
                onMouseEnter={() => hasDirectVideo && handleMouseEnter(proj.id)}
                onMouseLeave={() => hasDirectVideo && handleMouseLeave(proj.id)}
                onClick={() => setActiveVideo(proj.video_url)}
                className="video-card interactive-card"
                style={{
                  background: '#141414',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-premium)'
                }}
              >
                {/* Media frame */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    overflow: 'hidden',
                    background: '#000'
                  }}
                >
                  {/* Direct video player for hover autoplay */}
                  {hasDirectVideo ? (
                    <video
                      ref={(el) => { videoRefs.current[proj.id] = el; }}
                      src={proj.video_url}
                      muted
                      loop
                      playsInline
                      poster={proj.cover_image}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="grid-video"
                    />
                  ) : (
                    // Fallback cover image for embeds
                    <img
                      src={proj.cover_image}
                      alt={proj.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="grid-cover"
                    />
                  )}

                  {/* Dark overlay */}
                  <div
                    className="video-hover-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(9, 9, 9, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <div
                      className="play-icon-circle"
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000000',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                    >
                      <Play size={20} fill="#000" />
                    </div>
                  </div>

                  {/* Floating category tag */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(9,9,9,0.7)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--text-primary)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      zIndex: 3
                    }}
                  >
                    {proj.category}
                  </div>
                </div>

                {/* Card Title Details */}
                <div style={{ padding: '20px', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {proj.description.length > 90 ? proj.description.substring(0, 90) + '...' : proj.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Video Player Lightbox */}
      {activeVideo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 5, 5, 0.98)',
            zIndex: 3000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)'
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveVideo(null)}
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
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
              zIndex: 3001
            }}
            className="interactive-card"
          >
            <X size={20} />
          </button>

          {/* Expanded Video container */}
          <div style={{ width: '85vw', aspectRatio: '16/9', maxWidth: '1200px', background: '#000', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}>
            {activeVideo.includes('youtube.com') || activeVideo.includes('youtu.be') ? (
              <iframe
                src={`https://www.youtube.com/embed/${
                  activeVideo.split('v=')[1] || activeVideo.split('/').pop()
                }?autoplay=1`}
                title="Youtube video player"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : activeVideo.includes('vimeo.com') ? (
              <iframe
                src={`https://player.vimeo.com/video/${activeVideo.split('/').pop()}?autoplay=1`}
                title="Vimeo video player"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={activeVideo}
                controls
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}
          </div>
        </div>
      )}

      {/* Interactive hover overrides */}
      <style>{`
        .video-card:hover .grid-video {
          transform: scale(1.05);
        }
        .video-card:hover .grid-cover {
          transform: scale(1.05);
        }
        .video-card:hover .video-hover-overlay {
          background-color: rgba(9, 9, 9, 0.15) !important;
        }
        .video-card:hover .play-icon-circle {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
};
