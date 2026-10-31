/**
 * WHITE MIST — Interactive Stain Removal Comparison Slider
 */

function initStainSlider() {
  const rangeInput = document.getElementById('stainRangeInput');
  const cleanLayer = document.getElementById('stainCleanLayer');
  const handle = document.getElementById('stainHandle');

  if (!rangeInput || !cleanLayer || !handle) return;

  function updateSlider(val) {
    cleanLayer.style.width = `${val}%`;
    handle.style.left = `${val}%`;
  }

  rangeInput.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });

  // Initial
  updateSlider(rangeInput.value || 50);
}

document.addEventListener('DOMContentLoaded', initStainSlider);
