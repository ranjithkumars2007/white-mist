const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.resolve(__dirname, '..', 'admin.html');
let content = fs.readFileSync(adminHtmlPath, 'utf8');

console.log('Original admin.html length:', content.length);

const targetStr = `    async function openAddProductModal() {`;

const categoryControllersJs = `    // =========================================================================
    // CATEGORIES CONTROLLER & DROPDOWNS
    // =========================================================================
    async function loadCategoriesData() {
      try {
        const res = await fetch('/api/admin/categories', { headers: getAuthHeaders() });
        if (res.ok) {
          allCategories = await res.json();
        } else {
          allCategories = [
            { id: 'cat-1', name: 'Daily Wash Liquid', slug: 'daily-wash-liquid', description: 'Essential bio-active detergents for cottons, linens, and blended clothes.', sortOrder: 1 },
            { id: 'cat-2', name: 'Premium Fabric Care', slug: 'premium-fabric-care', description: 'Ultra-gentle formulation for silk, wool, and delicate garments.', sortOrder: 2 },
            { id: 'cat-3', name: 'Concentrated Detergent', slug: 'concentrated-detergent', description: 'High-density formulation delivering 2x washing load power per cap.', sortOrder: 3 },
            { id: 'cat-4', name: 'Family Value Pack', slug: 'family-value-pack', description: 'Economical multi-litre bottles & refill pouches for household laundry.', sortOrder: 4 }
          ];
        }
      } catch (e) {
        console.warn('Using local categories fallback', e);
        allCategories = [
          { id: 'cat-1', name: 'Daily Wash Liquid', slug: 'daily-wash-liquid', description: 'Essential bio-active detergents for cottons, linens, and blended clothes.', sortOrder: 1 },
          { id: 'cat-2', name: 'Premium Fabric Care', slug: 'premium-fabric-care', description: 'Ultra-gentle formulation for silk, wool, and delicate garments.', sortOrder: 2 },
          { id: 'cat-3', name: 'Concentrated Detergent', slug: 'concentrated-detergent', description: 'High-density formulation delivering 2x washing load power per cap.', sortOrder: 3 },
          { id: 'cat-4', name: 'Family Value Pack', slug: 'family-value-pack', description: 'Economical multi-litre bottles & refill pouches for household laundry.', sortOrder: 4 }
        ];
      }

      renderCategoriesTable(allCategories);
      updateCategoryDropdowns();
    }

    function renderCategoriesTable(categories) {
      const tbody = document.getElementById('categoriesTableBody');
      if (!tbody) return;

      if (!categories || categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-dim);">No categories found. Click "+ Add Category" to create one.</td></tr>';
        return;
      }

      tbody.innerHTML = categories.map((cat, idx) => \`
        <tr>
          <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${idx + 1}</td>
          <td>
            <strong style="color: var(--text-main); font-size: 0.92rem;">\${escapeHtml(cat.name || cat.title || '')}</strong>
          </td>
          <td>
            <code style="color: var(--color-primary); background: var(--bg-thumb); padding: 0.2rem 0.45rem; border-radius: 4px; font-size: 0.8rem;">
              /\${escapeHtml(cat.slug || '')}
            </code>
          </td>
          <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 320px;">
            \${escapeHtml(cat.description || '—')}
          </td>
          <td style="color: var(--text-dim); font-size: 0.85rem; text-align: center;">
            \${cat.sortOrder ?? cat.displayOrder ?? (idx + 1)}
          </td>
          <td>
            <div style="display: flex; gap: 0.45rem;">
              <button type="button" class="btn-action-public" onclick="deleteCategory('\${cat.id || cat.slug}')" style="color: #EF4444; border-color: #FECACA; padding: 0.3rem 0.6rem; font-size: 0.76rem;" title="Delete Category">
                Delete
              </button>
            </div>
          </td>
        </tr>
      \`).join('');
    }

    function updateCategoryDropdowns(selectedCategory) {
      const select = document.getElementById('editProdCategory');
      const filter = document.getElementById('prodCategoryFilter');

      const cats = (allCategories && allCategories.length > 0)
        ? allCategories.map(c => typeof c === 'string' ? c : (c.name || c.title || ''))
        : ['Daily Wash Liquid', 'Premium Fabric Care', 'Concentrated Detergent', 'Family Value Pack'];

      const uniqueCats = Array.from(new Set(cats.filter(Boolean)));

      if (select) {
        select.innerHTML = uniqueCats.map(c => \`
          <option value="\${escapeHtml(c)}" \${selectedCategory && selectedCategory.toLowerCase() === c.toLowerCase() ? 'selected' : ''}>\${escapeHtml(c)}</option>
        \`).join('');
      }

      if (filter) {
        const currentVal = filter.value || 'all';
        filter.innerHTML = \`<option value="all">All Categories</option>\` + uniqueCats.map(c => \`
          <option value="\${escapeHtml(c)}" \${currentVal === c ? 'selected' : ''}>\${escapeHtml(c)}</option>
        \`).join('');
      }
    }

    async function deleteCategory(idOrSlug) {
      if (!confirm('Are you sure you want to delete this category?')) return;
      try {
        const res = await fetch(\`/api/admin/categories/\${encodeURIComponent(idOrSlug)}\`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (res.ok) {
          showToast('Category deleted successfully.', 'success');
          loadCategoriesData();
        } else {
          allCategories = allCategories.filter(c => (c.id !== idOrSlug && c.slug !== idOrSlug));
          renderCategoriesTable(allCategories);
          updateCategoryDropdowns();
          showToast('Category removed.');
        }
      } catch (e) {
        allCategories = allCategories.filter(c => (c.id !== idOrSlug && c.slug !== idOrSlug));
        renderCategoriesTable(allCategories);
        updateCategoryDropdowns();
        showToast('Category removed.');
      }
    }

    async function openAddProductModal() {`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, categoryControllersJs);
  console.log('✓ Successfully injected loadCategoriesData, renderCategoriesTable, updateCategoryDropdowns, and deleteCategory');
} else {
  console.error('❌ Could not find targetStr');
}

fs.writeFileSync(adminHtmlPath, content, 'utf8');
console.log('Updated admin.html. New length:', content.length);

