import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// Fungsi untuk mengelompokkan modul ke dalam chunk
const getManualChunks = () => {
  return {
    // React core libraries
    'react-core': ['react', 'react-dom'],
    
    // Router
    'router': ['react-router-dom'],
    
    // UI libraries
    'ui-lib': [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
      'lucide-react',
      'sonner',
      'vaul'
    ],
    
    // Data handling
    'data-handling': [
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'zod',
      'react-hook-form'
    ],
    
    // Utilities
    'utils': [
      'date-fns',
      'clsx',
      'tailwind-merge',
      'class-variance-authority'
    ],
    
    // Animation and effects
    'animation': ['framer-motion'],
    
    // Charts and visualization
    'charts': ['recharts']
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    react(),
    process.env.ANALYZE === '1' && visualizer({
      filename: 'dist/stats.html',
      open: true,
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: getManualChunks(),
      },
    },
    // Mengaktifkan compress untuk hasil build yang lebih kecil
    cssMinify: true,
    minify: 'terser', // Gunakan terser untuk kompresi yang lebih baik
    terserOptions: {
      compress: {
        drop_console: true, // Hapus console.log dalam produksi
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query',
    ],
  },
});