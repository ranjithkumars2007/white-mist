const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const assets = [
  'pouch_blue.png',
  'pouch_yellow.png',
  'bottle_blue.png',
  'bottle_pink.png',
  'bottle_yellow.png',
  'bottles_pair.png',
  'logo.png'
];

function download(asset) {
  return new Promise((resolve, reject) => {
    const url = `https://white-mist.vercel.app/assets/images/${asset}`;
    const dest = path.join(imagesDir, asset);
    const file = fs.createWriteStream(dest);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${asset}: status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded ${asset} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  for (const asset of assets) {
    try {
      await download(asset);
    } catch (e) {
      console.error(e.message);
    }
  }
  console.log('All assets processed.');
})();
