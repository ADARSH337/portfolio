-- Supabase Database Schema for Adarsh Kuncham Portfolio & CMS
-- Execute this script in your Supabase SQL Editor

-- -------------------------------------------------------------
-- 1. Enable Extensions
-- -------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------
-- 2. Drop Tables if Exists (for clean rebuild)
-- -------------------------------------------------------------
drop table if exists public.messages cascade;
drop table if exists public.settings cascade;
drop table if exists public.testimonials cascade;
drop table if exists public.project_media cascade;
drop table if exists public.projects cascade;
drop table if exists public.categories cascade;

-- -------------------------------------------------------------
-- 3. Create Tables
-- -------------------------------------------------------------

-- Categories Table
create table public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects Table
create table public.projects (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text not null unique,
    description text,
    category text not null,
    client text,
    year text,
    cover_image text, -- Direct URL from storage bucket
    gallery_images jsonb default '[]'::jsonb, -- Array of URLs
    video_url text, -- YouTube, Vimeo, or MP4 URL
    featured boolean default false,
    published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Project Media Table (for flexible ordered lists of items)
create table public.project_media (
    id uuid default uuid_generate_v4() primary key,
    project_id uuid references public.projects(id) on delete cascade,
    url text not null,
    type text default 'image'::text, -- 'image' or 'video'
    position integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Testimonials Table
create table public.testimonials (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    role text,
    company text,
    avatar text,
    content text not null,
    rating integer default 5,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Settings Table
create table public.settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages Table
create table public.messages (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    email text not null,
    subject text,
    message text not null,
    read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------
-- 4. Enable Row Level Security (RLS)
-- -------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.testimonials enable row level security;
alter table public.settings enable row level security;
alter table public.messages enable row level security;

-- -------------------------------------------------------------
-- 5. RLS Policies
-- -------------------------------------------------------------

-- Categories
create policy "Allow public read-only access to categories" on public.categories for select using (true);
create policy "Allow admin full access to categories" on public.categories 
    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Projects (anonymous users can only see published projects)
create policy "Allow public read-only access to published projects" on public.projects 
    for select using (published = true or auth.role() = 'authenticated');
create policy "Allow admin full access to projects" on public.projects 
    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Project Media
create policy "Allow public read-only access to project media" on public.project_media for select using (true);
create policy "Allow admin full access to project media" on public.project_media 
    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Testimonials
create policy "Allow public read-only access to testimonials" on public.testimonials for select using (true);
create policy "Allow admin full access to testimonials" on public.testimonials 
    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Settings
create policy "Allow public read-only access to settings" on public.settings for select using (true);
create policy "Allow admin full access to settings" on public.settings 
    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Messages (anonymous can insert contact forms; admins can manage)
create policy "Allow public insert to messages" on public.messages for insert with check (true);
create policy "Allow admin full access to messages" on public.messages 
    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- -------------------------------------------------------------
-- 6. Trigger for updated_at
-- -------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trigger_projects_updated_at
    before update on public.projects
    for each row execute function public.handle_updated_at();

create trigger trigger_settings_updated_at
    before update on public.settings
    for each row execute function public.handle_updated_at();

-- -------------------------------------------------------------
-- 7. Seed Initial Data
-- -------------------------------------------------------------

-- Categories
insert into public.categories (name, slug) values
('Commercial', 'commercial'),
('Photography', 'photography'),
('Videography', 'videography'),
('Social Media', 'social-media'),
('Motion Graphics', 'motion-graphics')
on conflict (name) do nothing;

-- Settings
insert into public.settings (key, value) values
('profile', '{
    "name": "Adarsh Kuncham",
    "role": "Video Editor, Photographer & Videographer",
    "bio": "I am a Video Editor, Photographer, and Videographer with over 3 years of experience creating cinematic visuals for brands, creators, and businesses. I specialize in transforming ideas into compelling visual stories through editing, motion graphics, photography, and creative direction. Every frame is crafted to create emotion and leave a lasting impression.",
    "location": "Nizamabad, Telangana, India",
    "experience": "3+ Years",
    "email": "adarshkuncham@gmail.com",
    "instagram": "https://instagram.com",
    "linkedin": "https://linkedin.com",
    "whatsapp": "https://wa.me/910000000000",
    "showreel_url": "https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-dj-playing-music-41804-large.mp4"
}'::jsonb),
('services', '[
    {"title": "Video Editing", "desc": "Cinematic visual pacing, seamless transitions, and narrative structuring."},
    {"title": "Photography", "desc": "Selected landscape, portrait, fashion, and editorial street shoots."},
    {"title": "Videography", "desc": "High-end visual capture, dynamic camera work, and drone piloting."},
    {"title": "Commercial Editing", "desc": "Cinematic landing page videos, brand trailers, and product ads."},
    {"title": "Motion Graphics", "desc": "Dynamic lower thirds, intro titles, text animations, and visual effects."},
    {"title": "Color Grading", "desc": "Sleek look development, skin tone correction, and depth creation."}
]'::jsonb)
on conflict (key) do nothing;

-- Testimonials
insert into public.testimonials (name, role, company, content, rating) values
('Sarah Jenkins', 'Creative Director', 'Vivid Media', 'Adarsh turned our raw commercial footage into a masterpiece. His attention to detail, pacing, and color grading elevated the entire campaign.', 5),
('Rohit Sharma', 'Founder', 'Apex Fitness', 'Working with Adarsh was seamless. He understood our brand values and created Instagram Reels that boosted our engagement by 200%. Highly recommended!', 5),
('Emily Chen', 'Visual Lead', 'Nova Apparel', 'The photography collection Adarsh captured for our summer launch was breathtaking. Every frame captured the exact mood and luxury feel we wanted.', 5)
on conflict do nothing;

-- Projects
insert into public.projects (title, slug, description, category, client, year, cover_image, gallery_images, video_url, featured, published) values
(
    'Instapage Campaign Series',
    'instapage-campaign-series',
    'Created commercial landing page videos and motion graphics using storytelling, typography, transitions, and modern editing techniques to capture attention and boost conversions.',
    'Commercial',
    'Instapage Corp',
    '2025',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'https://assets.mixkit.co/videos/preview/mixkit-set-of-three-smartphones-with-mockup-screens-on-table-41618-large.mp4',
    true,
    true
),
(
    'Photography Collection',
    'photography-collection',
    'A selected series of landscape, portrait, and editorial street photography. Every photo represents a study of natural light, geometry, composition, and emotional atmosphere.',
    'Photography',
    'Exhibition Work',
    '2026',
    'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1200&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    '',
    true,
    true
),
(
    'Cinematic Videography',
    'cinematic-videography',
    'High-end visual capture, drone cinematography, and dramatic coloring for short-form visual essays and commercial narratives. Focuses on pacing and visual scale.',
    'Videography',
    'Self Produced',
    '2025',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-fog-shrouded-pine-forest-41982-large.mp4',
    true,
    true
),
(
    'Social Media Campaigns',
    'social-media-campaigns',
    'Engagement-driven short-form vertical videos (Reels, Shorts, TikToks) optimized for immediate visual hooks, dynamic captions, and fast-paced sound design.',
    'Social Media',
    'Multiple Brands',
    '2026',
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    'https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-displaying-mockup-app-profile-42861-large.mp4',
    true,
    true
),
(
    'Creative Motion Graphics',
    'creative-motion-graphics',
    'Visual style frames, kinetic typography, lower thirds, and intro animations. Seamlessly blending design theory with fluid physics to drive visual storytelling.',
    'Motion Graphics',
    'Tech Startups',
    '2025',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop"]'::jsonb,
    '',
    true,
    true
)
on conflict (slug) do nothing;

-- -------------------------------------------------------------
-- 8. Storage Policy Configuration Instructions
-- -------------------------------------------------------------
-- Note: Create a bucket named "portfolio" with public access enabled.
-- Run the following SQL to enable write access for authenticated users:
--
-- create policy "Portfolio Storage Public Select" on storage.objects 
--     for select using (bucket_id = 'portfolio');
--
-- create policy "Portfolio Storage Admin Insert" on storage.objects 
--     for insert with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');
--
-- create policy "Portfolio Storage Admin Delete" on storage.objects 
--     for delete using (bucket_id = 'portfolio' and auth.role() = 'authenticated');
