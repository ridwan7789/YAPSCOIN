import React, { useState, useEffect } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL
}) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Membuat path WebP berdasarkan path gambar asli
    const webpPath = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    // Menentukan format gambar yang optimal berdasarkan dukungan browser
    const supportsWebP = checkWebPSupport();
    
    let optimizedSrc = src; // Default ke sumber asli
    
    if (supportsWebP) {
      // Gunakan path WebP jika browser mendukung
      optimizedSrc = webpPath;
    } else {
      // Jika browser tidak mendukung WebP, gunakan sumber asli
      optimizedSrc = src;
    }
    
    setImageSrc(optimizedSrc);
  }, [src]);

  const checkWebPSupport = (): boolean => {
    // Fallback untuk server-side rendering
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    // Jika format optimasi gagal (misalnya file WebP tidak ditemukan), kembali ke sumber asli
    if (imageSrc !== src) {
      setImageSrc(src);
    }
  };

  // Fallback ke gambar asli jika error
  const finalSrc = error ? src : imageSrc;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && placeholder === 'blur' && blurDataURL && (
        <img 
          src={blurDataURL} 
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      <img
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{
          transition: 'opacity 0.3s ease-in-out'
        }}
        loading={priority ? 'eager' : 'lazy'}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ImageOptimizer;