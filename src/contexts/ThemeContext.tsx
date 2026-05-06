import React, { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  ThemeToggle: React.FC;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-muted"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 transition-transform duration-300" />
      )}
    </button>
  );

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, ThemeToggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
