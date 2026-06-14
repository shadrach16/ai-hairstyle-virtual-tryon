/**
 * Generate all app icons, splash screens, and PWA icons from the source logo.
 * 
 * Usage: node scripts/generateIcons.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE = 'C:\\Users\\HP\\Downloads\\Hair_Studio_app_202604251226 (1).jpeg';
const ROOT = path.resolve(__dirname, '..');

// --- Android mipmap icon sizes ---
const MIPMAP_SIZES = {
  'mipmap-ldpi':    { launcher: 36,  foreground: 81 },
  'mipmap-mdpi':    { launcher: 48,  foreground: 108 },
  'mipmap-hdpi':    { launcher: 72,  foreground: 162 },
  'mipmap-xhdpi':   { launcher: 96,  foreground: 216 },
  'mipmap-xxhdpi':  { launcher: 144, foreground: 324 },
  'mipmap-xxxhdpi': { launcher: 192, foreground: 432 },
};

// --- PWA icon sizes ---
const PWA_SIZES = [48, 72, 96, 128, 192, 256, 512];

// --- Splash screen sizes (portrait and landscape) ---
const SPLASH_PORTRAIT = {
  'drawable-port-ldpi':    { w: 320, h: 426 },
  'drawable-port-mdpi':    { w: 320, h: 470 },
  'drawable-port-hdpi':    { w: 480, h: 640 },
  'drawable-port-xhdpi':   { w: 720, h: 960 },
  'drawable-port-xxhdpi':  { w: 960, h: 1600 },
  'drawable-port-xxxhdpi': { w: 1280, h: 1920 },
};

const SPLASH_LANDSCAPE = {
  'drawable-land-ldpi':    { w: 426, h: 320 },
  'drawable-land-mdpi':    { w: 470, h: 320 },
  'drawable-land-hdpi':    { w: 640, h: 480 },
  'drawable-land-xhdpi':   { w: 960, h: 720 },
  'drawable-land-xxhdpi':  { w: 1600, h: 960 },
  'drawable-land-xxxhdpi': { w: 1920, h: 1280 },
};

async function extractCircularBadge(sourcePath) {
  // Get source metadata
  const meta = await sharp(sourcePath).metadata();
  console.log(`Source image: ${meta.width}x${meta.height}`);
  
  // The badge circle is centered horizontally, roughly in the top 85% of the image
  // Crop to the square circle area
  const circleSize = Math.round(meta.width * 0.92);
  const left = Math.round((meta.width - circleSize) / 2);
  const top = Math.round((meta.height - circleSize) / 2) - Math.round(meta.height * 0.04);
  
  const cropped = await sharp(sourcePath)
    .extract({ left: Math.max(0, left), top: Math.max(0, top), width: circleSize, height: circleSize })
    .png()
    .toBuffer();
    
  console.log(`Extracted badge: ${circleSize}x${circleSize}`);
  return cropped;
}

async function makeCircularMask(buffer, size) {
  // Resize to target size
  const resized = await sharp(buffer)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toBuffer();
    
  // Create circular mask
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
    </svg>`
  );
  
  return sharp(resized)
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function makeSplash(badgeBuffer, width, height, bgColor = '#ffffff') {
  // Logo size = 40% of the shorter dimension
  const logoSize = Math.round(Math.min(width, height) * 0.4);
  
  const logo = await sharp(badgeBuffer)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: bgColor
    }
  })
    .composite([{
      input: logo,
      gravity: 'center'
    }])
    .png()
    .toBuffer();
}

async function run() {
  console.log('=== Generating App Icons from Premium Badge Logo ===\n');
  
  // 1. Extract the circular badge from the source
  const badge = await extractCircularBadge(SOURCE);
  
  // Save high-res badge as the new logo.png
  const logo1024 = await sharp(badge).resize(1024, 1024, { fit: 'cover' }).png().toBuffer();
  fs.writeFileSync(path.join(ROOT, 'assets', 'logo.png'), logo1024);
  console.log('✅ assets/logo.png (1024x1024)');
  
  // Save as app-icon.png for Capacitor
  fs.writeFileSync(path.join(ROOT, 'app-icon.png'), logo1024);
  console.log('✅ app-icon.png (1024x1024)');
  
  // 2. Generate Android mipmap icons
  console.log('\n--- Android Mipmap Icons ---');
  const androidRes = path.join(ROOT, 'android', 'app', 'src', 'main', 'res');
  
  for (const [folder, sizes] of Object.entries(MIPMAP_SIZES)) {
    const dir = path.join(androidRes, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    // ic_launcher.png (square with slight rounding from source)
    const launcher = await sharp(badge)
      .resize(sizes.launcher, sizes.launcher, { fit: 'cover' })
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(dir, 'ic_launcher.png'), launcher);
    
    // ic_launcher_round.png (circular)
    const round = await makeCircularMask(badge, sizes.launcher);
    fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), round);
    
    // ic_launcher_foreground.png (for adaptive icons — badge centered in 108dp safe zone)
    // The foreground needs to be the icon within a larger canvas (foreground size)
    const fgLogoSize = Math.round(sizes.foreground * 0.7); // 70% of foreground area
    const fgLogo = await sharp(badge)
      .resize(fgLogoSize, fgLogoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const foreground = await sharp({
      create: {
        width: sizes.foreground,
        height: sizes.foreground,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: fgLogo, gravity: 'center' }])
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), foreground);
    
    // ic_launcher_background.png (solid white)
    const background = await sharp({
      create: {
        width: sizes.foreground,
        height: sizes.foreground,
        channels: 4,
        background: '#ffffff'
      }
    }).png().toBuffer();
    fs.writeFileSync(path.join(dir, 'ic_launcher_background.png'), background);
    
    console.log(`  ✅ ${folder}: launcher(${sizes.launcher}), round(${sizes.launcher}), fg(${sizes.foreground}), bg(${sizes.foreground})`);
  }
  
  // 3. Generate PWA icons (webp)
  console.log('\n--- PWA Icons ---');
  const iconsDir = path.join(ROOT, 'icons');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
  
  for (const size of PWA_SIZES) {
    const icon = await sharp(badge)
      .resize(size, size, { fit: 'cover' })
      .webp({ quality: 90 })
      .toBuffer();
    fs.writeFileSync(path.join(iconsDir, `icon-${size}.webp`), icon);
    console.log(`  ✅ icons/icon-${size}.webp`);
  }
  
  // 4. Generate favicon.ico (we'll use a PNG since modern browsers accept it)
  console.log('\n--- Favicon ---');
  const favicon32 = await sharp(badge)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toBuffer();
  // Write as .ico (actually a PNG — all modern browsers support PNG favicons)
  fs.writeFileSync(path.join(ROOT, 'public', 'favicon.ico'), favicon32);
  console.log('  ✅ public/favicon.ico (32x32 PNG)');
  
  // 5. Generate splash screens (day mode — white bg)
  console.log('\n--- Splash Screens (Day) ---');
  
  // Default drawable
  const defaultSplash = await makeSplash(badge, 480, 800, '#ffffff');
  const drawableDir = path.join(androidRes, 'drawable');
  if (!fs.existsSync(drawableDir)) fs.mkdirSync(drawableDir, { recursive: true });
  fs.writeFileSync(path.join(drawableDir, 'splash.png'), defaultSplash);
  console.log('  ✅ drawable/splash.png');
  
  // Portrait
  for (const [folder, dims] of Object.entries(SPLASH_PORTRAIT)) {
    const dir = path.join(androidRes, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const splash = await makeSplash(badge, dims.w, dims.h, '#ffffff');
    fs.writeFileSync(path.join(dir, 'splash.png'), splash);
    console.log(`  ✅ ${folder}/splash.png (${dims.w}x${dims.h})`);
  }
  
  // Landscape
  for (const [folder, dims] of Object.entries(SPLASH_LANDSCAPE)) {
    const dir = path.join(androidRes, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const splash = await makeSplash(badge, dims.w, dims.h, '#ffffff');
    fs.writeFileSync(path.join(dir, 'splash.png'), splash);
    console.log(`  ✅ ${folder}/splash.png (${dims.w}x${dims.h})`);
  }
  
  // 6. Generate splash screens (night mode — dark bg)
  console.log('\n--- Splash Screens (Night) ---');
  
  const drawableNight = path.join(androidRes, 'drawable-night');
  if (!fs.existsSync(drawableNight)) fs.mkdirSync(drawableNight, { recursive: true });
  const nightDefault = await makeSplash(badge, 480, 800, '#1a1a2e');
  fs.writeFileSync(path.join(drawableNight, 'splash.png'), nightDefault);
  console.log('  ✅ drawable-night/splash.png');
  
  for (const [folder, dims] of Object.entries(SPLASH_PORTRAIT)) {
    const nightFolder = folder.replace('drawable-port', 'drawable-port-night');
    const dir = path.join(androidRes, nightFolder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const splash = await makeSplash(badge, dims.w, dims.h, '#1a1a2e');
    fs.writeFileSync(path.join(dir, 'splash.png'), splash);
    console.log(`  ✅ ${nightFolder}/splash.png (${dims.w}x${dims.h})`);
  }
  
  for (const [folder, dims] of Object.entries(SPLASH_LANDSCAPE)) {
    const nightFolder = folder.replace('drawable-land', 'drawable-land-night');
    const dir = path.join(androidRes, nightFolder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const splash = await makeSplash(badge, dims.w, dims.h, '#1a1a2e');
    fs.writeFileSync(path.join(dir, 'splash.png'), splash);
    console.log(`  ✅ ${nightFolder}/splash.png (${dims.w}x${dims.h})`);
  }
  
  console.log('\n🎉 All icons and splash screens generated successfully!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
