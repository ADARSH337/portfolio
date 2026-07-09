import React, { useState } from 'react';
import { supabase, isMockMode } from '../supabaseClient';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    if (isMockMode) {
      // Simulate login in Mock Mode
      setTimeout(() => {
        setLoading(false);
        // Save auth state in sessionStorage for current tab session
        sessionStorage.setItem('ak_auth_token', 'mock-session-token');
        onLoginSuccess();
      }, 800);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (data?.user) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#090909',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: '20px'
      }}
    >
      {/* Back to site button */}
      <button
        onClick={onBackToSite}
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'color 0.3s'
        }}
        className="interactive-card"
        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        <ArrowLeft size={16} />
        Back to Portfolio
      </button>

      {/* Login Card */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '50px 40px',
          background: 'rgba(20, 20, 20, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px'
        }}
      >
        {/* Shield Icon branding */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          <Shield size={28} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            STUDIO CMS
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Authenticate to access the administrative dashboard.
          </p>
        </div>

        {/* Warning about mock mode bypass */}
        {isMockMode && (
          <div
            style={{
              width: '100%',
              background: 'rgba(255, 165, 0, 0.08)',
              border: '1px solid rgba(255, 165, 0, 0.15)',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.8rem',
              color: '#ffa500',
              lineHeight: 1.4
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <strong>Mock Mode Active:</strong> You can log in using any credentials (e.g., <code>admin@adarsh.com</code> / <code>admin</code>) for local testing.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                  padding: '12px 16px 12px 42px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                  padding: '12px 16px 12px 42px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                className="form-input"
              />
            </div>
          </div>

          {error && (
            <div style={{ color: '#ff4444', fontSize: '0.85rem', background: 'rgba(255, 68, 68, 0.08)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255, 68, 68, 0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '10px',
              transition: 'opacity 0.3s'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>

      <style>{`
        .form-input:focus {
          border-color: rgba(255,255,255,0.2) !important;
          background: rgba(255,255,255,0.04) !important;
        }
      `}</style>
    </div>
  );
};
