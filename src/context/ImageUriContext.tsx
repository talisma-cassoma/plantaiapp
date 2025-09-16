// src/context/ImageUriContext.tsx
import React, { createContext, useContext, useState } from 'react';

type ImageUriContextType = {
  selectedImageUri: string | null;
  setSelectedImageUri: (uri: string | null) => void;
  isLoading: boolean; 
  setIsLoading: (loading: boolean) => void; 
};

const ImageUriContext = createContext<ImageUriContextType | undefined>(undefined);

export const ImageUriProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ImageUriContext.Provider value={{ selectedImageUri, setSelectedImageUri, isLoading, setIsLoading}}>
      {children}
    </ImageUriContext.Provider>
  );
};

export const useImageUri = () => {
  const context = useContext(ImageUriContext);
  if (!context) {
    throw new Error('useImageUri must be used within an ImageUriProvider');
  }
  return context;
};
