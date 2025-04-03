import React, { useEffect, useState, createContext, useContext } from 'react';
type Theme = 'dark' | 'light';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>('dark');
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    if (theme === 'dark') {
      document.documentElement.style.backgroundColor = '#09090b';
      document.documentElement.style.color = '#ffffff';
    } else {
      document.documentElement.style.backgroundColor = '#ffffff';
      document.documentElement.style.color = '#09090b';
    }
  }, [theme]);
  return <ThemeContext.Provider value={{
    theme,
    toggleTheme
  }}>
      {children}
    </ThemeContext.Provider>;
}
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};