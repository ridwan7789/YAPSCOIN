import { useState, useEffect } from 'react';

export const useLazyLoad = (importFunc: () => Promise<any>, deps: any[] = []) => {
  const [component, setComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    importFunc()
      .then(module => {
        setComponent(module.default || module);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
        console.error('Error loading component:', err);
      });
  }, deps);

  return { component, loading, error };
};

// Hook untuk lazy load gambar
export const useImageLoader = (src: string) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImageSrc(src);
    };
    img.onerror = () => {
      setImageError(true);
    };
    img.src = src;
  }, [src]);

  return { imageLoaded, imageError, imageSrc };
};