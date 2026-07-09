import { supabase, isMockMode } from '../supabaseClient';
import type { Project, Testimonial, ProfileSettings, ServiceItem, Message, Category } from '../types';

// ============================================================================
// MOCK DATABASE STATE (LocalStorage backed for local exploration without keys)
// ============================================================================

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Commercial', slug: 'commercial' },
  { id: '2', name: 'Photography', slug: 'photography' },
  { id: '3', name: 'Videography', slug: 'videography' },
  { id: '4', name: 'Social Media', slug: 'social-media' },
  { id: '5', name: 'Event', slug: 'event' }
];

const MOCK_PROJECTS: Project[] = [
  // ─────────────────────────────────────────────────────────────
  // PHOTOGRAPHY — only real photos in the gallery, no video
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p1',
    title: 'Frames & Light',
    slug: 'frames-and-light',
    description: 'A curated selection of landscapes, portraits, street shots, and editorial compositions. Every image is a study of light, geometry, and emotional atmosphere captured through the lens.',
    category: 'Photography',
    client: 'Personal Work',
    year: '2026',
    cover_image: '/photos/img_3642.jpg',
    gallery_images: [
      '/photos/img_4409.jpg',
      '/photos/img_5140.jpg',
      '/photos/img_5136.jpg',
      '/photos/img_5751.jpg',
      '/photos/img_5321.jpg',
      '/photos/img_5324.jpg',
      '/photos/img_3642.jpg',
      '/photos/img_4458.jpg',
      '/photos/img_1654.jpg',
      '/photos/img_4592.jpg',
      '/photos/img_4931.jpg',
      '/photos/img_3717.jpg',
      '/photos/img_3726.jpg',
      '/photos/img_4400.jpg',
      '/photos/img_1513.jpg',
      '/photos/img_4664.jpg',
      '/photos/img_4549.jpg',
      '/photos/img_4626.jpg',
      '/photos/img_4599.jpg',
      '/photos/img_2321.jpg',
      '/photos/img_1402.jpg',
      '/photos/img_1416.jpg',
      '/photos/img_1506.jpg',
      '/photos/img_2741.jpg',
      '/photos/img_2762.jpg',
      '/photos/85550.jpg',
      '/photos/96800.jpg',
      '/photos/63807.jpg',
      '/photos/8560.jpg',
      '/photos/img_3654.jpg',
      '/photos/img_20260506_135026373.jpg',
      '/photos/img_20260530_204009682.jpg',
      '/photos/img_20260529_192432565.jpg',
      '/photos/img_20260503_220227387.jpg',
      '/photos/img_20260501_221216044.jpg',
      '/photos/img_20260501_220208031.jpg',
    ],
    video_url: '',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // NUMAISH EVENT — 4K film, gallery is video stills (no extra photos)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p2',
    title: 'Numaish 4K',
    slug: 'numaish-4k',
    description: 'A full cinematic 4K production capturing the Numaish cultural event. High-end cinematography, dynamic movement, and deliberate colour treatment deliver a premium event film.',
    category: 'Videography',
    client: 'Numaish',
    year: '2026',
    cover_image: '/photos/85550.jpg',
    gallery_images: [],
    video_url: '/videos/numaish_4k.mp4',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // CINEMATIC EDITS — multiple real edited videos
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p3',
    title: 'Cinematic Edits',
    slug: 'cinematic-edits',
    description: 'A series of cinematic short-form narratives — dramatic pacing, rich colour grades, and purposeful sound design. Each piece tells a distinct visual story from concept to final cut.',
    category: 'Videography',
    client: 'AK CineFrame Studio',
    year: '2025–2026',
    cover_image: '/photos/8560.jpg',
    gallery_images: [],
    video_url: '/videos/lv_0_20260216090350.mp4',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // SOCIAL MEDIA REELS — short-form vertical content
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p4',
    title: 'Reels & Shorts',
    slug: 'reels-and-shorts',
    description: 'High-engagement short-form vertical content — Reels, Shorts, and TikToks — built around instant visual hooks, kinetic captions, and sound-reactive edits.',
    category: 'Social Media',
    client: 'Shadow Beast Gamer & Creators',
    year: '2025–2026',
    cover_image: '/photos/img_1513.jpg',
    gallery_images: [],
    video_url: '/videos/copy_of_lv_0_20251128143429.mp4',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // COMMERCIAL — brand edits and promo cuts
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p5',
    title: 'Brand Films',
    slug: 'brand-films',
    description: 'Branded commercial films and promo cuts with precise narrative structuring, sleek motion graphics, and cinematic colour. Crafted for maximum conversion and brand impact.',
    category: 'Commercial',
    client: 'Local Brands & Startups',
    year: '2025',
    cover_image: '/photos/img_4931.jpg',
    gallery_images: [],
    video_url: '/videos/copy_of_0925.mp4',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // NEW VIDEOS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p6',
    title: 'The Journey Within',
    slug: 'the-journey-within',
    description: 'A vertical cinematic travel cut capturing the serene beauty of mountain rivers and green valleys. Seamless pacing and vibrant color grading create an immersive travel narrative.',
    category: 'Videography',
    client: 'Self Produced',
    year: '2026',
    cover_image: '/photos/video1_poster.png',
    gallery_images: [],
    video_url: '/videos/0e7555da-bc57-419d-94b1-22430148792f.mp4',
    featured: true,
    published: true
  },
  {
    id: 'p7',
    title: 'The Archivist',
    slug: 'the-archivist',
    description: 'A short cinematic visual narrative detailing archival work and documentation. Focuses on close-up details, soft lighting, and high-fidelity sound design.',
    category: 'Videography',
    client: 'Independent Film Production',
    year: '2026',
    cover_image: '/photos/video2_poster.png',
    gallery_images: [],
    video_url: '/videos/7fd0d1b4-073f-45cc-ae83-07241812963b.mp4',
    featured: true,
    published: true
  }
];

const MOCK_PROFILE: ProfileSettings = {
  name: 'Adarsh Kuncham',
  role: 'Video Editor, Photographer & Videographer',
  bio: "I'm Adarsh Kuncham, a Video Editor, Photographer, and Videographer with over 3 years of experience creating cinematic visuals for brands, creators, and businesses. I specialize in transforming ideas into compelling visual stories through editing, motion graphics, photography, and creative direction. Every frame is crafted to create emotion and leave a lasting impression.",
  location: 'Nizamabad, Telangana, India',
  experience: '3+ Years',
  email: 'kunchamadarsh2006@gmail.com',
  instagram: 'https://www.instagram.com/ak.cineframe',
  linkedin: 'https://www.linkedin.com/in/adarsh-kuncham-a32677306/',
  whatsapp: 'https://wa.me/916300427247',
  showreel_url: '/videos/lv_0_20260208162105.mp4'
};



const MOCK_SERVICES: ServiceItem[] = [
  { title: 'Video Editing', desc: 'Cinematic visual pacing, seamless transitions, and narrative structuring.' },
  { title: 'Photography', desc: 'Selected landscape, portrait, fashion, and editorial street shoots.' },
  { title: 'Videography', desc: 'High-end visual capture, dynamic camera work, and drone piloting.' },
  { title: 'Commercial Editing', desc: 'Cinematic landing page videos, brand trailers, and product ads.' },
  { title: 'Motion Graphics', desc: 'Dynamic lower thirds, intro titles, text animations, and visual effects.' },
  { title: 'Color Grading', desc: 'Sleek look development, skin tone correction, and depth creation.' }
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Shadow Beast',
    role: 'Lead Content Creator',
    company: 'Shadow Beast Gaming',
    content: 'Adarsh is a god-tier editor. The sound design, beat-sync on my montages, and pacing are insane. Since he started editing my videos, my engagement and views have skyrocketed!',
    rating: 5
  },
  {
    id: 't2',
    name: 'Alex "Apex" K.',
    role: 'Apex Legends Streamer',
    company: 'Apex Plays',
    content: 'Adarsh completely transformed my stream highlights. He adds the perfect memes, clean 3D motion tracking, and zoom effects that keep viewers hooked till the very end.',
    rating: 5
  },
  {
    id: 't3',
    name: 'Karthik Prasad',
    role: 'Esports Manager',
    company: 'HyperX Clan',
    content: 'He delivered our tournament highlight reel in record time, and the quality was top-tier. The custom transition graphics and beat-syncing were absolutely perfect.',
    rating: 5
  }
];

// Helper to initialize LocalStorage db — bump DB_VERSION to force fresh seed
const DB_VERSION = 'v10-linkedin-update';
const initLocalDb = () => {
  // Wipe stale seed if version has changed
  if (localStorage.getItem('ak_db_version') !== DB_VERSION) {
    ['ak_projects', 'ak_profile', 'ak_services', 'ak_testimonials', 'ak_categories', 'ak_messages'].forEach(
      (key) => localStorage.removeItem(key)
    );
    localStorage.setItem('ak_db_version', DB_VERSION);
  }

  if (!localStorage.getItem('ak_projects')) {
    localStorage.setItem('ak_projects', JSON.stringify(MOCK_PROJECTS));
  }
  if (!localStorage.getItem('ak_profile')) {
    localStorage.setItem('ak_profile', JSON.stringify(MOCK_PROFILE));
  }
  if (!localStorage.getItem('ak_services')) {
    localStorage.setItem('ak_services', JSON.stringify(MOCK_SERVICES));
  }
  if (!localStorage.getItem('ak_testimonials')) {
    localStorage.setItem('ak_testimonials', JSON.stringify(MOCK_TESTIMONIALS));
  }
  if (!localStorage.getItem('ak_categories')) {
    localStorage.setItem('ak_categories', JSON.stringify(MOCK_CATEGORIES));
  }
  if (!localStorage.getItem('ak_messages')) {
    localStorage.setItem('ak_messages', JSON.stringify([]));
  }
};

if (typeof window !== 'undefined') {
  initLocalDb();
}

// ============================================================================
// PUBLIC API MODULE
// ============================================================================

export const db = {
  // --- PROJECTS ---
  async getProjects(onlyPublished = false): Promise<Project[]> {
    if (isMockMode) {
      const items = JSON.parse(localStorage.getItem('ak_projects') || '[]');
      return onlyPublished ? items.filter((p: Project) => p.published) : items;
    }
    
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (onlyPublished) {
      query = query.eq('published', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getProject(slug: string): Promise<Project | null> {
    if (isMockMode) {
      const items = JSON.parse(localStorage.getItem('ak_projects') || '[]');
      return items.find((p: Project) => p.slug === slug) || null;
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  },

  async saveProject(project: Partial<Project>): Promise<Project> {
    if (isMockMode) {
      const items = JSON.parse(localStorage.getItem('ak_projects') || '[]');
      if (project.id) {
        // Update
        const idx = items.findIndex((p: Project) => p.id === project.id);
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...project, updated_at: new Date().toISOString() };
          localStorage.setItem('ak_projects', JSON.stringify(items));
          return items[idx];
        }
      }
      // Create new
      const newProj: Project = {
        id: project.id || 'p_' + Math.random().toString(36).substr(2, 9),
        title: project.title || 'Untitled Project',
        slug: project.slug || 'untitled-' + Math.random().toString(36).substr(2, 5),
        description: project.description || '',
        category: project.category || 'Commercial',
        client: project.client || '',
        year: project.year || new Date().getFullYear().toString(),
        cover_image: project.cover_image || '',
        gallery_images: project.gallery_images || [],
        video_url: project.video_url || '',
        featured: project.featured || false,
        published: project.published || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      items.unshift(newProj);
      localStorage.setItem('ak_projects', JSON.stringify(items));
      return newProj;
    }

    if (project.id && project.id.startsWith('p_') === false && project.id.length > 10) {
      // Real database update
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', project.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      // Real database insert
      const cleanProj = { ...project };
      delete cleanProj.id; // Let uuid trigger handle it
      const { data, error } = await supabase
        .from('projects')
        .insert(cleanProj)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  async deleteProject(id: string): Promise<void> {
    if (isMockMode) {
      const items = JSON.parse(localStorage.getItem('ak_projects') || '[]');
      const filtered = items.filter((p: Project) => p.id !== id);
      localStorage.setItem('ak_projects', JSON.stringify(filtered));
      return;
    }
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  // --- SETTINGS (PROFILE & SERVICES) ---
  async getProfileSettings(): Promise<ProfileSettings> {
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_profile') || '{}');
    }
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'profile')
      .single();
    if (error) return MOCK_PROFILE;
    return data.value;
  },

  async saveProfileSettings(value: ProfileSettings): Promise<void> {
    if (isMockMode) {
      localStorage.setItem('ak_profile', JSON.stringify(value));
      return;
    }
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'profile', value })
      .eq('key', 'profile');
    if (error) throw error;
  },

  async getServices(): Promise<ServiceItem[]> {
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_services') || '[]');
    }
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'services')
      .single();
    if (error) return MOCK_SERVICES;
    return data.value;
  },

  async saveServices(value: ServiceItem[]): Promise<void> {
    if (isMockMode) {
      localStorage.setItem('ak_services', JSON.stringify(value));
      return;
    }
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'services', value })
      .eq('key', 'services');
    if (error) throw error;
  },

  // --- TESTIMONIALS ---
  async getTestimonials(): Promise<Testimonial[]> {
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_testimonials') || '[]');
    }
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async saveTestimonial(t: Partial<Testimonial>): Promise<Testimonial> {
    if (isMockMode) {
      const items = JSON.parse(localStorage.getItem('ak_testimonials') || '[]');
      if (t.id) {
        const idx = items.findIndex((item: Testimonial) => item.id === t.id);
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...t };
          localStorage.setItem('ak_testimonials', JSON.stringify(items));
          return items[idx];
        }
      }
      const newT: Testimonial = {
        id: 't_' + Math.random().toString(36).substr(2, 9),
        name: t.name || 'Anonymous',
        role: t.role || '',
        company: t.company || '',
        avatar: t.avatar || '',
        content: t.content || '',
        rating: t.rating || 5
      };
      items.push(newT);
      localStorage.setItem('ak_testimonials', JSON.stringify(items));
      return newT;
    }

    if (t.id && t.id.startsWith('t_') === false) {
      const { data, error } = await supabase
        .from('testimonials')
        .update(t)
        .eq('id', t.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const cleanT = { ...t };
      delete cleanT.id;
      const { data, error } = await supabase
        .from('testimonials')
        .insert(cleanT)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  async deleteTestimonial(id: string): Promise<void> {
    if (isMockMode) {
      const items = JSON.parse(localStorage.getItem('ak_testimonials') || '[]');
      const filtered = items.filter((t: Testimonial) => t.id !== id);
      localStorage.setItem('ak_testimonials', JSON.stringify(filtered));
      return;
    }
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  },

  // --- MESSAGES (CONTACT) ---
  async getMessages(): Promise<Message[]> {
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_messages') || '[]');
    }
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async sendMessage(m: Omit<Message, 'id' | 'read' | 'created_at'>): Promise<Message> {
    if (isMockMode) {
      const items = JSON.parse(localStorage.getItem('ak_messages') || '[]');
      const newM: Message = {
        ...m,
        id: 'msg_' + Math.random().toString(36).substr(2, 9),
        read: false,
        created_at: new Date().toISOString()
      };
      items.unshift(newM);
      localStorage.setItem('ak_messages', JSON.stringify(items));
      return newM;
    }
    const { data, error } = await supabase
      .from('messages')
      .insert(m)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async markMessageRead(id: string, read = true): Promise<void> {
    if (isMockMode) {
      const items = JSON.parse(localStorage.getItem('ak_messages') || '[]');
      const idx = items.findIndex((m: Message) => m.id === id);
      if (idx !== -1) {
        items[idx].read = read;
        localStorage.setItem('ak_messages', JSON.stringify(items));
      }
      return;
    }
    const { error } = await supabase
      .from('messages')
      .update({ read })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteMessage(id: string): Promise<void> {
    if (isMockMode) {
      const items = JSON.parse(localStorage.getItem('ak_messages') || '[]');
      const filtered = items.filter((m: Message) => m.id !== id);
      localStorage.setItem('ak_messages', JSON.stringify(filtered));
      return;
    }
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_categories') || '[]');
    }
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  // --- MEDIA UPLOAD ---
  async uploadMedia(file: File, folder: string, onProgress?: (percent: number) => void): Promise<string> {
    if (isMockMode) {
      // Simulate file upload progress
      if (onProgress) {
        onProgress(20);
        await new Promise((r) => setTimeout(r, 100));
        onProgress(50);
        await new Promise((r) => setTimeout(r, 100));
        onProgress(85);
        await new Promise((r) => setTimeout(r, 100));
        onProgress(100);
      }
      // Create local object URL for instant visual feedback during development
      return URL.createObjectURL(file);
    }

    // Supabase Storage Upload
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload the file to the 'portfolio' bucket
    const { error } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
