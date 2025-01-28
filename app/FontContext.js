import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [isCustomFont, setIsCustomFont] = useState(false);

  useEffect(() => {
    const loadFontSetting = async () => {
      try {
        const savedFontSetting = await AsyncStorage.getItem('isCustomFont');
        if (savedFontSetting !== null) {
          setIsCustomFont(savedFontSetting === 'true');
        }
      } catch (error) {
        console.error('Failed to load font setting:', error);
      }
    };

    loadFontSetting();
  }, []);

  const toggleFont = async () => {
    const newFontSetting = !isCustomFont;
    setIsCustomFont(newFontSetting);

    try {
      await AsyncStorage.setItem('isCustomFont', newFontSetting.toString());
    } catch (error) {
      console.error('Failed to save font setting:', error);
    }
  };

  return (
    <FontContext.Provider value={{ isCustomFont, toggleFont }}>
      {children}
    </FontContext.Provider>
  );
};
