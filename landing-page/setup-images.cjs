/**
 * Image Setup Helper for Hair Studio Landing Page
 * 
 * Instructions:
 * 1. Save your uploaded app screenshots to landing-page/img/ with these names:
 *    - screenshot-result.png    (Image 1: Before/After braids transformation)
 *    - before-after.png         (Image 1: same image, or cropped version)
 *    - screenshot-home.png      (Image 3: App home with "Find Your Perfect Style")
 *    - screenshot-categories.png (Image 4: "Try Before You Cut" grid)
 *    - screenshot-app-mockup.png (Image 5: Phone mockup "A New You")
 * 
 * 2. For the OG image (social share preview), create a 1200x630px image
 *    combining your logo + a screenshot. Save as og-image.png
 * 
 * 3. For favicons, resize your logo:
 *    - favicon-32.png (32x32)
 *    - favicon-16.png (16x16)
 *    - apple-touch-icon.png (180x180)
 * 
 * You can use https://favicon.io/ to generate all favicon sizes from your logo.
 */

console.log('=== Hair Studio Landing Page - Image Setup ===');
console.log('');
console.log('Required images in landing-page/img/:');
console.log('');

const required = [
  { file: 'logo.png', desc: 'App logo (already copied)' },
  { file: 'og-image.png', desc: 'Social share image (1200x630)' },
  { file: 'favicon-32.png', desc: 'Favicon 32x32' },
  { file: 'favicon-16.png', desc: 'Favicon 16x16' },
  { file: 'apple-touch-icon.png', desc: 'Apple touch icon (180x180)' },
  { file: 'screenshot-home.png', desc: 'App home screen (your image #3)' },
  { file: 'screenshot-categories.png', desc: 'Categories grid (your image #4)' },
  { file: 'screenshot-result.png', desc: 'Before/After result (your image #1)' },
  { file: 'screenshot-app-mockup.png', desc: 'Phone mockup (your image #5)' },
  { file: 'before-after.png', desc: 'Before/After comparison (your image #1)' },
];

const fs = require('fs');
const path = require('path');
const imgDir = path.join(__dirname, 'img');

required.forEach(({ file, desc }) => {
  const exists = fs.existsSync(path.join(imgDir, file));
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${file.padEnd(28)} — ${desc}`);
});

console.log('');
console.log('Run this script to check progress: node setup-images.js');
