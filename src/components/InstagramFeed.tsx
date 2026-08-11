import React, { useEffect, useRef } from "react";

// Real Cloudinary CDN photos and video reels from the user's uploaded collection
const INSTA_POSTS = [
  { src: "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429220/sun_1.jpg", caption: "Golden hour magic 🌅 #CineFrame #Sunset", likes: 312, span: "tall", type: "image" },
  { src: "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429223/gaintwheel.jpg", video: "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428533/NUMAISH_4K.mp4", caption: "Giant Wheel @ Numaish 4K 🎡 #Numaish #NightLife #4KFilm", likes: 487, span: "wide", type: "video" },
  { src: "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428751/sky_6.jpg", caption: "Sky aesthetics ☁️ #GoldenHour #Clouds", likes: 203, span: "normal", type: "image" },
  { src: "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428751/rainbow_1.jpg", caption: "Double rainbow in the sky 🌈 #CinematicFrames #AKCineFrame", likes: 276, span: "normal", type: "image" },
  { src: "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429214/thunder_3.jpg", caption: "Monsoon electrical skies ⚡ #Lightning #NightShot", likes: 391, span: "tall", type: "image" },
  { src: "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786429375/game.jpg", video: "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786429375/game.mp4", caption: "Shadow Beast Gaming Montage 🔥 #GamingReels #BeatSync", likes: 624, span: "normal", type: "video" },
  { src: "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428753/bike_2.jpg", video: "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428424/bike.mp4", caption: "Speed & Steel — Motorcycle Motion 🏍️ #AKCineFrame", likes: 450, span: "wide", type: "video" },
  { src: "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429210/moon_2.jpg", caption: "Moonlight silhouette 🌙 #VisualStory #NightPhotography", likes: 418, span: "normal", type: "image" },
  { src: "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428400/gym3.jpg", video: "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428400/gym3.mp4", caption: "Discipline & Strength — Commercial Cut 💪 #FitnessFilm", likes: 532, span: "normal", type: "video" },
  { src: "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429241/street_photo.jpg", caption: "Urban textures & architectural light 🏙️ #StreetPhotography", likes: 215, span: "normal", type: "image" },
  { src: "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429225/sun_4.jpg", caption: "Sunset hues over the horizon 🌇 #GoldenHourFrames", likes: 368, span: "wide", type: "image" },
  { src: "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428758/camara_2.jpg", caption: "Behind the lens creating memories 📸 #PhotographyLife", likes: 298, span: "normal", type: "image" }
];

const IG_URL = "https://www.instagram.com/ak.cineframe?igsh=MW0wcXp6MWFpbzd0&utm_source=qr";

export const InstagramFeed: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ig-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    if (headingRef.current) observer.observe(headingRef.current);
    if (statsRef.current) observer.observe(statsRef.current);

    const items = gridRef.current?.querySelectorAll(".ig-card");
    items?.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 80}ms`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="instagram" className="ig-section">
      <div className="ig-bg-ambient" aria-hidden="true">
        <div className="ig-ambient-orb ig-orb-1" />
        <div className="ig-ambient-orb ig-orb-2" />
      </div>

      <div className="ig-container">
        {/* Header */}
        <div ref={headingRef} className="ig-header ig-animate">
          <div className="ig-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
            @ak.cineframe
          </div>
          <h2 className="ig-title">
            Cinematic <em>Frames</em><br />& Visual Stories
          </h2>
          <p className="ig-subtitle">
            191 posts of cinematic frames, golden-hour captures, event films and visual storytelling straight from the lens of Adarsh Kuncham.
          </p>
          <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-follow-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
            Follow on Instagram
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M7 7h10v10"/>
            </svg>
          </a>
        </div>

        {/* Mosaic Grid */}
        <div ref={gridRef} className="ig-grid">
          {INSTA_POSTS.map((post, i) => (
            <a
              key={i}
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`ig-card ig-span-${post.span} ig-animate`}
            >
              <div 
                className="ig-img-wrap"
                onMouseEnter={(e) => {
                  const v = e.currentTarget.querySelector('video');
                  if (v) v.play().catch(() => {});
                }}
                onMouseLeave={(e) => {
                  const v = e.currentTarget.querySelector('video');
                  if (v) v.pause();
                }}
              >
                {post.type === "video" && post.video ? (
                  <>
                    <img src={post.src} alt={post.caption} className="ig-video-poster" loading="lazy" decoding="async" />
                    <video 
                      src={post.video} 
                      muted 
                      playsInline 
                      loop 
                      preload="none" 
                      className="ig-video-element"
                    />
                    <div className="ig-reel-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="4" stroke="white" strokeWidth="2" fill="none"/>
                        <path d="M10 8L16 12L10 16V8Z" fill="white"/>
                      </svg>
                    </div>
                  </>
                ) : (
                  <img src={post.src} alt={post.caption} loading="lazy" decoding="async" />
                )}
                <div className="ig-overlay">
                  <div className="ig-overlay-inner">
                    <p className="ig-card-caption">{post.caption}</p>
                    <div className="ig-card-stats">
                      <span>❤ {post.likes}</span>
                      <span>View on Instagram ↗</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Stats Row */}
        <div ref={statsRef} className="ig-stats-row ig-animate">
          <div className="ig-stat"><span className="ig-stat-num">191</span><span className="ig-stat-label">Posts</span></div>
          <div className="ig-stat-divider" />
          <div className="ig-stat"><span className="ig-stat-num">114</span><span className="ig-stat-label">Followers</span></div>
          <div className="ig-stat-divider" />
          <div className="ig-stat"><span className="ig-stat-num">3+</span><span className="ig-stat-label">Years Active</span></div>
          <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-view-all">
            View All Posts →
          </a>
        </div>
      </div>

      <style>{`
        .ig-section {
          position: relative;
          padding: 7rem 0 6rem;
          background: #060606;
          overflow: hidden;
        }
        .ig-bg-ambient { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .ig-ambient-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
        .ig-orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, #e1306c 0%, transparent 70%); top: -120px; left: -140px; }
        .ig-orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, #833ab4 0%, transparent 70%); bottom: -100px; right: -100px; }
        .ig-container { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.2rem, 4vw, 3rem); }

        .ig-header { text-align: center; margin-bottom: 3.5rem; }
        .ig-eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase;
          color: #e1306c; background: rgba(225,48,108,0.1); border: 1px solid rgba(225,48,108,0.25);
          padding: 0.4rem 1rem; border-radius: 100px; margin-bottom: 1.4rem;
        }
        .ig-title {
          font-family: "Outfit", sans-serif; font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 800; color: #fff; line-height: 1.1; margin: 0 0 1.1rem; letter-spacing: -0.02em;
        }
        .ig-title em {
          font-style: normal;
          background: linear-gradient(135deg, #e1306c, #833ab4, #fcaf45);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ig-subtitle { max-width: 520px; margin: 0 auto 2rem; font-size: 1rem; color: rgba(255,255,255,0.48); line-height: 1.7; }
        .ig-follow-btn {
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.75rem 1.8rem; background: linear-gradient(135deg, #e1306c, #833ab4);
          color: #fff; font-size: 0.88rem; font-weight: 600; letter-spacing: 0.05em;
          border-radius: 100px; text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 8px 30px rgba(225,48,108,0.3);
        }
        .ig-follow-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 40px rgba(225,48,108,0.45); }
        .ig-follow-btn:active { transform: scale(0.98); }

        .ig-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 220px;
          gap: 0.6rem;
          margin-bottom: 2.5rem;
        }
        .ig-span-normal { grid-column: span 1; grid-row: span 1; }
        .ig-span-tall   { grid-column: span 1; grid-row: span 2; }
        .ig-span-wide   { grid-column: span 2; grid-row: span 1; }

        @media (max-width: 900px) {
          .ig-grid { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 180px; }
        }
        @media (max-width: 600px) {
          .ig-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 160px; }
          .ig-span-tall { grid-row: span 1; }
        }

        .ig-card { position: relative; display: block; border-radius: 10px; overflow: hidden; background: #111; text-decoration: none; }
        .ig-img-wrap { position: absolute; inset: 0; }
        .ig-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
        .ig-card:hover .ig-img-wrap img { transform: scale(1.07); }
        
        .ig-video-element {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          opacity: 0; transition: opacity 0.4s ease;
        }
        .ig-card:hover .ig-video-element { opacity: 1; }
        .ig-reel-icon {
          position: absolute; top: 12px; right: 12px;
          background: rgba(0,0,0,0.5); padding: 4px; border-radius: 6px;
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
          opacity: 0.9; transition: opacity 0.3s ease;
        }
        .ig-card:hover .ig-reel-icon { opacity: 0; }
        
        .ig-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 50%, transparent 100%);
          opacity: 0; transition: opacity 0.35s ease;
          display: flex; align-items: flex-end;
        }
        .ig-card:hover .ig-overlay { opacity: 1; }
        .ig-overlay-inner { padding: 1rem; width: 100%; }
        .ig-card-caption { font-size: 0.78rem; color: rgba(255,255,255,0.9); line-height: 1.4; margin: 0 0 0.5rem; font-weight: 500; }
        .ig-card-stats { display: flex; align-items: center; justify-content: space-between; font-size: 0.7rem; color: rgba(255,255,255,0.55); }

        .ig-stats-row {
          display: flex; align-items: center; justify-content: center; gap: 2.5rem; flex-wrap: wrap;
          padding: 1.6rem 2rem; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 16px;
        }
        .ig-stat { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }
        .ig-stat-num { font-family: "Outfit", sans-serif; font-size: 1.7rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; }
        .ig-stat-label { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.38); }
        .ig-stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }
        .ig-view-all {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.82rem; font-weight: 600; color: #e1306c; text-decoration: none;
          letter-spacing: 0.04em; padding: 0.6rem 1.2rem;
          border: 1px solid rgba(225,48,108,0.3); border-radius: 100px;
          background: rgba(225,48,108,0.06);
          transition: gap 0.2s ease, background 0.2s ease;
        }
        .ig-view-all:hover { gap: 0.7rem; background: rgba(225,48,108,0.12); }

        /* Scroll Reveal */
        .ig-animate { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94); }
        .ig-visible { opacity: 1 !important; transform: translateY(0) !important; }
        .ig-card.ig-animate { transform: translateY(20px) scale(0.97); }
        .ig-card.ig-visible { opacity: 1 !important; transform: translateY(0) scale(1) !important; }
      `}</style>
    </section>
  );
};
