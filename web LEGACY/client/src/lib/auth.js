import { useState, useEffect } from 'react';
export function useAuth() {
    var _a = useState(null), user = _a[0], setUser = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    useEffect(function () {
        // Check URL parameters for user data from OAuth callback
        var urlParams = new URLSearchParams(window.location.search);
        var userParam = urlParams.get('user');
        if (userParam) {
            try {
                var userData = JSON.parse(decodeURIComponent(userParam));
                setUser(userData);
                localStorage.setItem('nexium_user', JSON.stringify(userData));
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
            catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        else {
            // Check localStorage for existing user
            var savedUser = localStorage.getItem('nexium_user');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                }
                catch (error) {
                    console.error('Error parsing saved user data:', error);
                    localStorage.removeItem('nexium_user');
                }
            }
        }
        setLoading(false);
    }, []);
    var login = function () {
        window.location.href = '/api/auth/discord';
    };
    var logout = function () {
        setUser(null);
        localStorage.removeItem('nexium_user');
    };
    return { user: user, loading: loading, login: login, logout: logout };
}
