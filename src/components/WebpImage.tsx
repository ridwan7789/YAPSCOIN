import React, { useState, useEffect } from 'react';

// Tipe untuk path gambar WebP yang tersedia
type WebpImageName = 
  | 'baner-space'
  | 'cheems-character'
  | 'hero-space'
  | 'yaps-logo';

interface WebpImageProps {
  name: WebpImageName;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  title?: string; // For SEO purposes
  loading?: 'eager' | 'lazy'; // Override default loading behavior
  decoding?: 'async' | 'sync' | 'auto'; // Override default decoding behavior
}

const WebpImage: React.FC<WebpImageProps> = ({
  name,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  title,
  loading: loadingProp = 'lazy',
  decoding: decodingProp = 'async'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(true); // Assume WebP is supported by default

  // Check WebP support once when the component is mounted
  useEffect(() => {
    const checkWebPSupport = () => {
      // Fallback for server-side rendering
      if (typeof window === 'undefined' || !window.createImageBitmap) {
        setSupportsWebP(true); // Assume WebP is supported modern browsers
        return;
      }

      const webP = new Image();
      webP.onload = webP.onerror = function () {
        setSupportsWebP(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    checkWebPSupport();
  }, []);

  // Path ke direktori WebP
  const webpPath = `/assets/webp/${name}.webp`;
  const fallbackPath = `/assets/${name}.${name === 'hero-space' ? 'jpg' : 'png'}`;
  const finalPath = supportsWebP && !showFallback ? webpPath : fallbackPath;

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    if (!showFallback && supportsWebP) {
      // If error and we haven't shown fallback yet, and webp is supported, try fallback
      setShowFallback(true);
    } else {
      // If already showing fallback or webP isn't supported and still erroring, show error
      setImageError(true);
    }
  };

  // Set loading behavior based on priority prop or passed loading prop
  const finalLoading = priority ? 'eager' : loadingProp;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {placeholder === 'blur' && blurDataURL && !imageLoaded && (
        <img 
          src={blurDataURL} 
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      
      {/* Optimized image with WebP support */}
      <img
        src={finalPath}
        alt={alt}
        width={width}
        height={height}
        title={title}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={finalLoading}
        decoding={decodingProp}
        // Add image dimensions for SEO and performance
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto',
        }}
      />
      
      {/* Loading indicator */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          {priority ? null : ( // Don't show spinner for priority images
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      )}
      
      {/* Error indicator */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
          <span className="text-gray-600">Image not found</span>
        </div>
      )}
    </div>
  );
};

export default WebpImage;