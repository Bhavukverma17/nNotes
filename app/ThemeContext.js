import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  useEffect(() => {
    const loadThemeSetting = async () => {
      try {
        const savedThemeSetting = await AsyncStorage.getItem('isDarkMode');
        if (savedThemeSetting !== null) {
          setIsDarkMode(savedThemeSetting === 'true');
        }
      } catch (error) {
        console.error('Failed to load theme setting:', error);
      }
    };

    loadThemeSetting();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription.remove();
  }, []);

  const toggleTheme = async () => {
    const newThemeSetting = !isDarkMode;
    setIsDarkMode(newThemeSetting);

    try {
      await AsyncStorage.setItem('isDarkMode', newThemeSetting.toString());
    } catch (error) {
      console.error('Failed to save theme setting:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;