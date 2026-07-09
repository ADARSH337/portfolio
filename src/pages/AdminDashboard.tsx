import React, { useState, useEffect } from 'react';
import { db } from '../utils/db';
import type { Project, Testimonial, ProfileSettings, Message, Category, ServiceItem } from '../types';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquareQuote,
  Inbox,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Eye,
  EyeOff,
  Star,
  X,
  Upload
} from 'lucide-react';
import { isMockMode, supabase } from '../supabaseClient';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'dashboard' | 'projects' | 'testimonials' | 'messages' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [testimonialFormOpen, setTestimonialFormOpen] = useState(false);

  // Upload state
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploading, setUploading] = useState(false);

  // Search/Filters
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');

  // Load CMS data
  const loadCmsData = async () => {
    setLoading(true);
    try {
      const [projData, testData, msgData, catData, profileData, servicesData] = await Promise.all([
        db.getProjects(),
        db.getTestimonials(),
        db.getMessages(),
        db.getCategories(),
        db.getProfileSettings(),
        db.getServices()
      ]);
      setProjects(projData);
      setTestimonials(testData);
      setMessages(msgData);
      setCategories(catData);
      setProfile(profileData);
      setServices(servicesData);
    } catch (err) {
      console.error('Failed to load CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  const handleSignOut = async () => {
    if (isMockMode) {
      sessionStorage.removeItem('ak_auth_token');
      onLogout();
      return;
    }
    await supabase.auth.signOut();
    onLogout();
  };

  // ============================================================================
  // IMAGE COMPRESSION UTILITY (Staff optimization to limit bundle footprint)
  // ============================================================================
  const compressImageFile = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      // Check if file is image
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Return WebP compressed format
                const webpFile = new File(
                  [blob],
                  file.name.substring(0, file.name.lastIndexOf('.')) + '.webp',
                  { type: 'image/webp', lastModified: Date.now() }
                );
                resolve(webpFile);
              } else {
                resolve(file);
              }
            },
            'image/webp',
            0.8
          );
        };
      };
    });
  };

  // ============================================================================
  // UPLOAD SYSTEM
  // ============================================================================
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'cover' | 'gallery'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const filesArray = Array.from(files);

    try {
      const urls: string[] = [];

      for (let i = 0; i < filesArray.length; i++) {
        const originalFile = filesArray[i];
        const fileId = `file-${i}-${Date.now()}`;
        
        setUploadProgress((prev) => ({ ...prev, [fileId]: 10 }));

        // Pre-upload compression
        const compressed = await compressImageFile(originalFile);
        setUploadProgress((prev) => ({ ...prev, [fileId]: 30 }));

        const folder = compressed.type.startsWith('video/') ? 'portfolio/videography' : 'portfolio/photography';
        
        const url = await db.uploadMedia(compressed, folder, (percent) => {
          setUploadProgress((prev) => ({ ...prev, [fileId]: Math.min(100, 30 + percent * 0.7) }));
        });

        urls.push(url);
        setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));
      }

      if (field === 'cover' && editingProject) {
        setEditingProject((prev) => prev ? { ...prev, cover_image: urls[0] } : null);
      } else if (field === 'gallery' && editingProject) {
        const currentGallery = editingProject.gallery_images || [];
        setEditingProject((prev) =>
          prev ? { ...prev, gallery_images: [...currentGallery, ...urls] } : null
        );
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please verify credentials or try again.');
    } finally {
      setUploading(false);
      // Wait a moment then clear upload indicators
      setTimeout(() => setUploadProgress({}), 1500);
    }
  };

  // ============================================================================
  // PROJECT CRUD ACTIONS
  // ============================================================================
  const handleOpenNewProject = () => {
    setEditingProject({
      title: '',
      slug: '',
      description: '',
      category: 'Commercial',
      client: '',
      year: new Date().getFullYear().toString(),
      cover_image: '',
      gallery_images: [],
      video_url: '',
      featured: false,
      published: false
    });
    setProjectFormOpen(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjectFormOpen(true);
  };

  const handleDuplicateProject = async (proj: Project) => {
    const copy = {
      ...proj,
      id: undefined,
      title: `${proj.title} (Copy)`,
      slug: `${proj.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      published: false
    };
    try {
      await db.saveProject(copy);
      loadCmsData();
    } catch (err) {
      alert('Error duplicating project');
    }
  };

  const handleSaveProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    // Generate slug from title if empty
    const slug =
      editingProject.slug ||
      editingProject.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const finalProj = { ...editingProject, slug };

    try {
      await db.saveProject(finalProj);
      setProjectFormOpen(false);
      setEditingProject(null);
      loadCmsData();
    } catch (err) {
      alert('Failed to save project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await db.deleteProject(id);
      loadCmsData();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleTogglePublish = async (proj: Project) => {
    try {
      await db.saveProject({ id: proj.id, published: !proj.published });
      loadCmsData();
    } catch (err) {
      alert('Error toggling publish state');
    }
  };

  // Drag and Drop Gallery reorder
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex || !editingProject?.gallery_images) return;

    const updated = [...editingProject.gallery_images];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, removed);

    setEditingProject((prev) => (prev ? { ...prev, gallery_images: updated } : null));
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    if (!editingProject?.gallery_images) return;
    const updated = editingProject.gallery_images.filter((_, idx) => idx !== idxToRemove);
    setEditingProject((prev) => (prev ? { ...prev, gallery_images: updated } : null));
  };

  // ============================================================================
  // TESTIMONIAL CRUD ACTIONS
  // ============================================================================
  const handleOpenNewTestimonial = () => {
    setEditingTestimonial({ name: '', role: '', company: '', content: '', rating: 5 });
    setTestimonialFormOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.name || !editingTestimonial.content) return;

    try {
      await db.saveTestimonial(editingTestimonial);
      setTestimonialFormOpen(false);
      setEditingTestimonial(null);
      loadCmsData();
    } catch (err) {
      alert('Failed to save testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await db.deleteTestimonial(id);
      loadCmsData();
    } catch (err) {
      alert('Failed to delete testimonial');
    }
  };

  // ============================================================================
  // MESSAGES INBOX ACTIONS
  // ============================================================================
  const handleToggleMessageRead = async (msg: Message) => {
    try {
      await db.markMessageRead(msg.id, !msg.read);
      loadCmsData();
    } catch (err) {
      alert('Failed to update message');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await db.deleteMessage(id);
      loadCmsData();
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  // ============================================================================
  // PROFILE & SETTINGS SUBMITS
  // ============================================================================
  const handleSaveProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      await db.saveProfileSettings(profile);
      alert('Settings saved successfully!');
      loadCmsData();
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  const handleServiceChange = (idx: number, field: 'title' | 'desc', val: string) => {
    const updated = [...services];
    updated[idx] = { ...updated[idx], [field]: val };
    setServices(updated);
  };

  const handleSaveServicesSubmit = async () => {
    try {
      await db.saveServices(services);
      alert('Services updated successfully!');
      loadCmsData();
    } catch (err) {
      alert('Failed to save services');
    }
  };

  if (loading || !profile) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#090909' }}>
        <p style={{ color: '#fff', fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Loading CMS Panel...
        </p>
      </div>
    );
  }

  // Filtered project list
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesCat = projectCategoryFilter === 'All' || p.category === projectCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#090909',
        color: '#fff',
        fontFamily: 'var(--font-body)'
      }}
    >
      {/* =================================================------------------------
         Left Sidebar Panel
         =================================================------------------------ */}
      <aside
        style={{
          width: '260px',
          background: '#0c0c0c',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '30px 20px',
          position: 'fixed',
          height: '100vh'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', fontWeight: 800 }}>STUDIO CMS</h1>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Adarsh Kuncham Office
            </p>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Dashboard', value: 'dashboard', icon: <LayoutDashboard size={18} /> },
              { label: 'Projects', value: 'projects', icon: <FolderKanban size={18} /> },
              { label: 'Testimonials', value: 'testimonials', icon: <MessageSquareQuote size={18} /> },
              {
                label: 'Messages',
                value: 'messages',
                icon: <Inbox size={18} />,
                badge: messages.filter((m) => !m.read).length
              },
              { label: 'Settings', value: 'settings', icon: <Settings size={18} /> }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as TabType)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 16px',
                  background: activeTab === tab.value ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: activeTab === tab.value ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  transition: 'background-color 0.3s, color 0.3s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.badge && tab.badge > 0 ? (
                  <span
                    style={{
                      background: '#ff4444',
                      color: '#fff',
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        {/* User Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Adarsh Kuncham</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Administrator</p>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,68,68,0.2)',
              borderRadius: '6px',
              color: '#ff4444',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,68,68,0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* =================================================------------------------
         Right Main Panel Wrapper
         =================================================------------------------ */}
      <main style={{ marginLeft: '260px', flexGrow: 1, padding: '40px 50px', background: '#090909' }}>
        {/* =====================================================================
           TABS: DASHBOARD SCREEN
           ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, Adarsh</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Here is what is happening in your creative studio.</p>
            </div>

            {/* Metric widgets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '30px', background: '#141414', border: '1px solid rgba(255,255,255,0.04)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Projects</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '10px' }}>{projects.length}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>{projects.filter(p => p.published).length} published online</p>
              </div>

              <div className="glass-panel" style={{ padding: '30px', background: '#141414', border: '1px solid rgba(255,255,255,0.04)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Unread Messages</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '10px', color: messages.filter(m => !m.read).length > 0 ? '#ffc107' : '#fff' }}>
                  {messages.filter(m => !m.read).length}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>from contact form entries</p>
              </div>

              <div className="glass-panel" style={{ padding: '30px', background: '#141414', border: '1px solid rgba(255,255,255,0.04)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Client Endorsements</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '10px' }}>{testimonials.length}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>active client reviews</p>
              </div>
            </div>

            {/* Quick Actions & Recent Inbox */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }} className="dashboard-subgrid">
              {/* Recent Unread messages */}
              <div className="glass-panel" style={{ padding: '30px', background: '#0e0e0e' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  Recent Inquiries
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {messages.slice(0, 3).map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        padding: '14px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '0.9rem', color: '#fff' }}>{msg.name}</h4>
                          {!msg.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffc107' }} />}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{msg.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('messages');
                        }}
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                      >
                        Read
                      </button>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No messages in your inbox.</p>
                  )}
                </div>
              </div>

              {/* CMS Quick triggers */}
              <div className="glass-panel" style={{ padding: '30px', background: '#0e0e0e' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  Studio Short-keys
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleOpenNewProject}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#fff',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <Plus size={16} />
                    Create Portfolio Project
                  </button>
                  <button
                    onClick={handleOpenNewTestimonial}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'rgba(255,255,255,0.04)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <Plus size={16} />
                    Add Client Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
           TABS: PROJECTS LIST SCREEN
           ===================================================================== */}
        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Portfolio Projects</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Edit, delete, publish, and duplicate your work showcase.</p>
              </div>
              <button
                onClick={handleOpenNewProject}
                style={{
                  padding: '12px 24px',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                New Project
              </button>
            </div>

            {/* Filter and Search controls */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#141414', padding: '16px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  flexGrow: 1
                }}
              />
              <select
                value={projectCategoryFilter}
                onChange={(e) => setProjectCategoryFilter(e.target.value)}
                style={{
                  background: '#090909',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Projects Table List */}
            <div className="glass-panel" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Cover</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Project Details</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((proj) => (
                    <tr key={proj.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ width: '64px', height: '48px', borderRadius: '4px', overflow: 'hidden', background: '#000' }}>
                          <img src={proj.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <h4 style={{ fontSize: '1rem', color: '#fff' }}>{proj.title}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Client: {proj.client || 'None'} &bull; Year: {proj.year}
                        </p>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{proj.category}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <button
                          onClick={() => handleTogglePublish(proj)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            background: proj.published ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                            color: proj.published ? '#4caf50' : 'var(--text-secondary)',
                            border: '1px solid',
                            borderColor: proj.published ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          {proj.published ? <Eye size={12} /> : <EyeOff size={12} />}
                          {proj.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEditProject(proj)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '6px', cursor: 'pointer' }}
                            title="Edit Project"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDuplicateProject(proj)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '6px', cursor: 'pointer' }}
                            title="Duplicate Project"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            style={{ background: 'none', border: 'none', color: '#ff4444', padding: '6px', cursor: 'pointer' }}
                            title="Delete Project"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No projects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =====================================================================
           TABS: TESTIMONIALS SCREEN
           ===================================================================== */}
        {activeTab === 'testimonials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Client Reviews</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage user feedback displayed in the landing testimonials page.</p>
              </div>
              <button
                onClick={handleOpenNewTestimonial}
                style={{
                  padding: '12px 24px',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                New Review
              </button>
            </div>

            {/* Testimonials List Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '20px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '2px', color: '#ffc107' }}>
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="#ffc107" />
                        ))}
                      </div>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '14px', lineHeight: 1.5 }}>
                      "{t.content}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{t.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {t.role} {t.company ? `at ${t.company}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
           TABS: INBOX MESSAGES SCREEN
           ===================================================================== */}
        {activeTab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Inbox Messages</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Review contact form requests submitted by viewers.</p>
            </div>

            <div className="glass-panel" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      padding: '24px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: msg.read ? 'transparent' : 'rgba(255,255,255,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>{msg.name}</h4>
                          {!msg.read && (
                            <span style={{ fontSize: '0.65rem', background: '#ffc107', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                              NEW
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          From: {msg.email} &bull; Received: {new Date(msg.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleToggleMessageRead(msg)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            color: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          {msg.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          style={{
                            padding: '6px',
                            background: 'rgba(255,68,68,0.1)',
                            border: '1px solid rgba(255,68,68,0.2)',
                            borderRadius: '4px',
                            color: '#ff4444',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '16px', borderRadius: '6px' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                        Subject: {msg.subject || 'Direct Contact Request'}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Inbox is clean.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
           TABS: SETTINGS EDIT SCREEN
           ===================================================================== */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Profile & Services Settings</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Modify global profile bio, social details, showreel source and services grid.</p>
            </div>

            {/* Profile Settings Form */}
            <div className="glass-panel" style={{ padding: '40px', background: '#141414', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                Bio Details & Social Connections
              </h3>

              <form onSubmit={handleSaveProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="settings-row">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Display Roles</label>
                    <input
                      type="text"
                      required
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Biography (About text)</label>
                  <textarea
                    rows={4}
                    required
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }} className="settings-row-3">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Experience Span</label>
                    <input
                      type="text"
                      value={profile.experience}
                      onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Contact Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }} className="settings-row-3">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Instagram URL</label>
                    <input
                      type="text"
                      value={profile.instagram}
                      onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>LinkedIn URL</label>
                    <input
                      type="text"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>WhatsApp URL</label>
                    <input
                      type="text"
                      value={profile.whatsapp}
                      onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Showreel background URL (YouTube/Vimeo or direct MP4 link)</label>
                  <input
                    type="text"
                    value={profile.showreel_url}
                    onChange={(e) => setProfile({ ...profile, showreel_url: e.target.value })}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: 'fit-content',
                    marginTop: '10px'
                  }}
                >
                  Save Profile Settings
                </button>
              </form>
            </div>

            {/* Services Settings Form */}
            <div className="glass-panel" style={{ padding: '40px', background: '#141414', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                Services Offerings List
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="settings-row">
                {services.map((srv, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.15)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Service Title #{idx + 1}</label>
                      <input
                        type="text"
                        value={srv.title}
                        onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                        style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', padding: '8px 12px', color: '#fff', borderRadius: '4px', outline: 'none', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Short Description</label>
                      <textarea
                        rows={2}
                        value={srv.desc}
                        onChange={(e) => handleServiceChange(idx, 'desc', e.target.value)}
                        style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', padding: '8px 12px', color: '#fff', borderRadius: '4px', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveServicesSubmit}
                style={{
                  padding: '12px 24px',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '30px'
                }}
              >
                Save Services List
              </button>
            </div>
          </div>
        )}
      </main>

      {/* =======================================================================
         MODAL: PROJECT EDIT / CREATE SHEET OVERLAY
         ======================================================================= */}
      {projectFormOpen && editingProject && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5,5,5,0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 4000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '850px',
              height: '90vh',
              background: '#141414',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-hover)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingProject.id ? `Edit Project: ${editingProject.title}` : 'Scaffold New Project'}
              </h3>
              <button
                onClick={() => { setProjectFormOpen(false); setEditingProject(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSaveProjectSubmit} style={{ flexGrow: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }} className="settings-row">
                {/* Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                  />
                </div>
                {/* Slug */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Slug URL (autogenerated if empty)</label>
                  <input
                    type="text"
                    placeholder="e.g. project-campaign"
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Description Summary</label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }} className="settings-row-3">
                {/* Category Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none', cursor: 'pointer' }}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Client */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Client</label>
                  <input
                    type="text"
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                  />
                </div>
                {/* Year */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Year</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Video URL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cinematic Video Link (MP4, YouTube, or Vimeo)</label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={editingProject.video_url}
                  onChange={(e) => setEditingProject({ ...editingProject, video_url: e.target.value })}
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', color: '#fff', borderRadius: '6px', outline: 'none' }}
                />
              </div>

              {/* Flags */}
              <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Feature on Homepage</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={editingProject.published}
                    onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Publish Immediately</span>
                </label>
              </div>

              {/* Upload Cover image */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cover Showcase Image</label>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '100px', height: '70px', borderRadius: '4px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {editingProject.cover_image ? (
                      <img src={editingProject.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Upload size={16} /></div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="cover-file-upload"
                      onChange={(e) => handleFileUpload(e, 'cover')}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="cover-file-upload"
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Upload size={14} /> Upload Image
                    </label>
                  </div>
                </div>
              </div>

              {/* Upload Gallery Showcase */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Gallery Images Showcase (Drag & Drop to reorder list)
                  </label>
                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      id="gallery-file-upload"
                      onChange={(e) => handleFileUpload(e, 'gallery')}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="gallery-file-upload"
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Upload size={14} /> Upload Multi-Images
                    </label>
                  </div>
                </div>

                {/* Upload progress meters */}
                {Object.keys(uploadProgress).length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '4px' }}>
                    <p style={{ fontSize: '0.7rem', color: '#ffc107' }}>Uploading files in progress...</p>
                    {Object.entries(uploadProgress).map(([key, val]) => (
                      <div key={key} style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${val}%`, height: '100%', background: '#ffc107', transition: 'width 0.2s' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Image scatter list (Draggable) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '14px',
                    background: 'rgba(0,0,0,0.15)',
                    padding: '20px',
                    borderRadius: '8px',
                    minHeight: '80px',
                    border: '1px solid rgba(255,255,255,0.02)'
                  }}
                >
                  {editingProject.gallery_images && editingProject.gallery_images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, idx)}
                      style={{
                        position: 'relative',
                        aspectRatio: '1',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        background: '#000',
                        border: '1px solid rgba(255,255,255,0.05)',
                        cursor: 'grab'
                      }}
                    >
                      <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {/* Delete icon */}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(244,67,54,0.85)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                  {(!editingProject.gallery_images || editingProject.gallery_images.length === 0) && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', gridColumn: '1 / -1', textAlign: 'center', padding: '10px 0' }}>
                      No images in gallery collection yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Submit footer actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => { setProjectFormOpen(false); setEditingProject(null); }}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================================
         MODAL: TESTIMONIAL EDIT / CREATE SHEET OVERLAY
         ======================================================================= */}
      {testimonialFormOpen && editingTestimonial && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5,5,5,0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 4000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '550px',
              background: '#141414',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-hover)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Add Client Review</h3>
              <button
                onClick={() => { setTestimonialFormOpen(false); setEditingTestimonial(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Reviewer Name *</label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.name}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '10px', color: '#fff', borderRadius: '4px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Role / Title</label>
                  <input
                    type="text"
                    value={editingTestimonial.role}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '10px', color: '#fff', borderRadius: '4px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Company</label>
                  <input
                    type="text"
                    value={editingTestimonial.company}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '10px', color: '#fff', borderRadius: '4px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Review Description *</label>
                <textarea
                  rows={4}
                  required
                  value={editingTestimonial.content}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', padding: '10px', color: '#fff', borderRadius: '4px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rating (1-5 Stars)</label>
                <select
                  value={editingTestimonial.rating}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })}
                  style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', padding: '10px', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setTestimonialFormOpen(false); setEditingTestimonial(null); }}
                  style={{ padding: '10px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 18px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled overrides for CMS */}
      <style>{`
        @media (max-width: 1024px) {
          aside {
            display: none !important;
          }
          main {
            margin-left: 0 !important;
            padding: 24px 16px !important;
          }
          .dashboard-subgrid {
            grid-template-columns: 1fr !important;
          }
          .settings-row {
            grid-template-columns: 1fr !important;
          }
          .settings-row-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
