export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  client: string;
  year: string;
  cover_image: string;
  gallery_images: string[];
  video_url: string;
  featured: boolean;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
  created_at?: string;
}

export interface ProfileSettings {
  name: string;
  role: string;
  bio: string;
  location: string;
  experience: string;
  email: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
  showreel_url: string;
}

export interface ServiceItem {
  title: string;
  desc: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}
