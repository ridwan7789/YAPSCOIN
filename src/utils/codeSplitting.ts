// utils/codeSplitting.ts

// Fungsi untuk melakukan dynamic import berdasarkan kondisi
export const dynamicImport = async <T,>(importFunc: () => Promise<T>, condition: boolean = true): Promise<T | null> => {
  if (condition) {
    try {
      return await importFunc();
    } catch (error) {
      console.error('Dynamic import failed:', error);
      return null;
    }
  }
  return null;
};

// Fungsi untuk load modul berdasarkan ukuran atau kebutuhan
export const loadOnDemand = async <T,>(importFunc: () => Promise<T>, threshold: number = 1024): Promise<T> => {
  // Cek apakah browser mendukung navigator.connection (untuk bandwidth rendah)
  const isLowBandwidth = 
    (navigator.connection && 
    (navigator.connection.effectiveType === 'slow-2g' || 
     navigator.connection.effectiveType === '2g')) 
     || window.navigator.onLine === false;

  // Jika bandwidth rendah dan ukuran modul besar, tunda load
  if (isLowBandwidth && threshold > 512) { // threshold dalam KB
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1 detik
  }

  try {
    return await importFunc();
  } catch (error) {
    console.error('On-demand import failed:', error);
    throw error;
  }
};

// Fungsi untuk membongkar (unload) modul yang tidak digunakan
export const unloadModule = (moduleRef: any) => {
  // Hapus referensi ke modul untuk memungkinkan garbage collection
  moduleRef = null;
};

// Fungsi untuk mengelompokkan impor yang jarang digunakan
export const lazyGroupImports = async (group: string) => {
  switch (group) {
    case 'charts':
      return await import('../components/ChartComponents');
    case 'modals':
      return await import('../components/ModalComponents');
    case 'forms':
      return await import('../components/FormComponents');
    case 'animations':
      return await import('../components/AnimationComponents');
    default:
      throw new Error(`Unknown import group: ${group}`);
  }
};