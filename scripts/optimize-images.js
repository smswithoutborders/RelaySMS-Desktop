#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToOptimize = [
  {
    input: 'public/images/login.png',
    output: 'public/images/login.png',
    quality: 85
  },
  {
    input: 'public/images/homepage-lg.png',
    output: 'public/images/homepage-lg.png',
    quality: 85
  }
];

async function optimizeImages() {
  console.log('Starting image optimization...\n');
  
  for (const image of imagesToOptimize) {
    const inputPath = path.resolve(__dirname, '..', image.input);
    const outputPath = path.resolve(__dirname, '..', image.output);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${image.input} (file not found)`);
      continue;
    }
    
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024).toFixed(2);
    
    try {
      await sharp(inputPath)
        .png({ quality: image.quality, compressionLevel: 9 })
        .toFile(outputPath + '.tmp');
      
      // Replace original with optimized version
      fs.renameSync(outputPath + '.tmp', outputPath);
      
      const newStats = fs.statSync(outputPath);
      const newSize = (newStats.size / 1024).toFixed(2);
      const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
      
      console.log(`✓ ${image.input}`);
      console.log(`  ${originalSize} KB → ${newSize} KB (saved ${savings}%)\n`);
    } catch (error) {
      console.error(`✗ Error optimizing ${image.input}:`, error.message);
    }
  }
  
  console.log('Image optimization complete!');
}

optimizeImages().catch(console.error);
