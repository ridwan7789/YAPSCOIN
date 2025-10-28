// server/middleware.js (ini adalah contoh implementasi untuk deployment server)

// Karena ini adalah aplikasi client-side React/Vite, 
// kita tidak memiliki server-side code di sini.
// Namun, kita bisa menyiapkan file konfigurasi untuk deployment yang optimal

const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();

// Aktifkan kompresi Gzip
app.use(compression({
  // Hanya kompresi untuk request dengan ukuran > 1KB
  threshold: 1024,
  // Pilih level kompresi (0-9, 9 adalah paling tinggi)
  level: 6
}));

// Set cache headers untuk file statis
app.use(express.static('dist', {
  maxAge: '1y', // Cache file statis (JS, CSS, gambar) selama 1 tahun
  setHeaders: (res, filePath) => {
    // Untuk file HTML, jangan cache atau cache sebentar
    if (path.extname(filePath) === '.html') {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      // Untuk aset statis lainnya, cache lama
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Middleware untuk menangani SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

module.exports = app;

// Untuk penggunaan di deployment production, Anda bisa menggunakan file ini
// dengan framework Node.js seperti Express