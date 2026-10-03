import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#FFFFFF"/>
  <g transform="translate(0, 0)">
    <!-- Left Bracket < -->
    <polyline
      points="132,188 72,256 132,324"
      fill="none"
      stroke="#135293"
      stroke-width="28"
      stroke-linecap="square"
      stroke-linejoin="miter"
      stroke-miterlimit="4"
    />

    <!-- Forward Slash / -->
    <line
      x1="152"
      y1="362"
      x2="216"
      y2="150"
      stroke="#135293"
      stroke-width="30"
      stroke-linecap="square"
    />

    <!-- Outer C (Concentric) -->
    <path
      d="M 326,204 
         A 64,64 0 1 0 326,308"
      fill="none"
      stroke="#000000"
      stroke-width="30"
      stroke-linecap="square"
    />

    <!-- Inner C (Concentric) -->
    <path
      d="M 300,224 
         A 32,32 0 1 0 300,288"
      fill="none"
      stroke="#000000"
      stroke-width="20"
      stroke-linecap="square"
    />

    <!-- Right Bracket > -->
    <polyline
      points="380,188 440,256 380,324"
      fill="none"
      stroke="#135293"
      stroke-width="28"
      stroke-linecap="square"
      stroke-linejoin="miter"
      stroke-miterlimit="4"
    />
  </g>
</svg>`;

async function run() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

  const svgBuffer = Buffer.from(svgContent);

  // Generate 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  // Generate 180x180 Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Generate 192x192 Android Chrome Icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));

  // Generate 512x512 Android Chrome Icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));

  // Generate 32x32 Favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  // Generate 16x16 Favicon
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // Generate favicon.ico (as 32x32 PNG container for modern browsers)
  await sharp(svgBuffer)
    .resize(48, 48)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('All favicon formats generated successfully in /public');
}

run().catch(console.error);
