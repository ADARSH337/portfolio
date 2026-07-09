import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { supabase, isMockMode } from './supabaseClient';

type PageView = 'site' | 'login' | 'cms';

function App() {
  const [view, setView] = useState<PageView>('site');
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check initial authentication state
  useEffect(() => {
    const checkSession = async () => {
      if (isMockMode) {
        // Mock Mode: check local sessionStorage token
        const mockToken = sessionStorage.getItem('ak_auth_token');
        setIsAuthenticated(mockToken === 'mock-session-token');
        setSessionChecked(true);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setSessionChecked(true);
      }
    };

    checkSession();

    // In Supabase mode, listen to auth state changes
    if (!isMockMode) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleNavigateToCms = () => {
    if (isAuthenticated) {
      setView('cms');
    } else {
      setView('login');
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('cms');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('site');
  };

  if (!sessionChecked) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#090909' }}>
        <p style={{ color: '#fff', fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Verifying Session...
        </p>
      </div>
    );
  }

  return (
    <>
      {view === 'site' && (
        <Home onNavigateToCms={handleNavigateToCms} />
      )}
      {view === 'login' && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={() => setView('site')}
        />
      )}
      {view === 'cms' && (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
