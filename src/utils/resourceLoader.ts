// utils/resourceLoader.ts

// Interface untuk preload resource
export interface ResourceConfig {
  url: string;
  as: 'script' | 'style' | 'image' | 'font' | 'fetch';
  type?: string;
  crossorigin?: boolean;
}

// Fungsi untuk preload resource
export const preloadResource = (config: ResourceConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Cek apakah resource sudah dipreload sebelumnya
    if (document.querySelector(`link[href="${config.url}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = config.as;
    link.href = config.url;
    
    if (config.type) {
      link.type = config.type;
    }
    
    if (config.crossorigin) {
      link.crossOrigin = 'anonymous';
    }

    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload: ${config.url}`));

    document.head.appendChild(link);
  });
};

// Fungsi untuk preload beberapa resource sekaligus
export const preloadResources = async (configs: ResourceConfig[]): Promise<void[]> => {
  return Promise.all(configs.map(config => preloadResource(config)));
};

// Fungsi untuk prefetch resource yang mungkin dibutuhkan nanti
export const prefetchResource = (url: string): void => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
};

// Fungsi untuk preload font penting
export const preloadCriticalFonts = async (): Promise<void> => {
  // Ini adalah contoh - ganti dengan font yang digunakan di aplikasi Anda
  const fontResources: ResourceConfig[] = [
    // Tambahkan font penting di sini jika ada
  ];
  
  if (fontResources.length > 0) {
    await preloadResources(fontResources);
  }
};

// Fungsi untuk mengelola resource berdasarkan prioritas
export const loadResourceByPriority = async (resources: ResourceConfig[]) => {
  // Resource dengan prioritas tinggi (critical)
  const criticalResources = resources.filter(r => ['script', 'style'].includes(r.as));
  // Resource dengan prioritas rendah (non-critical)
  const nonCriticalResources = resources.filter(r => !['script', 'style'].includes(r.as));

  // Load critical resources dulu
  await preloadResources(criticalResources);
  
  // Load non-critical resources di background
  nonCriticalResources.forEach(resource => {
    prefetchResource(resource.url);
  });
};

// Fungsi untuk lazy load resource hanya saat dibutuhkan
export class LazyResourceLoader {
  private loadedUrls: Set<string> = new Set();

  async load(url: string, as: ResourceConfig['as']): Promise<void> {
    if (this.loadedUrls.has(url)) {
      return Promise.resolve();
    }

    const config: ResourceConfig = { url, as };
    try {
      await preloadResource(config);
      this.loadedUrls.add(url);
    } catch (error) {
      console.error(`Failed to load resource ${url}:`, error);
      throw error;
    }
  }
}