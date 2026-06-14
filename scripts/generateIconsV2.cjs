/**
 * generateIconsV2.cjs
 * Properly extracts the circular badge from the source image,
 * removes the gray background, applies a circular mask for transparency,
 * and generates all Android adaptive icon assets + splash screens.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.resolve('C:\\Users\\HP\\Downloads\\Hair_Studio_app_202604251226 (1).jpeg');
const ANDROID_RES = path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const PUBLIC = path.resolve(__dirname, '..', 'public');

// The circular badge in the source image (768x1376) is roughly centered
// Badge center is approximately at (384, 650), radius ~345px
// Shift crop down to capture "HAIR STUDIO" text at bottom
const BADGE_LEFT = 18;
const BADGE_TOP = 290;
const BADGE_SIZE = 730;

async function createCircularMask(size) {
  // Create a circular mask using SVG
  const svg = `<svg width="${size}" height="${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
  </svg>`;
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

async function extractBadge() {
  console.log('Extracting circular badge from source...');
  
  // Step 1: Crop the badge area from source, sharpen for clarity
  const cropped = await sharp(SRC)
    .extract({ left: BADGE_LEFT, top: BADGE_TOP, width: BADGE_SIZE, height: BADGE_SIZE })
    .resize(1024, 1024, { fit: 'fill', kernel: 'lanczos3' })
    .sharpen({ sigma: 1.2, m1: 1.5, m2: 0.7 })
    .png()
    .toBuffer();
  
  // Step 2: Create circular mask
  const mask = await createCircularMask(1024);
  
  // Step 3: Apply circular mask to get transparent background
  const circularBadge = await sharp(cropped)
    .ensureAlpha()
    .composite([{
      input: mask,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();
  
  // Save for reference
  await sharp(circularBadge).toFile(path.resolve(__dirname, '..', 'app-icon-circular.png'));
  console.log('Saved app-icon-circular.png (1024x1024 with transparent bg)');
  
  return circularBadge;
}

async function generateAdaptiveIcons(circularBadge) {
  console.log('\nGenerating Android adaptive icons...');
  
  // Android adaptive icon spec:
  // - Canvas is 108dp, icon safe zone is 72dp (inner 66.7%)
  // - Foreground: the logo centered on transparent 108dp canvas
  // - Background: solid color layer
  
  const densities = {
    'ldpi': 36,
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192,
  };
  
  // Adaptive icon canvas sizes (108dp equivalent)
  const adaptiveCanvas = {
    'ldpi': 81,    // 108 * 0.75
    'mdpi': 108,   // 108 * 1.0
    'hdpi': 162,   // 108 * 1.5
    'xhdpi': 216,  // 108 * 2.0
    'xxhdpi': 324, // 108 * 3.0
    'xxxhdpi': 432,// 108 * 4.0
  };
  
  for (const [density, iconSize] of Object.entries(densities)) {
    const dir = path.join(ANDROID_RES, `mipmap-${density}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const canvasSize = adaptiveCanvas[density];
    
    // --- ic_launcher_foreground.png ---
    // Logo fills most of the adaptive canvas (safe zone is inner 66.7%)
    const logoOnCanvas = Math.round(canvasSize * 0.95);
    const fgPadding = Math.round((canvasSize - logoOnCanvas) / 2);
    
    const resizedLogo = await sharp(circularBadge)
      .resize(logoOnCanvas, logoOnCanvas, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
      .sharpen({ sigma: 0.8, m1: 1.0, m2: 0.5 })
      .png()
      .toBuffer();
    
    await sharp({
      create: {
        width: canvasSize,
        height: canvasSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{ input: resizedLogo, left: fgPadding, top: fgPadding }])
    .png()
    .toFile(path.join(dir, 'ic_launcher_foreground.png'));
    
    // --- ic_launcher_background.png ---
    // Solid white background
    await sharp({
      create: {
        width: canvasSize,
        height: canvasSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 255 }
      }
    })
    .png()
    .toFile(path.join(dir, 'ic_launcher_background.png'));
    
    // --- ic_launcher.png (legacy, non-adaptive) ---
    // Full icon at the standard size with the badge filling the space
    // Apply circular mask for legacy round display
    const legacyMask = await createCircularMask(iconSize);
    const legacyResized = await sharp(circularBadge)
      .resize(iconSize, iconSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 255 }, kernel: 'lanczos3' })
      .sharpen({ sigma: 1.0, m1: 1.2, m2: 0.6 })
      .png()
      .toBuffer();
    
    await sharp(legacyResized)
      .ensureAlpha()
      .composite([{ input: legacyMask, blend: 'dest-in' }])
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));
    
    // --- ic_launcher_round.png (legacy round) ---
    // Same as ic_launcher but explicitly circular
    await sharp(legacyResized)
      .ensureAlpha()
      .composite([{ input: legacyMask, blend: 'dest-in' }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));
    
    console.log(`  mipmap-${density}: ${iconSize}px icons, ${canvasSize}px adaptive canvas`);
  }
}

async function generateSplashScreens(circularBadge) {
  console.log('\nGenerating splash screens...');
  
  // Splash screen dimensions for different densities
  const portraitSizes = {
    'ldpi': [240, 480],
    'mdpi': [320, 480],
    'hdpi': [480, 800],
    'xhdpi': [720, 1280],
    'xxhdpi': [1080, 1920],
    'xxxhdpi': [1440, 2560],
  };
  
  const landscapeSizes = {
    'ldpi': [480, 240],
    'mdpi': [480, 320],
    'hdpi': [800, 480],
    'xhdpi': [1280, 720],
    'xxhdpi': [1920, 1080],
    'xxxhdpi': [2560, 1440],
  };
  
  const themes = {
    day: { r: 255, g: 255, b: 255, alpha: 255 },   // white
    night: { r: 26, g: 26, b: 46, alpha: 255 },     // dark navy #1a1a2e
  };
  
  for (const [themeName, bgColor] of Object.entries(themes)) {
    // Portrait
    for (const [density, [w, h]] of Object.entries(portraitSizes)) {
      const logoSize = Math.round(Math.min(w, h) * 0.35);
      const logoX = Math.round((w - logoSize) / 2);
      const logoY = Math.round((h - logoSize) / 2);
      
      const resizedLogo = await sharp(circularBadge)
        .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      
      const dirSuffix = themeName === 'night' ? `-port-night-${density}` : `-port-${density}`;
      const dir = path.join(ANDROID_RES, `drawable${dirSuffix}`);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      await sharp({
        create: { width: w, height: h, channels: 4, background: bgColor }
      })
      .composite([{ input: resizedLogo, left: logoX, top: logoY }])
      .png()
      .toFile(path.join(dir, 'splash.png'));
      
      console.log(`  ${dirSuffix}: ${w}x${h}, logo ${logoSize}px`);
    }
    
    // Landscape
    for (const [density, [w, h]] of Object.entries(landscapeSizes)) {
      const logoSize = Math.round(Math.min(w, h) * 0.35);
      const logoX = Math.round((w - logoSize) / 2);
      const logoY = Math.round((h - logoSize) / 2);
      
      const resizedLogo = await sharp(circularBadge)
        .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      
      const dirSuffix = themeName === 'night' ? `-land-night-${density}` : `-land-${density}`;
      const dir = path.join(ANDROID_RES, `drawable${dirSuffix}`);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      await sharp({
        create: { width: w, height: h, channels: 4, background: bgColor }
      })
      .composite([{ input: resizedLogo, left: logoX, top: logoY }])
      .png()
      .toFile(path.join(dir, 'splash.png'));
      
      console.log(`  ${dirSuffix}: ${w}x${h}, logo ${logoSize}px`);
    }
  }
  
  // Default splash (drawable/splash.png) - day theme, medium size
  const defaultDir = path.join(ANDROID_RES, 'drawable');
  if (!fs.existsSync(defaultDir)) fs.mkdirSync(defaultDir, { recursive: true });
  const defLogo = await sharp(circularBadge)
    .resize(168, 168, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: 480, height: 800, channels: 4, background: themes.day }
  })
  .composite([{ input: defLogo, left: 156, top: 316 }])
  .png()
  .toFile(path.join(defaultDir, 'splash.png'));
  
  // Night default
  const nightDir = path.join(ANDROID_RES, 'drawable-night');
  if (!fs.existsSync(nightDir)) fs.mkdirSync(nightDir, { recursive: true });
  await sharp({
    create: { width: 480, height: 800, channels: 4, background: themes.night }
  })
  .composite([{ input: defLogo, left: 156, top: 316 }])
  .png()
  .toFile(path.join(nightDir, 'splash.png'));
  
  console.log('  drawable/splash.png (default day)');
  console.log('  drawable-night/splash.png (default night)');
}

async function generatePWAIcons(circularBadge) {
  console.log('\nGenerating PWA icons...');
  const sizes = [48, 72, 96, 128, 192, 384, 512];
  const iconsDir = path.join(PUBLIC, 'images');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
  
  for (const size of sizes) {
    await sharp(circularBadge)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 95 })
      .toFile(path.join(iconsDir, `icon-${size}.webp`));
    console.log(`  icon-${size}.webp`);
  }
}

async function generateFavicon(circularBadge) {
  console.log('\nGenerating favicon...');
  await sharp(circularBadge)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, 'favicon.ico'));
  console.log('  public/favicon.ico');
}

async function generateCapacitorIcon(circularBadge) {
  console.log('\nGenerating Capacitor app-icon...');
  // Create a 1024x1024 icon with the badge on white background for store listing
  const mask = await createCircularMask(1024);
  
  // For the root app-icon.png, use badge on white background
  await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 255 } }
  })
  .composite([
    { input: circularBadge, left: 0, top: 0 }
  ])
  .png()
  .toFile(path.resolve(__dirname, '..', 'app-icon.png'));
  console.log('  app-icon.png (1024x1024)');
  
  // Also save as assets/logo.png
  await sharp(circularBadge)
    .toFile(path.resolve(__dirname, '..', 'assets', 'logo.png'));
  console.log('  assets/logo.png');
}

async function main() {
  console.log('=== Hair Studio Icon Generator V2 ===\n');
  
  const circularBadge = await extractBadge();
  
  await generateAdaptiveIcons(circularBadge);
  await generateSplashScreens(circularBadge);
  await generatePWAIcons(circularBadge);
  await generateFavicon(circularBadge);
  await generateCapacitorIcon(circularBadge);
  
  console.log('\n=== All icons generated successfully! ===');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
