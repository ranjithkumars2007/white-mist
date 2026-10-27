/**
 * WHITE MIST — Interactive Laundry Dosage Calculator
 * Helps customers measure the exact millilitres of White Mist detergent for their wash load.
 */

function initDoseCalculator() {
  const machineSelect = document.getElementById('calcMachineType');
  const loadSelect = document.getElementById('calcLoadWeight');
  const soilSelect = document.getElementById('calcSoilLevel');
  const outputMl = document.getElementById('calcOutputMl');
  const outputCaps = document.getElementById('calcOutputCaps');
  const outputCost = document.getElementById('calcOutputCost');

  if (!machineSelect || !loadSelect || !soilSelect || !outputMl) return;

  function calculateDose() {
    let base = 35; // base ml for medium load normal soil

    const machine = machineSelect.value;
    const load = parseFloat(loadSelect.value) || 6;
    const soil = soilSelect.value;

    // Load scaling
    if (load <= 4) base = 25;
    else if (load <= 6) base = 35;
    else if (load <= 8) base = 50;
    else base = 65;

    // Machine type efficiency (Front Load requires less water and less detergent)
    if (machine === 'front_load') {
      base = Math.round(base * 0.9);
    } else if (machine === 'top_load') {
      base = Math.round(base * 1.1);
    } else if (machine === 'bucket') {
      base = 25;
    }

    // Soil level
    if (soil === 'heavy') base = Math.round(base * 1.35);
    else if (soil === 'light') base = Math.round(base * 0.85);

    // Caps calculation (1 measuring cap = 40ml)
    const caps = (base / 40).toFixed(1);

    // Approx cost per wash (assuming ₹249 for 1000ml bottle -> ~₹0.25 per ml)
    const cost = Math.round(base * 0.25);

    outputMl.textContent = `${base} ml`;
    if (outputCaps) outputCaps.textContent = `${caps} Measuring Cap${caps === '1.0' ? '' : 's'}`;
    if (outputCost) outputCost.textContent = `₹${cost}`;
  }

  [machineSelect, loadSelect, soilSelect].forEach(el => {
    el.addEventListener('change', calculateDose);
  });

  calculateDose();
}

document.addEventListener('DOMContentLoaded', initDoseCalculator);
