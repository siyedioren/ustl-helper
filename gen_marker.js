const { Jimp } = require('jimp');

async function main() {
  const SIZE = 32;
  const RED = 0xFF3B30FF;
  const WHITE = 0xFFFFFFFF;

  const img = new Jimp({ width: SIZE, height: SIZE, color: 0x00000000 });

  const cx = SIZE / 2;
  const cy = SIZE / 2 - 2;
  const radius = 10;

  // 画红色圆
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= radius) {
        img.setPixelColor(RED, x, y);
      }
    }
  }

  // 画白色小圆心
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 3.5) {
        img.setPixelColor(WHITE, x, y);
      }
    }
  }

  // 画底部小三角（尖角）
  for (let y = Math.floor(cy + radius - 1); y < SIZE - 2; y++) {
    const width = Math.max(1, Math.floor((SIZE - 2 - y) / 2));
    for (let x = Math.floor(cx - width); x <= Math.floor(cx + width); x++) {
      if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
        img.setPixelColor(RED, x, y);
      }
    }
  }

  await img.write('src/static/marker.png');
  console.log('done: static/marker.png');
}

main().catch(console.error);
