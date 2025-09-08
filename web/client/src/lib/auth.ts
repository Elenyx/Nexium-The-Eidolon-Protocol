import { useState, useEffect } from 'react';
import type { AuthUser } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL parameters for user data from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        setUser(userData);
        localStorage.setItem('nexium_user', JSON.stringify(userData));
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      // Check localStorage for existing user
      const savedUser = localStorage.getItem('nexium_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('nexium_user');
        }
      }
    }
    
    setLoading(false);
  }, []);

  const login = () => {
    window.location.href = '/api/auth/discord';
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexium_user');
  };

  return { user, loading, login, logout };
}
