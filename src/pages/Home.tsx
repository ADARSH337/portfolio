import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { db } from '../utils/db';
import type { Project, Testimonial, ProfileSettings, ServiceItem } from '../types';
import { CustomCursor } from '../components/CustomCursor';
import { Navbar } from '../components/Navbar';
import { ShowreelHero } from '../components/ShowreelHero';
import { StackedFramesGallery } from '../components/StackedFramesGallery';
import { PhotoGallery } from '../components/PhotoGallery';
import { VideoGallery } from '../components/VideoGallery';
import { Services } from '../components/Services';
import { ExperienceEducation } from '../components/ExperienceEducation';
import { Testimonials } from '../components/Testimonials';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
import { InstagramFeed } from '../components/InstagramFeed';

interface HomeProps {
  onNavigateToCms: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigateToCms }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  // Load database content on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projData, profileData, servicesData, testData] = await Promise.all([
          db.getProjects(),
          db.getProfileSettings(),
          db.getServices(),
          db.getTestimonials()
        ]);
        setProjects(projData);
        setProfile(profileData);
        setServices(servicesData);
        setTestimonials(testData);
      } catch (err) {
        console.error('Failed to load portfolio database content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo out
      gestureOrientation: 'vertical',
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Section Observer to highlight Navbar items on scroll
  useEffect(() => {
    const sections = ['home', 'work', 'photography', 'videography', 'about', 'services', 'contact'];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200; // Offset for accuracy
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading || !profile) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#090909' }}>
        <p style={{ color: '#fff', fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Loading Exhibition...
        </p>
      </div>
    );
  }

  const handleNavigate = (section: string) => {
    if (section === 'cms') {
      onNavigateToCms();
    }
  };

  return (
    <>
      <CustomCursor />
      
      <Navbar currentSection={activeSection} onNavigate={handleNavigate} />
      
      <ShowreelHero
        name={profile.name}
        role={profile.role}
        tagline="Crafting stories through motion, emotion and creativity."
        videoUrl={profile.showreel_url}
        onViewWorkClick={() => {
          document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onConnectClick={() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <StackedFramesGallery projects={projects} />
      
      <InstagramFeed />
      
      <PhotoGallery projects={projects} />
      
      <VideoGallery projects={projects} />
      
      <ExperienceEducation profile={profile} />
      
      <Services services={services} />
      
      <Testimonials testimonials={testimonials} />
      
      <ContactForm profile={profile} />
      
      <Footer email={profile.email} />
    </>
  );
};
