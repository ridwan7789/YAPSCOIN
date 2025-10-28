import React, { lazy, Suspense } from 'react';

// Komponen loading sederhana
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Fungsi untuk membuat komponen lazy dengan error boundary
export const lazyLoad = (importFunc: () => Promise<{ default: React.ComponentType<any> }>) => {
  const Component = lazy(importFunc);
  
  return (props: any) => (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
};

// Contoh penggunaan lazy load untuk halaman
export const LazyHome = lazyLoad(() => import('@/pages/Home'));
export const LazyAbout = lazyLoad(() => import('@/pages/About'));
export const LazyContact = lazyLoad(() => import('@/pages/Contact'));
export const LazyDashboard = lazyLoad(() => import('@/pages/Dashboard'));

// Komponen dengan lazy load berbasis kondisi
interface ConditionalLoadProps {
  condition: boolean;
  fallback?: React.ReactNode;
  children: () => Promise<{ default: React.ComponentType<any> }>;
}

export const ConditionalLoad: React.FC<ConditionalLoadProps> = ({ 
  condition, 
  fallback = <LoadingSpinner />, 
  children 
}) => {
  const [LoadedComponent, setLoadedComponent] = React.useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (condition) {
      const importComponent = async () => {
        try {
          const module = await children();
          setLoadedComponent(() => module.default);
        } catch (error) {
          console.error('Error loading component:', error);
        } finally {
          setLoading(false);
        }
      };

      importComponent();
    } else {
      setLoading(false);
    }
  }, [condition]);

  if (!condition) {
    return null;
  }

  if (loading || !LoadedComponent) {
    return fallback;
  }

  return <LoadedComponent />;
};

// Lazy load untuk komponen yang besar
export const LazyChart = lazyLoad(() => import('@/components/Chart'));
export const LazyModal = lazyLoad(() => import('@/components/Modal'));
export const LazyCarousel = lazyLoad(() => import('@/components/Carousel'));