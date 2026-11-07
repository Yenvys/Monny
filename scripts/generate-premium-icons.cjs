const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPremiumPng(size, isForeground = false, isRound = false) {
  const width = size;
  const height = size;
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;

  function setPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const offset = y * rowSize + 1 + x * 4;
    // Alpha blending with existing
    const existingA = rawData[offset + 3] / 255;
    const newA = a / 255;
    const outA = newA + existingA * (1 - newA);
    if (outA <= 0) return;

    const outR = Math.round((r * newA + rawData[offset] * existingA * (1 - newA)) / outA);
    const outG = Math.round((g * newA + rawData[offset + 1] * existingA * (1 - newA)) / outA);
    const outB = Math.round((b * newA + rawData[offset + 2] * existingA * (1 - newA)) / outA);

    rawData[offset] = outR;
    rawData[offset + 1] = outG;
    rawData[offset + 2] = outB;
    rawData[offset + 3] = Math.round(outA * 255);
  }

  // Pre-fill filter bytes with 0
  for (let y = 0; y < height; y++) {
    rawData[y * rowSize] = 0;
  }

  // Step 1: Draw background if not foreground
  if (!isForeground) {
    const radius = width * (isRound ? 0.48 : 0.44);
    const cr = width * 0.24;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let inside = false;
        if (isRound) {
          inside = dist <= radius;
        } else {
          const inCorner =
            Math.abs(dx) <= (width * 0.5 - cr) ||
            Math.abs(dy) <= (height * 0.5 - cr) ||
            Math.sqrt(
              Math.pow(Math.abs(dx) - (width * 0.5 - cr), 2) +
              Math.pow(Math.abs(dy) - (height * 0.5 - cr), 2)
            ) <= cr;
          inside = inCorner && Math.abs(dx) <= width * 0.48 && Math.abs(dy) <= height * 0.48;
        }

        if (inside) {
          // Elegant dark titanium gradient: #1c1c20 at top to #09090b at bottom
          const t = y / height;
          const bgVal = Math.round(28 * (1 - t) + 9 * t);
          // Subtle border rim near edges
          const rimDist = isRound ? (radius - dist) : Math.min(width * 0.48 - Math.abs(dx), height * 0.48 - Math.abs(dy));
          let r = bgVal, g = bgVal, b = Math.min(bgVal + 3, 255);
          if (rimDist < Math.max(size * 0.02, 1.5)) {
            // Shiny metallic silver rim
            r = 90; g = 90; b = 95;
          }
          setPixel(x, y, r, g, b, 255);
        }
      }
    }
  }

  // Step 2: Draw the Premium Geometric Wallet & Peeking Card
  // Scaled down for safe zone margins & elegant compact design
  const s = isForeground ? size * 0.38 : size * 0.46;
  const iconCx = cx;
  const iconCy = cy + (isForeground ? 0 : size * 0.015);

  // Emerging Top Card (peeking out from wallet)
  // Card rect:
  const cardW = s * 0.72;
  const cardH = s * 0.35;
  const cardX1 = iconCx - cardW / 2;
  const cardX2 = iconCx + cardW / 2;
  const cardY1 = iconCy - s * 0.42;
  const cardY2 = cardY1 + cardH;
  const cardR = s * 0.08;

  // Wallet Body:
  const wallW = s * 0.84;
  const wallH = s * 0.56;
  const wallX1 = iconCx - wallW / 2;
  const wallX2 = iconCx + wallW / 2;
  const wallY1 = iconCy - s * 0.16;
  const wallY2 = wallY1 + wallH;
  const wallR = s * 0.12;

  // Helper function to test rounded rectangle
  function insideRoundRect(x, y, x1, x2, y1, y2, r) {
    if (x < x1 || x > x2 || y < y1 || y > y2) return false;
    const dx = x < (x1 + r) ? (x1 + r - x) : (x > (x2 - r) ? (x - (x2 - r)) : 0);
    const dy = y < (y1 + r) ? (y1 + r - y) : (y > (y2 - r) ? (y - (y2 - r)) : 0);
    return (dx * dx + dy * dy) <= (r * r);
  }

  // Draw Top Peeking Card (Subtle frosted white card)
  for (let y = Math.floor(cardY1); y <= Math.ceil(cardY2); y++) {
    for (let x = Math.floor(cardX1); x <= Math.ceil(cardX2); x++) {
      if (insideRoundRect(x, y, cardX1, cardX2, cardY1, cardY2, cardR)) {
        // Card gradient: sleek platinum silver (#a1a1aa to #71717a)
        const t = (x - cardX1) / cardW;
        const val = Math.round(180 + t * 40);
        // Card chip accent on left side
        const inChip = (x >= cardX1 + cardW * 0.15 && x <= cardX1 + cardW * 0.32 && y >= cardY1 + cardH * 0.25 && y <= cardY1 + cardH * 0.65);
        if (inChip) {
          setPixel(x, y, 255, 255, 255, 240);
        } else {
          setPixel(x, y, val, val, val, 210);
        }
      }
    }
  }

  // Draw Main Wallet Body (Crisp Pure White with subtle shadow bevel)
  const borderWidth = Math.max(Math.round(s * 0.035), 2);
  const flapY = wallY1 + wallH * 0.38;
  const claspX = wallX2 - wallW * 0.24;
  const claspY = wallY1 + wallH * 0.50;
  const claspR = s * 0.10;

  for (let y = Math.floor(wallY1); y <= Math.ceil(wallY2); y++) {
    for (let x = Math.floor(wallX1); x <= Math.ceil(wallX2); x++) {
      if (insideRoundRect(x, y, wallX1, wallX2, wallY1, wallY2, wallR)) {
        // Pure crisp white base for wallet
        let r = 255, g = 255, b = 255, a = 255;

        // Pocket groove divider line
        if (Math.abs(y - flapY) <= Math.max(borderWidth * 0.6, 1.5)) {
          r = 28; g = 28; b = 34; // Deep slit line
        }

        // Inner shadow on top edge
        if (y <= wallY1 + borderWidth) {
          r = 220; g = 220; b = 225;
        }

        setPixel(x, y, r, g, b, a);
      }
    }
  }

  // Draw Clasp badge on wallet (Circle with dark center)
  for (let y = Math.floor(claspY - claspR - 2); y <= Math.ceil(claspY + claspR + 2); y++) {
    for (let x = Math.floor(claspX - claspR - 2); x <= Math.ceil(claspX + claspR + 2); x++) {
      const d = Math.sqrt((x - claspX) ** 2 + (y - claspY) ** 2);
      if (d <= claspR) {
        // Outer dark circle
        setPixel(x, y, 20, 20, 24, 255);
      }
      if (d <= claspR * 0.52) {
        // Inner gleaming silver jewel / rivet
        setPixel(x, y, 255, 255, 255, 255);
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    const crcBuf = Buffer.concat([Buffer.from(type), data]);
    const crc = crc32(crcBuf);
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) {
          crc = (crc >>> 1) ^ 0xedb88320;
        } else {
          crc = crc >>> 1;
        }
        byte = byte >>> 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', compressedData),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

for (const [folder, size] of Object.entries(sizes)) {
  const targetDir = path.join(resDir, folder);
  if (fs.existsSync(targetDir)) {
    fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), createPremiumPng(size, false, false));
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), createPremiumPng(size, false, true));
    const fgSize = Math.round(size * 2.25);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), createPremiumPng(fgSize, true, false));
    console.log(`Generated premium icon for ${folder} (${size}px)`);
  }
}

const publicDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createPremiumPng(192, false, false));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createPremiumPng(512, false, false));
console.log('Generated premium public/icon-192.png and public/icon-512.png');
