import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme Context - Dark/Light mode boshqaruvi
const ThemeContext = createContext();

// Custom hook - Theme ishlatish uchun
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme Provider komponenti
export const ThemeProvider = ({ children }) => {
  // localStorage'dan yoki system preference'dan olish
  const [isDark, setIsDark] = useState(() => {
    // Avval localStorage'ni tekshiramiz
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // System preference'ni tekshiramiz
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Theme o'zgarganda DOM'ni yangilash
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // localStorage'ga saqlash
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // System preference o'zgarishini kuzatish
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Agar foydalanuvchi preference tanlamagan bo'lsa
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Theme almashtirish funksiyasi
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Light mode'ga o'tish
  const setLightMode = () => setIsDark(false);

  // Dark mode'ga o'tish
  const setDarkMode = () => setIsDark(true);

  const value = {
    isDark,
    toggleTheme,
    setLightMode,
    setDarkMode,
    theme: isDark ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
