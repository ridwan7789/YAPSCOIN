import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { readFile, writeFile, readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Fungsi untuk mengonversi file ke WebP
const convertToWebP = async (inputPath, outputPath, quality = 80) => {
  try {
    const files = await imagemin([inputPath], {
      plugins: [
        imageminWebp({
          quality: quality,      // Kualitas 0-100 (lebih tinggi = kualitas lebih baik tetapi ukuran lebih besar)
          lossless: false,       // false untuk kompresi lossy (ukuran lebih kecil), true untuk lossless (ukuran lebih besar tapi kualitas sempurna)
          alphaQuality: 85       // Kualitas channel alpha jika ada
        })
      ]
    });

    if (files.length > 0) {
      await writeFile(outputPath, files[0].data);
      console.log(`✓ Konversi berhasil: ${inputPath} -> ${outputPath}`);
      
      // Tampilkan info ukuran sebelum dan sesudah
      const originalStats = await stat(inputPath);
      const newStats = await stat(outputPath);
      const originalSize = originalStats.size;
      const newSize = newStats.size;
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);
      
      console.log(`  Ukuran asli: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Ukuran WebP: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Pengurangan: ${reduction}%`);
    } else {
      console.log(`✗ Gagal konversi: ${inputPath}`);
    }
  } catch (error) {
    console.error(`Error saat mengonversi ${inputPath}:`, error.message);
  }
};

// Fungsi untuk mengonversi semua gambar dalam direktori
const convertAllImages = async (srcDir, destDir, quality = 80) => {
  try {
    // Pastikan direktori tujuan ada
    await mkdir(destDir, { recursive: true });
    
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.tif', '.gif'];

    const files = await readdir(srcDir);
    
    for (const file of files) {
      const filePath = join(srcDir, file);
      const ext = extname(file).toLowerCase();
      
      if (imageExtensions.includes(ext)) {
        const outputFileName = basename(file, ext) + '.webp';
        const outputPath = join(destDir, outputFileName);
        
        await convertToWebP(filePath, outputPath, quality);
      }
    }
  } catch (error) {
    console.error('Error saat mengonversi semua gambar:', error.message);
  }
};

// Fungsi utama
const main = async () => {
  // Dapatkan path absolut ke direktori assets
  const projectRoot = join(__dirname, '..');
  const srcDir = join(projectRoot, 'src', 'assets');
  const destDir = join(projectRoot, 'src', 'assets', 'webp');
  
  console.log('Memulai konversi gambar ke WebP...\n');
  await convertAllImages(srcDir, destDir, 80);  // Kualitas 80 - keseimbangan bagus antara ukuran dan kualitas
  console.log('\nKonversi selesai!');
};

// Jalankan fungsi utama
main().catch(console.error);