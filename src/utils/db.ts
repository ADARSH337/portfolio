import { supabase, isMockMode } from '../supabaseClient';
import type { Project, ProfileSettings, ServiceItem, Testimonial, Message, Category } from '../types';

// ============================================================================
// ADARSH KUNCHAM PORTFOLIO DATABASE (CLOUDINARY CDN INTEGRATED)
// ============================================================================

const MOCK_PROJECTS: Project[] = [
  // ─────────────────────────────────────────────────────────────
  // PHOTOGRAPHY — Curated Cloudinary Photography Gallery
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p1',
    title: 'Frames & Light',
    slug: 'frames-and-light',
    description: 'A curated selection of landscapes, portraits, street shots, and editorial compositions. Every image is a study of light, geometry, and emotional atmosphere captured through the lens of Adarsh Kuncham.',
    category: 'Photography',
    client: 'Personal Work',
    year: '2026',
    cover_image: 'https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428758/camara_2.jpg',
    gallery_images: [
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429254/bike_9.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429251/bike_8.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429251/bike_7.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429250/bike_6.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429248/sky_5.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429248/street_cat_2.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429247/street_cat_1.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429243/camara.heic",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429242/sky.heic",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429241/street_photo_2.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429240/moon_8.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429238/sun_8.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429238/moon_7.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429237/moon_6.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429236/moon_5.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429235/9346.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429234/8560.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429234/IMG20251001191157_Original.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429234/8073.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429234/street_photo_4.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429232/sun_7.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429231/sun_6.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429244/sky_1.heic",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429229/29016.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429228/9399.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429227/7348.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429226/thunder_1.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429226/sun_5.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429225/sun_4.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429224/96800.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429223/gaintwheel.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429221/sun_3.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429221/sun_2.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429220/sun_1.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429218/sky_20.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429217/bike_5.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429217/IMG_3717.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429217/bike_1.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429219/sky1.heic",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429241/street_photo.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429214/thunder_3.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429213/thunder_2.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429213/sky_19.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429212/street_photo_3.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429211/moon_3.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429210/moon_4.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429210/moon_2.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429209/street.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428775/street_photo_8.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428774/street_photo_1.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428771/sky_18.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428771/sky_17.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428770/sky_16.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428770/street_photo_7.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428769/street_photo_6.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428769/sky_14.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428767/sky_15.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428765/street_photo_5.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428764/sky_13.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428764/moon_1.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428763/sky_12.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429249/sky_4.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428761/gaintwheel_3.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428761/gaintwheel_2.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428759/gaintwheel_1.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428758/camara_2.heic",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428758/sky_11.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428757/bike_3.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428757/sky_10.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428756/sky_9.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428755/sky_8.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428754/bike_4.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428753/bike_2.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428751/rainbow_1.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428751/sky_7.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428751/sky_6.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428750/rainbow_2.jpg",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429244/sky_3.heic",
      "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429246/sky_2.heic"
],
    video_url: '',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // NUMAISH EVENT — 4K film
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p2',
    title: 'Numaish 4K',
    slug: 'numaish-4k',
    description: 'A full cinematic 4K production capturing the vibrant Numaish cultural event. Dynamic camera movement, high-energy pacing, and rich color grading bring the night festival to life.',
    category: 'Videography',
    client: 'Numaish',
    year: '2026',
    cover_image: 'https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429223/gaintwheel.jpg',
    gallery_images: [],
    video_url: 'https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428533/NUMAISH_4K.mp4',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // CINEMATIC EDITS — Short narrative & visual storytelling
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p3',
    title: 'Cinematic Edits',
    slug: 'cinematic-edits',
    description: 'A series of cinematic short-form narratives — dramatic pacing, rich colour grades, and purposeful sound design. Each piece tells a distinct visual story from concept to final cut.',
    category: 'Videography',
    client: 'AK CineFrame Studio',
    year: '2025–2026',
    cover_image: 'https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428488/vlog.jpg',
    gallery_images: [],
    video_url: 'https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428488/vlog.mp4',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // GAMING & SHORTS — High-Engagement Kinetic Edits
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p4',
    title: 'Reels & Shorts',
    slug: 'reels-and-shorts',
    description: 'High-engagement gaming montage and stream highlight edits built around instant visual hooks, beat-synced motion, dynamic SFX, and 3D motion tracking for Shadow Beast Gamer and creators.',
    category: 'Social Media',
    client: 'Shadow Beast Gamer & Creators',
    year: '2025–2026',
    cover_image: 'https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786429375/game.jpg',
    gallery_images: [],
    video_url: 'https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786429375/game.mp4',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // COMMERCIAL & BRAND FILMS — Brand Films (Stacked 5th Card)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p5',
    title: 'Brand Films',
    slug: 'brand-films',
    description: 'High-octane commercial promo cuts with kinetic camera moves, sound-reactive pacing, and impactful motion design crafted for maximum audience conversion.',
    category: 'Commercial',
    client: 'Local Brands & Startups',
    year: '2025–2026',
    cover_image: 'https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428400/gym3.jpg',
    gallery_images: [],
    video_url: 'https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428400/gym3.mp4',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // TRAVEL & NATURE — The Journey Within
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p6',
    title: 'The Journey Within',
    slug: 'the-journey-within',
    description: 'A vertical cinematic travel cut capturing the serene beauty of mountain rivers, valleys, and roads. Seamless pacing and vibrant color grading create an immersive travel narrative.',
    category: 'Videography',
    client: 'Self Produced',
    year: '2026',
    cover_image: 'https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428537/trip.jpg',
    gallery_images: [],
    video_url: 'https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428537/trip.mp4',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // NARRATIVE & SHORT FILMS — The Archivist
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p7',
    title: 'The Archivist',
    slug: 'the-archivist',
    description: 'A short cinematic visual narrative detailing archival work and documentation. Focuses on close-up details, soft lighting, and high-fidelity sound design.',
    category: 'Videography',
    client: 'Independent Film Production',
    year: '2026',
    cover_image: 'https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428368/shortfilmereel.jpg',
    gallery_images: [],
    video_url: 'https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428368/shortfilmereel.mp4',
    featured: true,
    published: true
  },

  // ─────────────────────────────────────────────────────────────
  // SPORTS & ACTION — High-Energy Cuts
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p8',
    title: 'Match Point — Sports Cut',
    slug: 'sports-action-cut',
    description: 'High-speed sports and athletic motion edit featuring speed-ramping, kinetic zoom-ins, and impact sound design.',
    category: 'Videography',
    client: 'HyperX Sports & Creators',
    year: '2026',
    cover_image: 'https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786429394/cricket.jpg',
    gallery_images: [],
    video_url: 'https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786429394/cricket.mp4',
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
  showreel_url: 'https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786429412/iphone_1.mp4'
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

const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Commercial', slug: 'commercial' },
  { id: 'c2', name: 'Photography', slug: 'photography' },
  { id: 'c3', name: 'Videography', slug: 'videography' },
  { id: 'c4', name: 'Social Media', slug: 'social-media' },
  { id: 'c5', name: 'Event', slug: 'event' }
];

// Helper to initialize LocalStorage db — bump DB_VERSION to force fresh seed
const DB_VERSION = 'v18-accurate-preview-covers';
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

export const db = {
  // --- PROJECTS ---
  async getProjects(): Promise<Project[]> {
    initLocalDb();
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_projects') || '[]');
    }
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return MOCK_PROJECTS;
    return data || [];
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    initLocalDb();
    if (isMockMode) {
      const items: Project[] = JSON.parse(localStorage.getItem('ak_projects') || '[]');
      return items.find((p) => p.slug === slug) || null;
    }
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  },

  async saveProject(p: Partial<Project> & { id?: string }): Promise<Project> {
    initLocalDb();
    if (isMockMode) {
      const items: Project[] = JSON.parse(localStorage.getItem('ak_projects') || '[]');
      if (p.id) {
        const idx = items.findIndex((item) => item.id === p.id);
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...p } as Project;
          localStorage.setItem('ak_projects', JSON.stringify(items));
          return items[idx];
        }
      }
      const newP: Project = {
        id: 'p_' + Math.random().toString(36).substring(2, 9),
        title: p.title || 'Untitled Project',
        slug: p.slug || 'untitled-' + Date.now(),
        description: p.description || '',
        category: p.category || 'Videography',
        client: p.client || 'Personal Work',
        year: p.year || '2026',
        cover_image: p.cover_image || '',
        gallery_images: p.gallery_images || [],
        video_url: p.video_url || '',
        featured: p.featured ?? true,
        published: p.published ?? true
      };
      items.unshift(newP);
      localStorage.setItem('ak_projects', JSON.stringify(items));
      return newP;
    }

    if (p.id && !p.id.startsWith('p_')) {
      const { data, error } = await supabase
        .from('projects')
        .update(p)
        .eq('id', p.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const cleanP = { ...p };
      delete cleanP.id;
      const { data, error } = await supabase
        .from('projects')
        .insert(cleanP)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  async deleteProject(id: string): Promise<void> {
    initLocalDb();
    if (isMockMode) {
      const items: Project[] = JSON.parse(localStorage.getItem('ak_projects') || '[]');
      const filtered = items.filter((item) => item.id !== id);
      localStorage.setItem('ak_projects', JSON.stringify(filtered));
      return;
    }
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  // --- PROFILE ---
  async getProfileSettings(): Promise<ProfileSettings> {
    initLocalDb();
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_profile') || JSON.stringify(MOCK_PROFILE));
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
    initLocalDb();
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

  // --- SERVICES ---
  async getServices(): Promise<ServiceItem[]> {
    initLocalDb();
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_services') || JSON.stringify(MOCK_SERVICES));
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
    initLocalDb();
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
    initLocalDb();
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_testimonials') || JSON.stringify(MOCK_TESTIMONIALS));
    }
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return MOCK_TESTIMONIALS;
    return data || [];
  },

  async saveTestimonial(t: Partial<Testimonial>): Promise<Testimonial> {
    initLocalDb();
    if (isMockMode) {
      const items: Testimonial[] = JSON.parse(localStorage.getItem('ak_testimonials') || JSON.stringify(MOCK_TESTIMONIALS));
      if (t.id) {
        const idx = items.findIndex((item) => item.id === t.id);
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...t } as Testimonial;
          localStorage.setItem('ak_testimonials', JSON.stringify(items));
          return items[idx];
        }
      }
      const newT: Testimonial = {
        id: 't_' + Math.random().toString(36).substring(2, 9),
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

    if (t.id && !t.id.startsWith('t_')) {
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
    initLocalDb();
    if (isMockMode) {
      const items: Testimonial[] = JSON.parse(localStorage.getItem('ak_testimonials') || '[]');
      const filtered = items.filter((t) => t.id !== id);
      localStorage.setItem('ak_testimonials', JSON.stringify(filtered));
      return;
    }
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  },

  // --- MESSAGES (CONTACT) ---
  async getMessages(): Promise<Message[]> {
    initLocalDb();
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_messages') || '[]');
    }
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  },

  async sendMessage(m: Omit<Message, 'id' | 'read' | 'created_at'>): Promise<Message> {
    initLocalDb();
    if (isMockMode) {
      const items: Message[] = JSON.parse(localStorage.getItem('ak_messages') || '[]');
      const newM: Message = {
        ...m,
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
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
    initLocalDb();
    if (isMockMode) {
      const items: Message[] = JSON.parse(localStorage.getItem('ak_messages') || '[]');
      const idx = items.findIndex((m) => m.id === id);
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
    initLocalDb();
    if (isMockMode) {
      const items: Message[] = JSON.parse(localStorage.getItem('ak_messages') || '[]');
      const filtered = items.filter((m) => m.id !== id);
      localStorage.setItem('ak_messages', JSON.stringify(filtered));
      return;
    }
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    initLocalDb();
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('ak_categories') || JSON.stringify(MOCK_CATEGORIES));
    }
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (error) return MOCK_CATEGORIES;
    return data || [];
  },

  // --- MEDIA UPLOAD ---
  async uploadMedia(file: File, folder: string, onProgress?: (percent: number) => void): Promise<string> {
    if (isMockMode) {
      if (onProgress) {
        onProgress(20);
        await new Promise((r) => setTimeout(r, 100));
        onProgress(50);
        await new Promise((r) => setTimeout(r, 100));
        onProgress(85);
        await new Promise((r) => setTimeout(r, 100));
        onProgress(100);
      }
      return URL.createObjectURL(file);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};

export const localDb = db;
