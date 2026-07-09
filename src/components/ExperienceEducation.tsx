import React from 'react';
import { Award, BookOpen } from 'lucide-react';
import type { ProfileSettings } from '../types';

interface ExperienceEducationProps {
  profile: ProfileSettings;
}

export const ExperienceEducation: React.FC<ExperienceEducationProps> = ({ profile }) => {
  const skills = [
    'Adobe Premiere Pro',
    'Adobe After Effects',
    'DaVinci Resolve',
    'CapCut',
    'Adobe Photoshop',
    'Adobe Lightroom',
    'Cinematic Video Editing',
    'Commercial Films',
    'Photography',
    'Videography',
    'Motion Graphics',
    'Color Grading',
    'Visual Storytelling'
  ];

  return (
    <section id="about" className="section" style={{ background: '#070707', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px' }} className="about-grid">
          {/* Left Column: Biography & Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <p className="section-subtitle">Biography</p>
              <h2 className="section-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>Visual Storytelling</h2>
            </div>
            
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                fontWeight: 300,
                letterSpacing: '0.01em'
              }}
            >
              {profile.bio || 
                "I'm Adarsh Kuncham, a Video Editor, Photographer, and Videographer with over 3 years of experience creating cinematic visuals for brands, creators, and businesses. I specialize in transforming ideas into compelling visual stories through editing, motion graphics, photography, and creative direction. Every frame is crafted to create emotion and leave a lasting impression."
              }
            </p>

            <div style={{ display: 'flex', gap: '40px', marginTop: '10px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Location</p>
                <p style={{ fontSize: '1rem', color: '#fff', fontWeight: 500, marginTop: '4px' }}>{profile.location || 'Telangana, India'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Experience</p>
                <p style={{ fontSize: '1rem', color: '#fff', fontWeight: 500, marginTop: '4px' }}>{profile.experience || '3+ Years'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline & Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {/* Timeline Wrapper */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                Timeline
              </h3>

              {/* Experience */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ color: '#fff', marginTop: '3px' }}>
                  <Award size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>Professional Video Editor & Photographer</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>3+ Years of Freelance & Studio Experience</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                    Creating commercial videos, social media campaigns, YouTube content, videography, cinematic edits, and brand storytelling with a strong focus on quality and attention to detail.
                  </p>
                </div>
              </div>

              {/* Education */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ color: '#fff', marginTop: '3px' }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>CMR Institute of Technology</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Bachelor of Technology (B.Tech)</p>
                </div>
              </div>
            </div>

            {/* Skills Wrapper */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                Software & Specialization
              </h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(255,255,255,0.03)',
                      color: 'var(--text-secondary)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '100px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      transition: 'border-color 0.3s, color 0.3s'
                    }}
                    className="interactive-card skill-tag"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
        }
        .skill-tag:hover {
          border-color: rgba(255,255,255,0.2) !important;
          color: #fff !important;
        }
      `}</style>
    </section>
  );
};
