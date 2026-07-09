import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import type { Project } from '../types';

interface PhotoGalleryProps {
  projects: Project[];
}

interface PhotoItem {
  url: string;
  title: string;
  category: string;
  year: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ projects }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Extract all gallery images from photography category projects
  useEffect(() => {
    const photoProjects = projects.filter(
      (p) => p.category.toLowerCase() === 'photography' && p.published
    );

    const items: PhotoItem[] = [];
    photoProjects.forEach((proj) => {
      // Add cover image
      if (proj.cover_image) {
        items.push({
          url: proj.cover_image,
          title: proj.title,
          category: proj.category,
          year: proj.year
        });
      }
      // Add other gallery images
      if (proj.gallery_images && proj.gallery_images.length > 0) {
        proj.gallery_images.forEach((imgUrl) => {
          items.push({
            url: imgUrl,
            title: proj.title,
            category: proj.category,
            year: proj.year
          });
        });
      }
    });

    // Fallback default photography items if database is empty
    if (items.length === 0) {
      const fallbackUrls = [
        'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1472214222541-d510753a4907?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop'
      ];
      const fallbacks = fallbackUrls.map((url, index) => ({
        url,
        title: `Exhibition Capture ${index + 1}`,
        category: 'Photography',
        year: '2026'
      }));
      setPhotos(fallbacks);
    } else {
      setPhotos(items);
    }
  }, [projects]);

  // Lightbox Keyboard Navigation Controls
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, photos]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1));
  };

  return (
    <section id="photography" className="section" style={{ background: '#090909' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div>
            <p className="section-subtitle">— Photography</p>
            <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, fontWeight: 300 }}>
              Frames, still <br /><em>and quiet.</em>
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.95rem', lineHeight: 1.6, paddingBottom: '10px' }}>
            Click any image for a fullscreen view. Use arrow keys to move.
          </p>
        </div>

        {/* Masonry Columns Grid Layout */}
        <div className="masonry-grid" style={{ marginTop: '50px' }}>
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className="masonry-item interactive-card"
              onClick={() => setActiveIdx(idx)}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                marginBottom: '20px',
                breakInside: 'avoid'
              }}
            >
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                style={{
                  width: '100%',
                  display: 'block',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s'
                }}
                className="masonry-image"
              />

              {/* Floating Overlay Captions */}
              <div
                className="masonry-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                  opacity: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px',
                  transition: 'opacity 0.4s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600, marginBottom: '2px' }}>
                      {photo.title}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                      {photo.year}
                    </p>
                  </div>
                  <Maximize2 size={16} color="#fff" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Overlay Modal */}
      {activeIdx !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 5, 5, 0.98)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)'
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveIdx(null)}
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
              zIndex: 2001
            }}
            className="interactive-card"
          >
            <X size={20} />
          </button>

          {/* Navigation Prev Button */}
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '3vw',
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
              zIndex: 2001
            }}
            className="interactive-card"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Image Display */}
          <div style={{ maxWidth: '85vw', maxHeight: '80vh', textAlign: 'center', position: 'relative' }}>
            <img
              src={photos[activeIdx].url}
              alt={photos[activeIdx].title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '4px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.9)'
              }}
            />
            <div style={{ marginTop: '20px', color: '#fff' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{photos[activeIdx].title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                {photos[activeIdx].category} &bull; {photos[activeIdx].year}
              </p>
            </div>
          </div>

          {/* Navigation Next Button */}
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '3vw',
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
              zIndex: 2001
            }}
            className="interactive-card"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Styled Grid layout */}
      <style>{`
        .masonry-grid {
          column-count: 3;
          column-gap: 20px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .masonry-grid {
            column-count: 2;
          }
        }
        @media (max-width: 600px) {
          .masonry-grid {
            column-count: 1;
          }
        }
        .masonry-item:hover .masonry-image {
          transform: scale(1.04);
          filter: brightness(0.85);
        }
        .masonry-item:hover .masonry-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
};
