const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy admin.html
if (fs.existsSync('public')) {
  copyFile('admin.html', 'public/admin.html');
}
if (fs.existsSync('dist')) {
  copyFile('admin.html', 'dist/admin.html');
}
copyFile('admin.html', 'WhiteMist_Admin_Only/admin.html');
if (fs.existsSync('WhiteMist_Admin_Only/public')) {
  copyFile('admin.html', 'WhiteMist_Admin_Only/public/admin.html');
}
if (fs.existsSync('WhiteMist_Admin_Only/dist')) {
  copyFile('admin.html', 'WhiteMist_Admin_Only/dist/admin.html');
}

// 2. Copy vite-dev-middleware.js
copyFile('vite-dev-middleware.js', 'WhiteMist_Admin_Only/vite-dev-middleware.js');

// 3. Copy data/whitemist_db.json
copyFile('data/whitemist_db.json', 'WhiteMist_Admin_Only/data/whitemist_db.json');

// 4. Copy dist
if (fs.existsSync('dist') && fs.existsSync('WhiteMist_Admin_Only/dist')) {
  copyDir('dist', 'WhiteMist_Admin_Only/dist');
  console.log('✓ Copied dist to WhiteMist_Admin_Only/dist');
}

// 5. Create zip file using PowerShell Compress-Archive
try {
  const zipPath = path.resolve(__dirname, '..', 'WhiteMist_Admin_Only.zip');
  const downloadsZip = path.resolve('c:/Users/ranjith/Downloads/WhiteMist_Admin_Only.zip');
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  
  execSync('powershell -NoProfile -Command "Compress-Archive -Path WhiteMist_Admin_Only -DestinationPath WhiteMist_Admin_Only.zip -Force"');
  console.log('✓ Created WhiteMist_Admin_Only.zip');
  
  if (fs.existsSync(zipPath)) {
    fs.copyFileSync(zipPath, downloadsZip);
    console.log('✓ Updated c:/Users/ranjith/Downloads/WhiteMist_Admin_Only.zip');
  }
} catch (e) {
  console.error('Zip creation note:', e.message);
}

