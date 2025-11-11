import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Create the context
const SettingsContext = createContext();

// 2. Create the provider component
export const SettingsProvider = ({ children }) => {
  // Default to true (current behavior)
  const [showCategoryChip, setShowCategoryChip] = useState(true);

  useEffect(() => {
    // Load the setting from storage when the app starts
    const loadSetting = async () => {
      try {
        const savedSetting = await AsyncStorage.getItem('showCategoryChip');
        // Only update state if a setting was saved, otherwise use default
        if (savedSetting !== null) {
          setShowCategoryChip(savedSetting === 'true');
        }
      } catch (error) {
        console.error('Failed to load showCategoryChip setting:', error);
      }
    };
    loadSetting();
  }, []);

  // 3. Create the function to toggle and save the setting
  const toggleShowCategoryChip = async () => {
    const newValue = !showCategoryChip;
    setShowCategoryChip(newValue);
    try {
      // Save the new setting to storage
      await AsyncStorage.setItem('showCategoryChip', newValue.toString());
    } catch (error) {
      console.error('Failed to save showCategoryChip setting:', error);
    }
  };

  // 4. Provide the value and the toggle function to children
  return (
    <SettingsContext.Provider value={{ showCategoryChip, toggleShowCategoryChip }}>
      {children}
    </SettingsContext.Provider>
  );
};

// 5. (Optional) A custom hook to make it easier to use
export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;