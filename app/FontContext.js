import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const fonts = {
    ntype: '1. NType',
    ndot: '2. NDot',
    ndotcapi : '3. NDot Caps',
    interm : '4. Inter',
  };

  const [selectedFont, setSelectedFont] = useState('ntype');

  useEffect(() => {
    const loadFontSetting = async () => {
      try {
        const savedFont = await AsyncStorage.getItem('selectedFont');
        if (savedFont && Object.keys(fonts).includes(savedFont)) {
          setSelectedFont(savedFont);
        }
      } catch (error) {
        console.error('Failed to load font setting:', error);
      }
    };

    loadFontSetting();
  }, []);

  const selectFont = async (fontKey) => {
    setSelectedFont(fontKey);
    try {
      await AsyncStorage.setItem('selectedFont', fontKey);
    } catch (error) {
      console.error('Failed to save font setting:', error);
    }
  };

  return (
    <FontContext.Provider value={{ fonts, selectedFont, selectFont }}>
      {children}
    </FontContext.Provider>
  );
};