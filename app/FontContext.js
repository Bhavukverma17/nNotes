import React, { createContext, useState } from 'react';

export const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [isCustomFont, setIsCustomFont] = useState(false);

  const toggleFont = () => {
    setIsCustomFont((prev) => !prev);
  };

  return (
    <FontContext.Provider value={{ isCustomFont, toggleFont }}>
      {children}
    </FontContext.Provider>
  );
};
