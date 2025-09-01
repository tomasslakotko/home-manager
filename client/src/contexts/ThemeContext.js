import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme configurations
const themes = {
  light: {
    name: 'light',
    colors: {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      secondary: '#64748b',
      secondaryHover: '#475569',
      success: '#16a34a',
      warning: '#ca8a04',
      error: '#dc2626',
      info: '#0891b2',
      
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceHover: '#f1f5f9',
      border: '#e2e8f0',
      divider: '#cbd5e1',
      
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        disabled: '#94a3b8',
        inverse: '#ffffff'
      },
      
      status: {
        online: '#16a34a',
        offline: '#dc2626',
        away: '#ca8a04',
        busy: '#dc2626'
      }
    },
    
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    },
    
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    }
  },
  
  dark: {
    name: 'dark',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#60a5fa',
      secondary: '#94a3b8',
      secondaryHover: '#cbd5e1',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#06b6d4',
      
      background: '#0f172a',
      surface: '#1e293b',
      surfaceHover: '#334155',
      border: '#334155',
      divider: '#475569',
      
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        disabled: '#64748b',
        inverse: '#0f172a'
      },
      
      status: {
        online: '#22c55e',
        offline: '#ef4444',
        away: '#eab308',
        busy: '#ef4444'
      }
    },
    
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)'
    },
    
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else if (systemTheme && themes[systemTheme]) {
      setCurrentTheme(systemTheme);
    }
  }, [systemTheme]);

  // Apply theme to document
  useEffect(() => {
    const theme = themes[currentTheme];
    if (theme) {
      // Apply CSS custom properties
      Object.entries(theme.colors).forEach(([key, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            document.documentElement.style.setProperty(
              `--color-${key}-${subKey}`,
              subValue
            );
          });
        } else {
          document.documentElement.style.setProperty(`--color-${key}`, value);
        }
      });

      // Apply shadows
      Object.entries(theme.shadows).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--shadow-${key}`, value);
      });

      // Apply border radius
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--radius-${key}`, value);
      });

      // Set theme class on body
      document.body.className = `theme-${theme.name}`;
    }
  }, [currentTheme]);

  // Change theme
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('theme', themeName);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
  };

  // Reset to system theme
  const resetToSystemTheme = () => {
    changeTheme(systemTheme);
  };

  const value = {
    currentTheme,
    systemTheme,
    theme: themes[currentTheme],
    changeTheme,
    toggleTheme,
    resetToSystemTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
