const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPng(size, isForeground = false, isRound = false) {
  const width = size;
  const height = size;
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isRound ? 0.48 : 0.44);

  // Scaled wallet dimensions
  const rw = width * (isForeground ? 0.38 : 0.48);
  const rh = height * (isForeground ? 0.28 : 0.36);
  const rx1 = cx - rw / 2;
  const rx2 = cx + rw / 2;
  const ry1 = cy - rh / 2;
  const ry2 = cy + rh / 2;
  const border = Math.max(Math.round(size * 0.025), 2);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let r = 0, g = 0, b = 0, a = 0;

      if (!isForeground) {
        // Draw background squircle/circle
        let insideBg = false;
        if (isRound) {
          insideBg = dist <= radius;
        } else {
          // Rounded rect squircle
          const cr = width * 0.22;
          const insideCorner =
            Math.abs(dx) <= (width * 0.5 - cr) ||
            Math.abs(dy) <= (height * 0.5 - cr) ||
            Math.sqrt(
              Math.pow(Math.abs(dx) - (width * 0.5 - cr), 2) +
              Math.pow(Math.abs(dy) - (height * 0.5 - cr), 2)
            ) <= cr;
          insideBg = insideCorner && Math.abs(dx) <= width * 0.48 && Math.abs(dy) <= height * 0.48;
        }

        if (insideBg) {
          r = 9;
          g = 9;
          b = 11;
          a = 255;
        }
      }

      // Check wallet shape
      const inOuter = x >= rx1 && x <= rx2 && y >= ry1 && y <= ry2;
      const inInner =
        x >= (rx1 + border) &&
        x <= (rx2 - border) &&
        y >= (ry1 + border) &&
        y <= (ry2 - border);

      // Flap line
      const flapY = ry1 + rh * 0.35;
      const inFlap = inOuter && Math.abs(y - flapY) <= (border / 2);

      // Clasp button on right
      const claspX = rx2 - rw * 0.22;
      const claspY = ry1 + rh * 0.58;
      const claspDist = Math.sqrt((x - claspX) ** 2 + (y - claspY) ** 2);
      const inClasp = claspDist <= (size * (isForeground ? 0.03 : 0.04));

      if ((inOuter && !inInner) || inFlap || inClasp) {
        r = 255;
        g = 255;
        b = 255;
        a = 255;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
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
    fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), createPng(size, false, false));
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), createPng(size, false, true));
    // For adaptive foreground, standard size is 108x108 on mdpi up to 432x432 on xxxhdpi
    const fgSize = Math.round(size * 2.25);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), createPng(fgSize, true, false));
    console.log(`Updated icons in ${folder} (size: ${size}px)`);
  }
}

// Update web icons in public
const publicDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createPng(192, false, false));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createPng(512, false, false));
console.log('Updated public/icon-192.png and public/icon-512.png');
