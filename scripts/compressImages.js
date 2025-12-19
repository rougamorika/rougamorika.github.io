import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

const bannerDir = 'public/banner';
const outputDir = 'public/banner-optimized';

async function compressImages() {
  console.log('🖼️  Starting image compression...\n');

  // Create output directory if it doesn't exist
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
    console.log(`✓ Created output directory: ${outputDir}\n`);
  }

  // Read all files in banner directory
  const files = await readdir(bannerDir);
  const imageFiles = files.filter(file =>
    /\.(png|jpg|jpeg)$/i.test(file)
  );

  console.log(`Found ${imageFiles.length} images to compress\n`);

  let totalOriginalSize = 0;
  let totalCompressedSize = 0;

  for (const file of imageFiles) {
    const inputPath = join(bannerDir, file);
    const ext = extname(file).toLowerCase();

    // Keep original extension but optimize
    const outputPath = join(outputDir, file);

    try {
      // Get original file size using fs.stat
      const originalStats = await stat(inputPath);
      const originalSize = originalStats.size;

      // Compress image
      let pipeline = sharp(inputPath)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        });

      // Apply format-specific compression
      if (ext === '.png') {
        pipeline = pipeline.png({
          quality: 85,
          compressionLevel: 9,
          palette: true
        });
      } else if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({
          quality: 85,
          mozjpeg: true
        });
      }

      await pipeline.toFile(outputPath);

      // Get compressed file size using fs.stat
      const compressedStats = await stat(outputPath);
      const compressedSize = compressedStats.size;

      totalOriginalSize += originalSize;
      totalCompressedSize += compressedSize;

      const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      const originalMB = (originalSize / 1024 / 1024).toFixed(2);
      const compressedMB = (compressedSize / 1024 / 1024).toFixed(2);

      console.log(`✓ ${file}`);
      console.log(`  ${originalMB}MB → ${compressedMB}MB (saved ${savings}%)`);
    } catch (error) {
      console.error(`✗ Failed to compress ${file}:`, error.message);
    }
  }

  // Summary
  const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
  const totalOriginalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
  const totalCompressedMB = (totalCompressedSize / 1024 / 1024).toFixed(2);
  const savedMB = ((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2);

  console.log('\n' + '='.repeat(50));
  console.log('📊 Compression Summary:');
  console.log('='.repeat(50));
  console.log(`Total original size:    ${totalOriginalMB}MB`);
  console.log(`Total compressed size:  ${totalCompressedMB}MB`);
  console.log(`Total savings:          ${totalSavings}%`);
  console.log(`Saved:                  ${savedMB}MB`);
  console.log('='.repeat(50));
  console.log('\n✅ Compression complete!');
  console.log(`\nCompressed images are in: ${outputDir}`);
  console.log('\nNext steps:');
  console.log('1. Review the compressed images');
  console.log('2. If satisfied, replace the original files:');
  console.log('   rm -rf public/banner/*');
  console.log('   mv public/banner-optimized/* public/banner/');
  console.log('   rmdir public/banner-optimized');
}

compressImages().catch(console.error);
