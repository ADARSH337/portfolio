import { supabase, isMockMode } from '../supabaseClient';
import type { Project, ProfileSettings, ServiceItem, Testimonial, Message, Category } from '../types';

// ============================================================================
// ADARSH KUNCHAM PORTFOLIO DATABASE (CLOUDINARY CDN INTEGRATED)
// ============================================================================

const MOCK_PROJECTS: Project[] = [
  {
    "id": "p1",
    "title": "Frames & Light",
    "slug": "frames-and-light",
    "description": "A curated selection of landscapes, portraits, street shots, and editorial compositions. Every image is a study of light, geometry, and emotional atmosphere captured through the lens of Adarsh Kuncham.",
    "category": "Photography",
    "client": "Personal Work",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786428758/camara_2.jpg",
    "gallery_images": [
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
    "video_url": "",
    "featured": true,
    "published": true
  },
  {
    "id": "p2",
    "title": "Numaish 4K",
    "slug": "numaish-4k",
    "description": "A full cinematic 4K production capturing the vibrant Numaish cultural event. High-energy camera work, dynamic lighting, and rich color grading bring the night festival to life.",
    "category": "Videography",
    "client": "Numaish Hyderabad",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/image/upload/q_auto,f_auto/v1786429223/gaintwheel.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428533/NUMAISH_4K.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p3",
    "title": "Cinematic Edits",
    "slug": "cinematic-edits",
    "description": "A series of cinematic short-form narratives — dramatic pacing, rich colour grades, and purposeful sound design. Each piece tells a distinct visual story from concept to final cut.",
    "category": "Videography",
    "client": "AK CineFrame Studio",
    "year": "2025–2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428488/vlog.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428488/vlog.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p4",
    "title": "Reels & Shorts",
    "slug": "reels-and-shorts",
    "description": "High-engagement gaming montage and stream highlight edits built around instant visual hooks, beat-synced motion, dynamic SFX, and 3D motion tracking for Shadow Beast Gamer.",
    "category": "Social Media",
    "client": "Shadow Beast Gamer & Creators",
    "year": "2025–2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786429375/game.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786429375/game.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p5",
    "title": "Brand Films",
    "slug": "brand-films",
    "description": "High-octane commercial promo cuts with kinetic camera moves, sound-reactive pacing, and impactful motion design crafted for maximum audience conversion.",
    "category": "Commercial",
    "client": "Apex Fitness & Local Brands",
    "year": "2025–2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428400/gym3.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428400/gym3.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p6",
    "title": "The Journey Within",
    "slug": "the-journey-within",
    "description": "A vertical cinematic travel cut capturing the serene beauty of mountain rivers, valleys, and roads. Seamless pacing and vibrant color grading create an immersive travel narrative.",
    "category": "Videography",
    "client": "Self Produced",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428537/trip.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428537/trip.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p7",
    "title": "The Archivist",
    "slug": "the-archivist",
    "description": "A short cinematic visual narrative detailing archival work and documentation. Focuses on close-up details, soft lighting, and high-fidelity sound design.",
    "category": "Videography",
    "client": "Independent Film Production",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428368/shortfilmereel.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428368/shortfilmereel.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p8",
    "title": "Match Point — Sports Cut",
    "slug": "sports-action-cut",
    "description": "High-speed sports and athletic motion edit featuring speed-ramping, kinetic zoom-ins, and impact sound design.",
    "category": "Videography",
    "client": "HyperX Sports & Creators",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786429394/cricket.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786429394/cricket.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p9",
    "title": "Apex Legends Stream Highlights",
    "slug": "apex-legends-stream-highlights",
    "description": "Fast-paced gaming stream highlights with humorous visual sound effects, 3D motion tracking, and beat-synced gun sync transitions.",
    "category": "Social Media",
    "client": "Apex Plays Gaming",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428539/game2.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428539/game2.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p10",
    "title": "Strength & Conditioning Workout",
    "slug": "strength-and-conditioning-workout",
    "description": "High-intensity gym workout cut with heavy impact sound design, speed ramps, and contrast-rich visual grading.",
    "category": "Commercial",
    "client": "Iron Core Fitness",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428402/gym1.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428402/gym1.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p11",
    "title": "Kinetic Fitness Reel",
    "slug": "kinetic-fitness-reel",
    "description": "Vertical social media fitness reel showcasing functional workouts and athletic movement with rhythmic music pacing.",
    "category": "Social Media",
    "client": "Elevate Fitness Club",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428402/gym2.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428402/gym2.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p12",
    "title": "Athletic Conditioning Film",
    "slug": "athletic-conditioning-film",
    "description": "Commercial training film highlighting athletic endurance, sweat, and focused determination.",
    "category": "Commercial",
    "client": "Pro Athletic Studio",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428465/gym4.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428465/gym4.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p14",
    "title": "High-Performance Training Cut",
    "slug": "high-performance-training-cut",
    "description": "Extended gym montage film with multi-angle sequencing, color-matched highlights, and powerful bass audio.",
    "category": "Commercial",
    "client": "Apex Gym & Fitness",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786429395/gym6_1.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786429395/gym6_1.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p15",
    "title": "Himalayan Valleys & Rivers",
    "slug": "himalayan-valleys-rivers",
    "description": "Cinematic travel reel exploring turquoise mountain rivers and expansive green valley ridges.",
    "category": "Videography",
    "client": "Wanderlust Films",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428355/travel1.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428355/travel1.mov",
    "featured": true,
    "published": true
  },
  {
    "id": "p16",
    "title": "Scenic Mountain Pass",
    "slug": "scenic-mountain-pass",
    "description": "High-altitude cinematic road travel cut capturing winding highways and snow-capped peaks.",
    "category": "Videography",
    "client": "Adventure Roadways",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428353/travel2.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428353/travel2.mov",
    "featured": false,
    "published": true
  },
  {
    "id": "p17",
    "title": "Road Trip Cinema Cut",
    "slug": "road-trip-cinema-cut",
    "description": "Atmospheric road trip visual cut showcasing highway landscapes and open skies.",
    "category": "Videography",
    "client": "Self Produced",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428351/travel3.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428351/travel3.mov",
    "featured": false,
    "published": true
  },
  {
    "id": "p18",
    "title": "Emerald Waters & Trails",
    "slug": "emerald-waters-trails",
    "description": "Nature documentary style sequence with vibrant natural hues and immersive water audio.",
    "category": "Videography",
    "client": "Nature Escapes",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428354/travel4.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428354/travel4.mov",
    "featured": false,
    "published": true
  },
  {
    "id": "p19",
    "title": "Golden Hour Peaks",
    "slug": "golden-hour-peaks",
    "description": "Warm golden hour sunlight sweeping over mountain ranges and forest canopies.",
    "category": "Videography",
    "client": "AK CineFrame Travel",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428357/travel5.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428357/travel5.mov",
    "featured": false,
    "published": true
  },
  {
    "id": "p20",
    "title": "Serene River Stream",
    "slug": "serene-river-stream",
    "description": "Slow-motion water movement, pebble riverbeds, and peaceful nature acoustics.",
    "category": "Videography",
    "client": "Visual Journeys",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428361/travel6.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428361/travel6.mov",
    "featured": false,
    "published": true
  },
  {
    "id": "p21",
    "title": "Misty Forest Trails",
    "slug": "misty-forest-trails",
    "description": "Enchanting woodland journey through morning fog and lush green flora.",
    "category": "Videography",
    "client": "Nature Escapes",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428360/travel7.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428360/travel7.mov",
    "featured": false,
    "published": true
  },
  {
    "id": "p22",
    "title": "Highway Horizons",
    "slug": "highway-horizons",
    "description": "Fast-paced travel cut with smooth speed ramping and kinetic camera pans.",
    "category": "Videography",
    "client": "Self Produced",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428363/travel8.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428363/travel8.mov",
    "featured": false,
    "published": true
  },
  {
    "id": "p23",
    "title": "Alpine Expedition Cut",
    "slug": "alpine-expedition-cut",
    "description": "Vertical travel vignette capturing high-elevation beauty and rugged terrain.",
    "category": "Videography",
    "client": "Trek Chronicles",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428368/travel10.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428368/travel10.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p24",
    "title": "Deep Wilderness Travel Cut",
    "slug": "deep-wilderness-travel-cut",
    "description": "Richly graded landscape cut exploring remote natural wonders.",
    "category": "Videography",
    "client": "Outdoor Media",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428365/travel11.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428365/travel11.mov",
    "featured": false,
    "published": true
  },
  {
    "id": "p25",
    "title": "Cinematic Bike Edit",
    "slug": "cinematic-bike-edit",
    "description": "High-octane motorcycle visual edit featuring speed ramping and heavy color grading.",
    "category": "Commercial",
    "client": "MotoCraft Customs",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428424/bike.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428424/bike.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p26",
    "title": "Urban Night Rider",
    "slug": "urban-night-rider",
    "description": "Night street bike cruise with neon bokeh, headlight flares, and atmospheric synthwave sound design.",
    "category": "Videography",
    "client": "Rider Collective",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786429383/bike2.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786429383/bike2.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p27",
    "title": "Visual Storyteller Motion Reel",
    "slug": "visual-storyteller-motion-reel",
    "description": "Dynamic editorial showreel displaying creative transitions, frame manipulation, and aesthetic motion pacing.",
    "category": "Videography",
    "client": "AK CineFrame Studio",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428539/motivation.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428539/motivation.mp4",
    "featured": true,
    "published": true
  },
  {
    "id": "p28",
    "title": "Chai & Conversations",
    "slug": "chai-and-conversations",
    "description": "A warm, atmospheric cut celebrating street-side chai culture, steam rising in morning light, and authentic city warmth.",
    "category": "Videography",
    "client": "Cultural Vignettes",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428552/chai.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428552/chai.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p29",
    "title": "Viral Beat-Synced Trend Reel",
    "slug": "viral-beat-synced-trend-reel",
    "description": "Fast-paced rhythmic trend reel designed for maximum retention on Instagram Reels and YouTube Shorts.",
    "category": "Social Media",
    "client": "Social Influencers",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428511/frds_trend_reel_edit.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428511/frds_trend_reel_edit.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p30",
    "title": "Friendship Day Celebration Cut",
    "slug": "friendship-day-celebration-cut",
    "description": "Heartfelt emotional montage cut with nostalgic color palette and upbeat sound design.",
    "category": "Social Media",
    "client": "Personal Project",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786429367/friendshipday_compressed.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786429367/friendshipday_compressed.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p31",
    "title": "Behind the Lens — Photography BTS",
    "slug": "behind-the-lens-bts",
    "description": "Behind the scenes film documenting outdoor photo shoots, lens switching, and composition planning.",
    "category": "Videography",
    "client": "AK CineFrame Photography",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428421/photographer.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428421/photographer.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p32",
    "title": "Frame Creation Workshop",
    "slug": "frame-creation-workshop",
    "description": "Creative studio and street cinematography capturing the process of crafting memorable frames.",
    "category": "Videography",
    "client": "AK CineFrame Studio",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428467/photographer1.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428467/photographer1.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p33",
    "title": "Monsoon Lightning & Thunder",
    "slug": "monsoon-lightning-thunder",
    "description": "Dramatic weather film capturing electrical lightning bolts splitting across the dark night sky.",
    "category": "Videography",
    "client": "Nature Elements",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428478/thunder.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428478/thunder.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p34",
    "title": "Sky Cinema Time-Lapse",
    "slug": "sky-cinema-time-lapse",
    "description": "Mesmerizing cloud evolution and rolling sky dynamics over urban horizons.",
    "category": "Videography",
    "client": "Skyscapes Studio",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428511/sky.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428511/sky.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p35",
    "title": "Twilight Sky Progression",
    "slug": "twilight-sky-progression",
    "description": "Transition from day into deep blue twilight with subtle color grading.",
    "category": "Videography",
    "client": "Skyscapes Studio",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428417/sky2.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428417/sky2.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p36",
    "title": "Golden Horizon Cut",
    "slug": "golden-horizon-cut",
    "description": "Sunset gradients shifting from fiery orange to soft violet across the atmosphere.",
    "category": "Videography",
    "client": "Skyscapes Studio",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428418/sky3.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428418/sky3.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p37",
    "title": "Atmospheric Azure Sequence",
    "slug": "atmospheric-azure-sequence",
    "description": "High-definition cloudscape sequence studying sunlight diffusion and depth.",
    "category": "Videography",
    "client": "Skyscapes Studio",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428482/sky4.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428482/sky4.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p38",
    "title": "Overcast Cloud Drift",
    "slug": "overcast-cloud-drift",
    "description": "Dramatic moody storm clouds drifting across the skyline with atmospheric sound design.",
    "category": "Videography",
    "client": "Skyscapes Studio",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428475/sky5.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428475/sky5.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p39",
    "title": "Archive Vault Visuals",
    "slug": "archive-vault-visuals",
    "description": "Conceptual film capturing storage vaults, memory tapes, and archival organization.",
    "category": "Videography",
    "client": "Media Vault",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428468/storage.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428468/storage.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p40",
    "title": "Studio Recording Session",
    "slug": "studio-recording-session",
    "description": "Behind the scenes film capture of recording equipment, dials, and audio monitors in action.",
    "category": "Videography",
    "client": "Audio Lab",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428370/recording.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428370/recording.mov",
    "featured": false,
    "published": true
  },
  {
    "id": "p41",
    "title": "Vertical Kinetic Cut",
    "slug": "vertical-kinetic-cut",
    "description": "Fast-paced vertical reel structured for high social engagement and retention.",
    "category": "Social Media",
    "client": "Social Media Creator",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428527/ig.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428527/ig.mp4",
    "featured": false,
    "published": true
  },
  {
    "id": "p42",
    "title": "Rainbow Sky Motion",
    "slug": "rainbow-sky-motion",
    "description": "Rare double rainbow captured in motion over urban rooftops with vibrant prism colors.",
    "category": "Videography",
    "client": "Nature Elements",
    "year": "2026",
    "cover_image": "https://res.cloudinary.com/ma08zkgn/video/upload/so_1,q_auto,f_auto/v1786428765/rainbow_1.jpg",
    "gallery_images": [],
    "video_url": "https://res.cloudinary.com/ma08zkgn/video/upload/q_auto,f_auto/v1786428765/rainbow_1.mov",
    "featured": false,
    "published": true
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
  showreel_url: 'https://res.cloudinary.com/ma08zkgn/video/upload/v1786429412/iphone_1.mp4'
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
const DB_VERSION = 'v23-remove-promo';
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
