// app/context/ThemeContext.js - Theme Management Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, createCommonStyles } from '../styles/theme';

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.dark); // Default to dark
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      console.log('Loaded theme preference:', savedTheme);
      
      if (savedTheme === 'light') {
        setCurrentTheme(themes.light);
        setIsDark(false);
      } else {
        setCurrentTheme(themes.dark);
        setIsDark(true);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      // Default to dark theme on error
      setCurrentTheme(themes.dark);
      setIsDark(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Save theme preference
  const saveThemePreference = async (themeType) => {
    try {
      await AsyncStorage.setItem('theme', themeType);
      console.log('Saved theme preference:', themeType);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Toggle between dark and light theme
  const toggleTheme = async () => {
    const newIsDark = !isDark;
    const newTheme = newIsDark ? themes.dark : themes.light;
    const themeType = newIsDark ? 'dark' : 'light';
    
    setIsDark(newIsDark);
    setCurrentTheme(newTheme);
    
    // Save preference
    await saveThemePreference(themeType);
    
    console.log('Theme toggled to:', themeType);
  };

  // Set specific theme
  const setTheme = async (themeType) => {
    const newIsDark = themeType === 'dark';
    const newTheme = newIsDark ? themes.dark : themes.light;
    
    setIsDark(newIsDark);
    setCurrentTheme(newTheme);
    
    // Save preference
    await saveThemePreference(themeType);
    
    console.log('Theme set to:', themeType);
  };

  // Load theme on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Create common styles based on current theme
  const commonStyles = createCommonStyles(currentTheme);

  const value = {
    // Theme state
    currentTheme,
    isDark,
    isLoading,
    
    // Theme actions
    toggleTheme,
    setTheme,
    
    // Convenience properties
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    spacing: currentTheme.spacing,
    borderRadius: currentTheme.borderRadius,
    shadows: currentTheme.shadows,
    dimensions: currentTheme.dimensions,
    
    // Common styles
    commonStyles,
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// HOC for components that need theme
export const withTheme = (Component) => {
  return (props) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

export default ThemeContext;