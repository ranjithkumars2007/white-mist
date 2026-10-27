const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://white-mist.vercel.app';

function downloadFile(relPath, localDest) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${relPath.startsWith('/') ? relPath : '/' + relPath}`;
    const destDir = path.dirname(localDest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const file = fs.createWriteStream(localDest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(localDest, () => {});
        reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          const size = fs.statSync(localDest).size;
          console.log(`Downloaded ${relPath} -> ${localDest} (${size} bytes)`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(localDest, () => {});
      reject(err);
    });
  });
}

async function main() {
  const assetsToDownload = [
    { url: '/assets/index-DSQjP5Z0.js', dest: path.join(__dirname, 'public', 'assets', 'index-DSQjP5Z0.js') },
    { url: '/assets/index-CreoPNBV.css', dest: path.join(__dirname, 'public', 'assets', 'index-CreoPNBV.css') },
    { url: '/assets/images/logo.png', dest: path.join(__dirname, 'public', 'assets', 'images', 'logo.png') },
    { url: '/assets/images/bottle_blue.png', dest: path.join(__dirname, 'public', 'assets', 'images', 'bottle_blue.png') },
    { url: '/assets/images/bottle_pink.png', dest: path.join(__dirname, 'public', 'assets', 'images', 'bottle_pink.png') },
    { url: '/assets/images/bottle_yellow.png', dest: path.join(__dirname, 'public', 'assets', 'images', 'bottle_yellow.png') },
    { url: '/assets/images/pouch_blue.png', dest: path.join(__dirname, 'public', 'assets', 'images', 'pouch_blue.png') },
    { url: '/assets/images/pouch_yellow.png', dest: path.join(__dirname, 'public', 'assets', 'images', 'pouch_yellow.png') },
    { url: '/assets/images/bottles_pair.png', dest: path.join(__dirname, 'public', 'assets', 'images', 'bottles_pair.png') },
    { url: '/assets/images/fresh_clean_fabrics.jpg', dest: path.join(__dirname, 'public', 'assets', 'images', 'fresh_clean_fabrics.jpg') },
    { url: '/assets/images/fabric_clean.jpg', dest: path.join(__dirname, 'public', 'assets', 'images', 'fabric_clean.jpg') },
    { url: '/assets/images/fabric_stained.jpg', dest: path.join(__dirname, 'public', 'assets', 'images', 'fabric_stained.jpg') },
    { url: '/assets/images/shirt_cleanpro.jpg', dest: path.join(__dirname, 'public', 'assets', 'images', 'shirt_cleanpro.jpg') }
  ];

  for (const item of assetsToDownload) {
    try {
      await downloadFile(item.url, item.dest);
    } catch (err) {
      console.warn(`[WARN] ${err.message}`);
    }
  }

  // Also check JS bundle for any other asset paths
  const jsBundlePath = path.join(__dirname, 'public', 'assets', 'index-DSQjP5Z0.js');
  if (fs.existsSync(jsBundlePath)) {
    const bundleText = fs.readFileSync(jsBundlePath, 'utf8');
    const regex = /\/assets\/[a-zA-Z0-9_\-\.\/]+/g;
    const matches = [...new Set(bundleText.match(regex) || [])];
    console.log('\nFound additional asset references in bundle:', matches);

    for (const match of matches) {
      const dest = path.join(__dirname, 'public', match.replace(/^\//, ''));
      if (!fs.existsSync(dest)) {
        try {
          await downloadFile(match, dest);
        } catch (e) {
          // ignore optional or generated paths
        }
      }
    }
  }

  console.log('\nAll assets downloaded successfully!');
}

main().catch(console.error);
