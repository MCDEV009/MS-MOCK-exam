import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Premium Navbar komponenti
 * Glassmorphism effekti va animatsiyalar bilan
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Active link tekshirish
  const isActive = (path) => location.pathname === path;

  // Navigation links
  const navLinks = user ? [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/take-test', label: 'Test', icon: '📝' },
    { path: '/leaderboard', label: 'Reyting', icon: '🏆' },
    { path: '/statistics', label: 'Statistika', icon: '📊' },
  ] : [];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[var(--glass-border)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-[var(--text-primary)] hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl animate-bounce">📐</span>
            <span className="hidden sm:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MS Mock
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${isActive(link.path)
                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-blue-500/30'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-all duration-300 hover:scale-110"
              title={isDark ? "Light mode" : "Dark mode"}
            >
              <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
            </button>

            {user ? (
              <>
                {/* User menu */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-tertiary)]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-medium text-[var(--text-primary)]">{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Chiqish
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {mobileMenuOpen ? (
                      <path d="M18 6L6 18M6 6l12 12" />
                    ) : (
                      <path d="M3 12h18M3 6h18M3 18h18" />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="btn btn-ghost"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden py-4 border-t border-[var(--border-color)] animate-fade-in-down">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${isActive(link.path)
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <hr className="my-2 border-[var(--border-color)]" />
              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-all"
              >
                <span className="text-xl">🚪</span>
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
