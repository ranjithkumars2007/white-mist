const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.resolve(__dirname, '..', 'admin.html');
let content = fs.readFileSync(adminHtmlPath, 'utf8');

console.log('Original admin.html length:', content.length);

// 1. Fix stray backtick semicolons on table cells
content = content.replace(/<\/td>`;/g, '</td>');
content = content.replace(/<\/td>`\s*;/g, '</td>');

// 2. Remove duplicate updateProductImageFromInput
const dupFuncPattern = /function updateProductImageFromInput\(val\)\s*\{\s*const preview = document\.getElementById\('editProdImagePreview'\);[\s\S]*?updateLivePreviewCard\(\);\s*\}/;
if (dupFuncPattern.test(content)) {
  content = content.replace(dupFuncPattern, '');
  console.log('✓ Removed duplicate updateProductImageFromInput');
}

// Ensure the remaining updateProductImageFromInput calls updateLivePreviewCard
content = content.replace(
  `    function updateProductImageFromInput(val) {
      const previewEl = document.getElementById('editProdImagePreview');
      const statusEl = document.getElementById('editProdImageStatus');
      if (previewEl && val) previewEl.src = val;
      if (statusEl) statusEl.textContent = 'Custom URL / Path';
      renderPresetChips(val);
    }`,
  `    function updateProductImageFromInput(val) {
      const previewEl = document.getElementById('editProdImagePreview');
      const statusEl = document.getElementById('editProdImageStatus');
      if (previewEl) previewEl.src = val || '/assets/images/bottle_blue.png';
      if (statusEl) statusEl.textContent = val ? 'Custom URL / Path' : 'Default';
      renderPresetChips(val);
      if (typeof updateLivePreviewCard === 'function') updateLivePreviewCard();
    }`
);

fs.writeFileSync(adminHtmlPath, content, 'utf8');
console.log('Updated admin.html. New length:', content.length);

