const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.join(__dirname, '..', 'admin.html');
let content = fs.readFileSync(adminHtmlPath, 'utf8');

// 1. UPDATE renderMessagesTable FOR S.NO
const oldMessagesMap = `        tbody.innerHTML = allMessages.map(m => \`
          <tr>
            <td>\${new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;

const newMessagesMap = `        tbody.innerHTML = allMessages.map((m, idx) => \`
          <tr>
            <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${idx + 1}</td>
            <td style="white-space: nowrap;">\${new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;

if (content.includes(oldMessagesMap)) {
  content = content.replace(oldMessagesMap, newMessagesMap);
  console.log('✓ Added S.No to messages table renderer');
} else {
  console.log('⚠ Could not find oldMessagesMap');
}

// 2. REPLACE PRODUCT MODAL FUNCTIONS & ADD CATEGORY MODAL FUNCTIONS
const oldProductFunctionsStart = `    async function openAddProductModal() {`;
const oldCategoryPromptEnd = `    function openAddCategoryModal() {
      const name = prompt('Enter new category name:');
      if (!name || !name.trim()) return;
      const desc = prompt('Enter short category description:');
      fetch('/api/admin/categories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: name.trim(), description: (desc || '').trim() })
      }).then(async (res) => {
        if (res.ok) {
          showToast(\`Category "\${name}" added.\`);
          await loadCategoriesData();
        } else {
          const err = await res.json().catch(() => ({}));
          showToast(err.error || 'Failed to add category', 'error');
        }
      }).catch(err => {
        showToast('Error adding category: ' + err.message, 'error');
      });
    }`;

const newProductAndCategoryFunctions = `    // =========================================================================
    // 2. PRODUCT MODAL CONTROLLER (Matching Image 1: 5-Tab SKU & Showcase)
    // =========================================================================
    let currentModalActiveTab = 'tab-pm-general';

    function switchProductModalTab(tabId) {
      currentModalActiveTab = tabId;
      document.querySelectorAll('#newProductModalTabs .modal-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
      });
      document.querySelectorAll('#productModal .pm-tab-pane').forEach(pane => {
        pane.style.display = pane.id === tabId ? 'flex' : 'none';
      });
      if (tabId === 'tab-pm-preview') {
        updateLivePreviewCard();
      }
    }

    function nextProductModalTab() {
      const tabs = ['tab-pm-general', 'tab-pm-images', 'tab-pm-pricing', 'tab-pm-details', 'tab-pm-preview'];
      const nextIdx = (tabs.indexOf(currentModalActiveTab) + 1) % tabs.length;
      switchProductModalTab(tabs[nextIdx]);
    }

    function setProductThemeColor(color, btnEl) {
      document.getElementById('editProdAccentColor').value = color;
      document.querySelectorAll('#productColorPillsContainer .color-theme-pill').forEach(pill => {
        pill.classList.remove('active');
        pill.style.border = '1px solid #E2E8F0';
        pill.style.background = '#FFF';
      });
      if (btnEl) {
        btnEl.classList.add('active');
        btnEl.style.border = \`2px solid \${color}\`;
        btnEl.style.background = \`\${color}18\`;
      }
      const stage = document.getElementById('imageStageWrapper');
      if (stage) stage.style.background = \`linear-gradient(135deg, \${color}25 0%, #FFFFFF 100%)\`;
      updateLivePreviewCard();
    }

    function calculateProductDiscount() {
      const price = parseFloat(document.getElementById('editProdPrice').value) || 0;
      const mrp = parseFloat(document.getElementById('editProdMrp').value) || 0;
      const badge = document.getElementById('productDiscountBadge');
      if (!badge) return;
      if (mrp > price && price > 0) {
        const off = Math.round(((mrp - price) / mrp) * 100);
        badge.textContent = \`Customer Discount: \${off}% OFF\`;
        badge.style.color = '#166534';
      } else {
        badge.textContent = 'Standard Pricing';
        badge.style.color = '#64748B';
      }
    }

    function togglePouchFields(hasPouch) {
      const container = document.getElementById('pouchVariantFields');
      if (container) {
        container.style.display = hasPouch ? 'grid' : 'none';
      }
    }

    function selectProductPresetImage(path) {
      document.getElementById('editProdImage').value = path;
      const preview = document.getElementById('editProdImagePreview');
      if (preview) preview.src = path;
      updateLivePreviewCard();
      showToast('Selected preset image', 'success');
    }

    function updateProductImageFromInput(val) {
      const preview = document.getElementById('editProdImagePreview');
      if (preview) preview.src = val || '/assets/images/bottle_blue.png';
      updateLivePreviewCard();
    }

    function handleProductImageUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result;
        const preview = document.getElementById('editProdImagePreview');
        if (preview) preview.src = dataUrl;

        try {
          const res = await fetch('/api/admin/media/upload', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ fileName: file.name, dataUrl })
          });
          if (res.ok) {
            const data = await res.json();
            const finalUrl = data.url || dataUrl;
            document.getElementById('editProdImage').value = finalUrl;
            showToast(\`Image uploaded: \${file.name}\`, 'success');
          } else {
            document.getElementById('editProdImage').value = dataUrl;
            showToast('Image loaded locally', 'success');
          }
        } catch (e) {
          document.getElementById('editProdImage').value = dataUrl;
          showToast('Image loaded', 'success');
        }
        updateLivePreviewCard();
      };
      reader.readAsDataURL(file);
    }

    function updateLivePreviewCard() {
      const name = document.getElementById('editProdName').value.trim() || 'White Mist Ocean Fresh';
      const tagline = document.getElementById('editProdTagline').value.trim() || 'Deep Bio-Clean & 48-Hour Sea Breeze Scent Lock';
      const category = document.getElementById('editProdCategory').value || 'Daily Wash Liquid';
      const badge = document.getElementById('editProdBadge').value || 'Bestseller';
      const price = document.getElementById('editProdPrice').value || '349';
      const mrp = document.getElementById('editProdMrp').value || '449';
      const img = document.getElementById('editProdImage').value.trim() || '/assets/images/bottle_blue.png';
      const color = document.getElementById('editProdAccentColor').value || '#0084FF';

      const titleEl = document.getElementById('previewCardTitle');
      const tagEl = document.getElementById('previewCardTagline');
      const catEl = document.getElementById('previewCardCategory');
      const badgeEl = document.getElementById('previewCardBadge');
      const priceEl = document.getElementById('previewCardPrice');
      const mrpEl = document.getElementById('previewCardMrp');
      const imgEl = document.getElementById('previewCardImg');
      const stageEl = document.getElementById('previewCardStage');

      if (titleEl) titleEl.textContent = name;
      if (tagEl) tagEl.textContent = tagline;
      if (catEl) catEl.textContent = category;
      if (badgeEl) badgeEl.textContent = badge;
      if (priceEl) priceEl.textContent = \`₹\${price}\`;
      if (mrpEl) mrpEl.textContent = \`₹\${mrp}\`;
      if (imgEl) imgEl.src = img;
      if (stageEl) stageEl.style.background = \`linear-gradient(135deg, \${color}25 0%, #FFFFFF 100%)\`;
    }

    async function openAddProductModal() {
      if (!allCategories || allCategories.length === 0) {
        await loadCategoriesData();
      } else {
        updateCategoryDropdowns();
      }

      document.getElementById('productModalTitle').innerHTML = \`
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        <span>Register New Detergent SKU & Homepage Showcase</span>
      \`;

      document.getElementById('editProdId').value = '';
      document.getElementById('editProdName').value = 'White Mist Ocean Fresh 2L Liquid Detergent';
      document.getElementById('editProdSku').value = 'WM-LD-2L-' + Math.floor(100 + Math.random() * 900);
      document.getElementById('editProdBadge').value = 'Bestseller';
      document.getElementById('editProdTagline').value = 'Deep Bio-Clean & 48-Hour Sea Breeze Scent Lock';
      document.getElementById('editProdFragrance').value = 'Cool Ocean & Crisp Cotton';
      document.getElementById('editProdMachineType').value = 'Front & Top Load';
      document.getElementById('editProdIsFeatured').checked = true;
      document.getElementById('editProdIsActive').checked = true;

      setProductThemeColor('#0084FF', document.querySelector('.color-theme-pill[data-color="#0084FF"]'));

      document.getElementById('editProdImage').value = '/assets/images/bottle_blue.png';
      document.getElementById('editProdImagePreview').src = '/assets/images/bottle_blue.png';

      document.getElementById('editProdPrice').value = '349';
      document.getElementById('editProdMrp').value = '449';
      document.getElementById('editProdStockQty').value = '250';
      calculateProductDiscount();

      document.getElementById('editProdHasPouch').checked = false;
      togglePouchFields(false);
      document.getElementById('editProdPouchPrice').value = '299';
      document.getElementById('editProdPouchMrp').value = '399';
      document.getElementById('editProdPouchImage').value = '/assets/images/pouch_blue.png';

      document.getElementById('editProdShortDesc').value = 'High-performance bio-enzyme laundry detergent engineered for superior stain removal and fabric freshness.';
      document.getElementById('editProdFeatures').value = '10x Bio-Enzyme Stain Action\\nFront Load & Top Load Safe\\n48-Hour Sea Breeze Fragrance Lock\\nColor Guard Technology';

      switchProductModalTab('tab-pm-general');
      document.getElementById('productModal').style.display = 'flex';
    }

    async function openEditProductModal(id) {
      const p = allProducts.find(item => item.id === id);
      if (!p) return;

      if (!allCategories || allCategories.length === 0) {
        await loadCategoriesData();
      }
      updateCategoryDropdowns(p.category);

      document.getElementById('productModalTitle').innerHTML = \`
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        <span>Edit Detergent SKU: \${p.name}</span>
      \`;

      document.getElementById('editProdId').value = p.id;
      document.getElementById('editProdName').value = p.name;
      document.getElementById('editProdSku').value = p.sku || 'WM-BLU-2000';
      if (document.getElementById('editProdCategory')) {
        document.getElementById('editProdCategory').value = p.category;
      }
      document.getElementById('editProdBadge').value = p.badge || 'Bestseller';
      document.getElementById('editProdTagline').value = p.subtitle || p.tagline || 'Deep Bio-Clean & Fabric Care';
      document.getElementById('editProdFragrance').value = p.fragrance || 'Cool Ocean & Crisp Cotton';
      document.getElementById('editProdMachineType').value = p.machineType || 'Front & Top Load';
      document.getElementById('editProdIsFeatured').checked = p.isFeatured === true;
      document.getElementById('editProdIsActive').checked = p.isActive !== false;

      const accentColor = p.accentColor || '#0084FF';
      setProductThemeColor(accentColor, document.querySelector(\`.color-theme-pill[data-color="\${accentColor}"]\`));

      const img = p.image || '/assets/images/bottle_blue.png';
      document.getElementById('editProdImage').value = img;
      document.getElementById('editProdImagePreview').src = img;

      const defaultSize = (p.sizes && p.sizes[0]) || { price: 349, mrp: 449 };
      document.getElementById('editProdPrice').value = defaultSize.price || 349;
      document.getElementById('editProdMrp').value = defaultSize.mrp || 449;
      document.getElementById('editProdStockQty').value = p.stockQty || 200;
      calculateProductDiscount();

      const hasPouch = p.sizes && p.sizes.length > 1;
      document.getElementById('editProdHasPouch').checked = hasPouch;
      togglePouchFields(hasPouch);
      if (hasPouch && p.sizes[1]) {
        document.getElementById('editProdPouchPrice').value = p.sizes[1].price || 299;
        document.getElementById('editProdPouchMrp').value = p.sizes[1].mrp || 399;
      }

      document.getElementById('editProdShortDesc').value = p.shortDesc || '';
      document.getElementById('editProdFeatures').value = Array.isArray(p.features) ? p.features.join('\\n') : (p.features || '');

      switchProductModalTab('tab-pm-general');
      document.getElementById('productModal').style.display = 'flex';
    }

    function closeProductModal() {
      document.getElementById('productModal').style.display = 'none';
    }

    async function saveProductModalSubmit() {
      const id = document.getElementById('editProdId').value;
      const name = document.getElementById('editProdName').value.trim();
      if (!name) return showToast('Product name is required', 'error');

      const saveBtn = document.getElementById('btnSubmitProductForm');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span>Publishing...</span>';
      }

      const sku = document.getElementById('editProdSku').value.trim();
      const category = document.getElementById('editProdCategory').value;
      const badge = document.getElementById('editProdBadge').value;
      const tagline = document.getElementById('editProdTagline').value.trim();
      const fragrance = document.getElementById('editProdFragrance').value.trim();
      const machineType = document.getElementById('editProdMachineType').value;
      const accentColor = document.getElementById('editProdAccentColor').value;
      const isFeatured = document.getElementById('editProdIsFeatured').checked;
      const isActive = document.getElementById('editProdIsActive').checked;
      const image = document.getElementById('editProdImage').value.trim() || '/assets/images/bottle_blue.png';

      const price = parseFloat(document.getElementById('editProdPrice').value) || 349;
      const mrp = parseFloat(document.getElementById('editProdMrp').value) || 449;
      const stockQty = parseInt(document.getElementById('editProdStockQty').value, 10) || 100;

      // Notice: NO URL SLUG input field is exposed on the form.
      // Auto-generate clean slug automatically in background:
      const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const sizes = [
        {
          size: '2 Litre',
          price: price,
          mrp: mrp,
          savings: mrp > price ? \`\${Math.round(((mrp - price) / mrp) * 100)}%\` : '0%',
          isDefault: true
        }
      ];

      const hasPouch = document.getElementById('editProdHasPouch').checked;
      if (hasPouch) {
        const pPrice = parseFloat(document.getElementById('editProdPouchPrice').value) || 299;
        const pMrp = parseFloat(document.getElementById('editProdPouchMrp').value) || 399;
        sizes.push({
          size: '2kg Refill Pouch',
          price: pPrice,
          mrp: pMrp,
          savings: pMrp > pPrice ? \`\${Math.round(((pMrp - pPrice) / pMrp) * 100)}%\` : '0%',
          isDefault: false
        });
      }

      const shortDesc = document.getElementById('editProdShortDesc').value.trim();
      const rawFeatures = document.getElementById('editProdFeatures').value.trim();
      const features = rawFeatures ? rawFeatures.split('\\n').map(f => f.trim()).filter(Boolean) : [];

      const payload = {
        name,
        sku,
        slug: autoSlug,
        category,
        badge,
        subtitle: tagline,
        tagline: tagline,
        fragrance,
        machineType,
        accentColor,
        isFeatured,
        isActive,
        image,
        sizes,
        stockQty,
        inStock: stockQty > 0,
        shortDesc,
        fullDesc: shortDesc,
        features
      };

      try {
        const url = id ? \`/api/admin/products/\${id}\` : '/api/admin/products';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          showToast(\`Product "\${name}" published successfully!\`, 'success');
          closeProductModal();
          loadProductsData();
        } else {
          const errData = await res.json().catch(() => ({}));
          showToast(errData.error || 'Failed to save product', 'error');
        }
      } catch (err) {
        showToast('Error saving product: ' + err.message, 'error');
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = \`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Publish Product to Store & Homepage</span>\`;
        }
      }
    }

    // =========================================================================
    // 3. CATEGORIES MANAGEMENT MODAL (Matching Image 2)
    // =========================================================================
    function openAddCategoryModal() {
      document.getElementById('newCatName').value = '';
      document.getElementById('newCatSlug').value = '';
      document.getElementById('newCatSlugPreview').textContent = '/category/category-slug';
      document.getElementById('newCatDesc').value = '';
      document.getElementById('categoryModal').style.display = 'flex';
      setTimeout(() => document.getElementById('newCatName').focus(), 100);
    }

    function closeAddCategoryModal() {
      document.getElementById('categoryModal').style.display = 'none';
    }

    function autoGenerateCategorySlug(name) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      document.getElementById('newCatSlug').value = slug;
      document.getElementById('newCatSlugPreview').textContent = \`/category/\${slug || 'category-slug'}\`;
    }

    async function handleCreateCategorySubmit() {
      const name = document.getElementById('newCatName').value.trim();
      if (!name) return showToast('Category name is required', 'error');

      const slug = document.getElementById('newCatSlug').value.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const description = document.getElementById('newCatDesc').value.trim();
      const submitBtn = document.getElementById('btnSubmitCreateCategory');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
      }

      try {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ name, slug, description })
        });

        if (res.ok) {
          showToast(\`Category "\${name}" created successfully!\`, 'success');
          closeAddCategoryModal();
          await loadCategoriesData();
          updateCategoryDropdowns(name);
        } else {
          const err = await res.json().catch(() => ({}));
          showToast(err.error || 'Failed to create category', 'error');
        }
      } catch (e) {
        showToast('Error creating category: ' + e.message, 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Category';
        }
      }
    }`;

// Replace the entire old product/category JS chunk
const oldProductAndCategoryChunk = content.substring(
  content.indexOf(oldProductFunctionsStart),
  content.indexOf(oldCategoryPromptEnd) + oldCategoryPromptEnd.length
);

if (content.includes(oldProductFunctionsStart) && content.includes(oldCategoryPromptEnd)) {
  content = content.replace(oldProductAndCategoryChunk, newProductAndCategoryFunctions);
  console.log('✓ Replaced product and category JS functions');
} else {
  console.log('⚠ Could not match oldProductAndCategoryChunk');
}

// 3. ADD SUPER ADMIN ADMINISTRATOR MANAGEMENT JS FUNCTIONS
const superAdminJsFunctions = `
    // =========================================================================
    // SUPER ADMIN - ADMINISTRATOR TEAM & ROLE MANAGEMENT
    // =========================================================================
    let allAdminUsers = [];

    async function loadAdminUsers() {
      const tbody = document.getElementById('adminUsersTableBody');
      if (!tbody) return;

      try {
        const res = await fetch('/api/admin/users', { headers: getAuthHeaders() });
        if (!res.ok) {
          if (res.status === 403) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">Access Restricted: Only Super Administrators can view and manage team privileges.</td></tr>';
            return;
          }
          tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">Unable to load team members.</td></tr>';
          return;
        }

        const data = await res.json();
        allAdminUsers = Array.isArray(data.admins) ? data.admins : [];

        if (allAdminUsers.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">No administrators registered.</td></tr>';
          return;
        }

        const storedUser = JSON.parse(sessionStorage.getItem('wm_admin_user') || localStorage.getItem('wm_admin_user') || '{}');
        const currentEmail = (storedUser.email || '').toLowerCase();

        tbody.innerHTML = allAdminUsers.map((a, idx) => {
          const isSuper = (a.role || '').toUpperCase() === 'SUPER_ADMIN';
          const isSelf = (a.email || '').toLowerCase() === currentEmail;

          return \`
            <tr>
              <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${idx + 1}</td>
              <td>
                <strong style="color: var(--text-main); font-size: 0.92rem; display: block;">\${a.name || 'Admin User'}</strong>
                \${isSelf ? '<span class="badge" style="background: #EFF6FF; color: #2563EB; font-size: 0.68rem; margin-top: 0.15rem; display: inline-block;">You (Current Session)</span>' : ''}
              </td>
              <td>
                <span style="font-family: monospace; font-size: 0.85rem; color: #0284C7;">\${a.email}</span>
              </td>
              <td>
                \${isSuper 
                  ? '<span class="badge" style="background: #FDF2F8; color: #DB2777; border: 1px solid #FBCFE8; font-weight: 800; font-size: 0.75rem;">★ SUPER ADMIN</span>'
                  : '<span class="badge badge-primary" style="font-size: 0.75rem; font-weight: 700;">ADMIN</span>'}
              </td>
              <td style="color: var(--text-muted); font-size: 0.85rem;">\${a.title || a.department || 'Store Operations'}</td>
              <td>
                <span class="badge badge-success" style="font-size: 0.72rem;">● Active</span>
              </td>
              <td>
                <div class="table-actions">
                  <button 
                    type="button" 
                    class="btn-action-public" 
                    style="padding: 0.28rem 0.65rem; font-size: 0.75rem;" 
                    onclick="toggleAdminUserRole('\${a.id || a.email}', '\${a.role || 'ADMIN'}')"
                    \${isSelf ? 'disabled title="Cannot modify current session role"' : ''}
                  >
                    \${isSuper ? 'Demote to Admin' : 'Promote to Super Admin'}
                  </button>
                  <button 
                    type="button" 
                    class="btn-icon-table delete" 
                    title="Delete Administrator" 
                    onclick="deleteAdminUser('\${a.id || a.email}', '\${a.name}')"
                    \${isSelf ? 'disabled style="opacity: 0.35; cursor: not-allowed;" title="Cannot delete current session"' : ''}
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          \`;
        }).join('');

      } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--color-danger); padding: 1.5rem;">Error loading administrators.</td></tr>';
      }
    }

    function openProvisionAdminModal() {
      document.getElementById('newAdminName').value = '';
      document.getElementById('newAdminEmail').value = '';
      document.getElementById('newAdminTitle').value = 'Store Operations & Fulfillment';
      document.getElementById('newAdminRole').value = 'ADMIN';
      document.getElementById('newAdminPassword').value = '';
      document.getElementById('provisionAdminModal').style.display = 'flex';
      setTimeout(() => document.getElementById('newAdminName').focus(), 100);
    }

    function closeProvisionAdminModal() {
      document.getElementById('provisionAdminModal').style.display = 'none';
    }

    async function handleCreateAdminUser() {
      const name = document.getElementById('newAdminName').value.trim();
      const email = document.getElementById('newAdminEmail').value.trim();
      const role = document.getElementById('newAdminRole').value;
      const title = document.getElementById('newAdminTitle').value.trim();
      const password = document.getElementById('newAdminPassword').value;

      if (!name || !email || !password) {
        return showToast('Please complete name, email, and password', 'error');
      }

      const btn = document.getElementById('btnSubmitProvisionAdmin');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Provisioning...';
      }

      try {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ name, email, role, title, password })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          showToast(\`Administrator "\${name}" provisioned successfully!\`, 'success');
          closeProvisionAdminModal();
          loadAdminUsers();
        } else {
          showToast(data.error || 'Failed to provision admin account', 'error');
        }
      } catch (e) {
        showToast('Error provisioning admin: ' + e.message, 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Provision Administrator';
        }
      }
    }

    async function toggleAdminUserRole(id, currentRole) {
      const newRole = currentRole === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN';
      const roleLabel = newRole === 'SUPER_ADMIN' ? 'Super Administrator' : 'Administrator';
      if (!confirm(\`Change privileges of administrator \${id} to \${roleLabel}?\`)) return;

      try {
        const res = await fetch(\`/api/admin/users/\${encodeURIComponent(id)}\`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ role: newRole })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(\`Role updated to \${roleLabel}\`, 'success');
          loadAdminUsers();
        } else {
          showToast(data.error || 'Failed to update privileges', 'error');
        }
      } catch (e) {
        showToast('Error updating role: ' + e.message, 'error');
      }
    }

    async function deleteAdminUser(id, name) {
      if (!confirm(\`Permanently revoke access and delete administrator "\${name}"?\`)) return;

      try {
        const res = await fetch(\`/api/admin/users/\${encodeURIComponent(id)}\`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(\`Administrator "\${name}" removed from system.\`, 'success');
          loadAdminUsers();
        } else {
          showToast(data.error || 'Failed to delete admin', 'error');
        }
      } catch (e) {
        showToast('Error deleting admin: ' + e.message, 'error');
      }
    }`;

// 4. UPDATE openAdminInvoiceModal WITH RESPONSIVE DUAL-VIEW & MOBILE PRODUCT CARDS
const oldOpenAdminInvoiceModalStart = `    async function openAdminInvoiceModal(invoiceNumber) {`;
const oldCloseAdminInvoiceModalEnd = `    function closeAdminInvoiceModal() {
      document.getElementById('adminInvoiceModal').style.display = 'none';
      currentAdminInvoice = null;
    }`;

const newOpenAdminInvoiceModal = `    async function openAdminInvoiceModal(invoiceNumber) {
      let inv = allInvoices.find(i => i.invoiceNumber === invoiceNumber || i.id === invoiceNumber);
      if (!inv) {
        try {
          const res = await fetch(\`/api/admin/invoices/\${encodeURIComponent(invoiceNumber)}\`, { headers: getAuthHeaders() });
          if (res.ok) inv = await res.json();
        } catch (e) {}
      }

      if (!inv) {
        const order = allOrders.find(o => o.invoiceNumber === invoiceNumber || o.id === invoiceNumber);
        if (order) {
          inv = {
            invoiceNumber: order.invoiceNumber || \`WM-INV-2026-\${order.id.replace('WM-ORD-', '')}\`,
            orderId: order.id,
            transactionId: order.transactionId || 'TXN-WM-892101',
            invoiceDate: order.createdAt || new Date().toISOString(),
            paymentDate: order.createdAt || new Date().toISOString(),
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            billingAddress: order.shippingAddress,
            items: order.items,
            subtotal: order.subtotal || +(order.total / 1.18).toFixed(2),
            taxableAmount: order.subtotal || +(order.total / 1.18).toFixed(2),
            cgst: order.cgst || +((order.total - (order.total / 1.18)) / 2).toFixed(2),
            sgst: order.sgst || +((order.total - (order.total / 1.18)) / 2).toFixed(2),
            shippingCharges: order.shippingFee || 0,
            grandTotal: order.total,
            amountPaid: order.total,
            balanceDue: 0,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus || 'PAID',
            status: 'PAID'
          };
        }
      }

      if (!inv) {
        showToast('Tax invoice could not be loaded', 'error');
        return;
      }

      currentAdminInvoice = inv;
      const invNumEl = document.getElementById('adminInvoiceModalNumber');
      if (invNumEl) invNumEl.textContent = inv.invoiceNumber;
      const invBadgeEl = document.getElementById('adminInvoiceModalBadge');
      if (invBadgeEl) invBadgeEl.textContent = '✓ ' + (inv.paymentStatus || 'PAID');

      const company = inv.companyDetails || {
        name: "Meridian White Mist Private Limited",
        brand: "White Mist",
        address: "Plot 42, Eco Clean Corridor, Bellandur, Outer Ring Road, Bengaluru, Karnataka, India - 560103",
        gstin: "29AAACW1234F1Z8",
        cin: "U24246KA2026PTC189210",
        pan: "AAACW1234F",
        contactEmail: "care@whitemist.com",
        contactPhone: "+91 98860 44210"
      };

      const bAddr = inv.billingAddress || {};
      const addrStr = typeof bAddr === 'string' ? bAddr : [bAddr.address || bAddr.street, bAddr.city, bAddr.state, bAddr.pincode].filter(Boolean).join(', ') || 'Bengaluru, Karnataka - 560103';

      const dateStr = inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '28 Oct 2026';
      const payDateStr = inv.paymentDate ? new Date(inv.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : dateStr;

      // Number to words helper
      function numToWords(n) {
        const num = Math.round(Number(n) || 0);
        if (num === 0) return 'Zero Rupees Only';
        const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        function inWords(nVal) {
          if ((nVal = nVal.toString()).length > 9) return 'overflow';
          let m = ('000000000' + nVal).substr(-9).match(/^(\\d{2})(\\d{2})(\\d{2})(\\d{1})(\\d{2})$/);
          if (!m) return '';
          let str = '';
          str += (m[1] != 0) ? (a[Number(m[1])] || b[m[1][0]] + ' ' + a[m[1][1]]) + ' Crore ' : '';
          str += (m[2] != 0) ? (a[Number(m[2])] || b[m[2][0]] + ' ' + a[m[2][1]]) + ' Lakh ' : '';
          str += (m[3] != 0) ? (a[Number(m[3])] || b[m[3][0]] + ' ' + a[m[3][1]]) + ' Thousand ' : '';
          str += (m[4] != 0) ? (a[Number(m[4])] || b[m[4][0]] + ' ' + a[m[4][1]]) + ' Hundred ' : '';
          str += (m[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(m[5])] || b[m[5][0]] + ' ' + a[m[5][1]]) + ' ' : '';
          return str.trim();
        }
        return inWords(num) + ' Rupees Only';
      }

      let computedTotal = 0;
      let computedSubtotal = 0;
      let computedTax = 0;

      const itemsProcessed = (inv.items || []).map((it, idx) => {
        const qty = Number(it.qty || it.quantity || 1);
        let grossTotal = Number(it.total);
        if (!grossTotal || isNaN(grossTotal)) {
          grossTotal = Number(it.price) ? Number(it.price) * qty : (Number(it.grossUnitPrice || 349) * qty);
        }
        if (!grossTotal || grossTotal <= 0) grossTotal = 349 * qty;

        const unitTaxable = Number(it.unitPrice) || +(grossTotal / qty / 1.18).toFixed(2);
        const taxableVal = +(unitTaxable * qty).toFixed(2);
        const tax = Number(it.taxAmount) || +(grossTotal - taxableVal).toFixed(2);
        const total = grossTotal;

        computedSubtotal += taxableVal;
        computedTax += tax;
        computedTotal += total;

        return {
          idx: idx + 1,
          name: it.name || 'White Mist Ocean Fresh Liquid Detergent 2L',
          sku: it.sku || 'WM-BLU-2000',
          hsn: it.hsn || '3402',
          qty,
          unitTaxable,
          taxableVal,
          gstRate: it.gstRate || 18,
          tax,
          total
        };
      });

      const grandTotal = Number(inv.grandTotal || inv.total || 0) || computedTotal || 698;
      const taxableSubtotal = Number(inv.taxableAmount || inv.subtotal || 0) || computedSubtotal || +(grandTotal / 1.18).toFixed(2);
      const totalTax = Number(inv.totalTax || inv.igst || 0) || computedTax || +(grandTotal - taxableSubtotal).toFixed(2);
      const cgst = Number(inv.cgst || 0) || +(totalTax / 2).toFixed(2);
      const sgst = Number(inv.sgst || 0) || +(totalTax - cgst).toFixed(2);
      const shipping = Number(inv.shippingCharges || 0);
      const amountPaid = Number(inv.amountPaid || grandTotal);
      const wordsStr = numToWords(grandTotal);

      // Desktop Table Rows
      const desktopTableRowsHtml = itemsProcessed.map(it => \`
        <tr style="border-bottom: 1px solid #E2E8F0; background: \${it.idx % 2 === 0 ? '#FAFCFF' : '#FFFFFF'};">
          <td style="padding: 0.65rem 0.75rem; text-align: center; color: #64748B; border-right: 1px solid #E2E8F0;">\${it.idx}</td>
          <td style="padding: 0.65rem 0.75rem; border-right: 1px solid #E2E8F0;">
            <strong style="color: #0F172A; display: block; font-size: 0.88rem;">\${it.name}</strong>
            <span style="font-size: 0.72rem; color: #64748B; font-family: monospace;">SKU: \${it.sku}</span>
          </td>
          <td style="padding: 0.65rem 0.75rem; text-align: center; color: #475569; border-right: 1px solid #E2E8F0; font-family: monospace;">\${it.hsn}</td>
          <td style="padding: 0.65rem 0.75rem; text-align: center; font-weight: 700; border-right: 1px solid #E2E8F0;">\${it.qty}</td>
          <td style="padding: 0.65rem 0.75rem; text-align: right; border-right: 1px solid #E2E8F0;">₹\${it.unitTaxable.toFixed(2)}</td>
          <td style="padding: 0.65rem 0.75rem; text-align: right; border-right: 1px solid #E2E8F0; font-weight: 600;">₹\${it.taxableVal.toFixed(2)}</td>
          <td style="padding: 0.65rem 0.75rem; text-align: center; border-right: 1px solid #E2E8F0;">\${it.gstRate}%</td>
          <td style="padding: 0.65rem 0.75rem; text-align: right; color: #475569; border-right: 1px solid #E2E8F0;">₹\${it.tax.toFixed(2)}</td>
          <td style="padding: 0.65rem 0.75rem; text-align: right; font-weight: 700; color: #0F172A;">₹\${it.total.toFixed(2)}</td>
        </tr>
      \`).join('');

      // Mobile Responsive Cards
      const mobileCardsHtml = itemsProcessed.map(it => \`
        <div class="invoice-product-card">
          <div class="product-card-top">
            <div class="product-card-title">\${it.name}</div>
            <div class="product-card-meta-line">
              <span class="meta-tag">HSN: \${it.hsn}</span>
              <span class="meta-tag">SKU: \${it.sku}</span>
            </div>
          </div>
          <div class="product-card-grid">
            <div class="product-grid-item">
              <span class="metric-label">Quantity</span>
              <span class="metric-val font-bold">\${it.qty}</span>
            </div>
            <div class="product-grid-item">
              <span class="metric-label">Unit Price</span>
              <span class="metric-val">₹\${it.unitTaxable.toFixed(2)}</span>
            </div>
            <div class="product-grid-item">
              <span class="metric-label">Taxable Amount</span>
              <span class="metric-val">₹\${it.taxableVal.toFixed(2)}</span>
            </div>
            <div class="product-grid-item">
              <span class="metric-label">GST %</span>
              <span class="metric-val">\${it.gstRate}%</span>
            </div>
            <div class="product-grid-item">
              <span class="metric-label">Tax Amount</span>
              <span class="metric-val">₹\${it.tax.toFixed(2)}</span>
            </div>
            <div class="product-grid-item highlight">
              <span class="metric-label">Total Amount</span>
              <span class="metric-val">₹\${it.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      \`).join('');

      document.getElementById('adminInvoicePrintSheet').innerHTML = \`
        <!-- BRANDED INVOICE HEADER BANNER -->
        <div style="border-radius: 8px; overflow: hidden; width: 100%; margin-bottom: 0.75rem; border: 1px solid #E2E8F0; background: #F8FAFC;">
          <img src="/assets/images/invoice_header_banner.jpg" alt="Meridian White Mist Pvt. Ltd." style="width: 100%; height: auto; display: block;" onerror="this.onerror=null; this.src='/images/invoice_header_banner.jpg';">
        </div>

        <!-- GST & CORPORATE TAX REGISTRATION LINE -->
        <div class="invoice-tax-meta-bar">
          <div class="tax-meta-item"><strong>GSTIN:</strong> <span>\${company.gstin}</span></div>
          <div class="tax-meta-item"><strong>CIN:</strong> <span>\${company.cin}</span></div>
          <div class="tax-meta-item"><strong>PAN:</strong> <span>\${company.pan}</span></div>
        </div>

        <!-- CUSTOMER AND PAYMENT DETAILS (VERTICALLY STACKED ON MOBILE) -->
        <div class="invoice-meta-grid">
          <div class="invoice-meta-card">
            <div class="invoice-card-heading">Customer Details</div>
            <div class="invoice-customer-name">\${inv.customerName}</div>
            <div class="invoice-customer-addr">\${addrStr}</div>
            <div class="invoice-customer-meta">
              <div><strong>Email:</strong> \${inv.customerEmail || 'N/A'}</div>
              <div><strong>Phone:</strong> \${inv.customerPhone || 'N/A'}</div>
            </div>
            <div class="invoice-customer-pos">
              <strong>Place of Supply:</strong> \${bAddr.state || 'Karnataka'} (State Code: 29)
            </div>
          </div>

          <div class="invoice-meta-card">
            <div class="invoice-card-heading">Payment Information</div>
            <div class="invoice-pay-row">
              <span class="pay-label">Payment Method:</span>
              <span class="pay-val">\${inv.paymentMethod || 'Razorpay UPI'}</span>
            </div>
            <div class="invoice-pay-row">
              <span class="pay-label">Transaction ID:</span>
              <span class="pay-val" style="font-family: monospace;">\${inv.transactionId || 'TXN-WM-892101'}</span>
            </div>
            <div class="invoice-pay-row">
              <span class="pay-label">Settlement Date:</span>
              <span class="pay-val">\${payDateStr}</span>
            </div>
            <div class="invoice-pay-status-row">
              <span class="badge badge-success">✓ PAID IN FULL</span>
              <span style="font-size: 0.75rem; color: #16A34A; font-weight: 600;">Gateway Verified</span>
            </div>
          </div>
        </div>

        <!-- DESKTOP TAX INVOICE TABLE (DESKTOP & A4 PRINT) -->
        <div class="invoice-products-desktop">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
            <thead>
              <tr style="background: #F1F5F9; border-bottom: 2px solid #CBD5E1; color: #1E293B;">
                <th style="padding: 0.65rem 0.75rem; width: 35px; text-align: center; border-right: 1px solid #E2E8F0;">#</th>
                <th style="padding: 0.65rem 0.75rem; border-right: 1px solid #E2E8F0;">Description of Goods</th>
                <th style="padding: 0.65rem 0.75rem; width: 65px; text-align: center; border-right: 1px solid #E2E8F0;">HSN</th>
                <th style="padding: 0.65rem 0.75rem; width: 50px; text-align: center; border-right: 1px solid #E2E8F0;">Qty</th>
                <th style="padding: 0.65rem 0.75rem; width: 95px; text-align: right; border-right: 1px solid #E2E8F0;">Unit Taxable</th>
                <th style="padding: 0.65rem 0.75rem; width: 95px; text-align: right; border-right: 1px solid #E2E8F0;">Taxable Amt</th>
                <th style="padding: 0.65rem 0.75rem; width: 65px; text-align: center; border-right: 1px solid #E2E8F0;">GST %</th>
                <th style="padding: 0.65rem 0.75rem; width: 85px; text-align: right; border-right: 1px solid #E2E8F0;">Tax (₹)</th>
                <th style="padding: 0.65rem 0.75rem; width: 95px; text-align: right;">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              \${desktopTableRowsHtml}
            </tbody>
            <tfoot>
              <tr style="border-top: 2px solid #CBD5E1; background: #F8FAFC;">
                <td colspan="5" style="padding: 1rem 1.25rem; vertical-align: top; border-right: 1px solid #E2E8F0;">
                  <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #64748B; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
                    Invoice Amount in Words:
                  </div>
                  <strong style="color: #0F172A; font-size: 0.88rem; display: block; line-height: 1.4;">
                    \${wordsStr}
                  </strong>
                  <div style="margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px dashed #CBD5E1; font-size: 0.78rem; color: #15803D; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
                    <span>✓</span>
                    <span>Payment Confirmed via \${inv.paymentMethod || 'Razorpay UPI'} (Ref: \${inv.transactionId || 'TXN-WM-406283'})</span>
                  </div>
                </td>
                <td colspan="4" style="padding: 0; vertical-align: top;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
                    <tr style="border-bottom: 1px solid #E2E8F0;">
                      <td style="padding: 0.45rem 0.75rem; color: #64748B;">Taxable Subtotal:</td>
                      <td style="padding: 0.45rem 0.75rem; text-align: right; font-weight: 600; color: #0F172A;">₹\${taxableSubtotal.toFixed(2)}</td>
                    </tr>
                    \${cgst > 0 ? \`
                      <tr style="border-bottom: 1px solid #E2E8F0;">
                        <td style="padding: 0.4rem 0.75rem; color: #475569;">CGST (9.0%):</td>
                        <td style="padding: 0.4rem 0.75rem; text-align: right; color: #475569;">₹\${cgst.toFixed(2)}</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #E2E8F0;">
                        <td style="padding: 0.4rem 0.75rem; color: #475569;">SGST (9.0%):</td>
                        <td style="padding: 0.4rem 0.75rem; text-align: right; color: #475569;">₹\${sgst.toFixed(2)}</td>
                      </tr>
                    \` : \`
                      <tr style="border-bottom: 1px solid #E2E8F0;">
                        <td style="padding: 0.4rem 0.75rem; color: #475569;">IGST (18.0%):</td>
                        <td style="padding: 0.4rem 0.75rem; text-align: right; color: #475569;">₹\${totalTax.toFixed(2)}</td>
                      </tr>
                    \`}
                    <tr style="border-bottom: 1px solid #E2E8F0;">
                      <td style="padding: 0.4rem 0.75rem; color: #64748B;">Delivery & Shipping:</td>
                      <td style="padding: 0.4rem 0.75rem; text-align: right; color: #16A34A; font-weight: 700;">
                        \${shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(2)}
                      </td>
                    </tr>
                    <tr style="background: #EFF6FF; border-top: 2px solid #2563EB; border-bottom: 2px solid #2563EB;">
                      <td style="padding: 0.65rem 0.75rem; font-weight: 800; font-size: 0.95rem; color: #0F172A;">Grand Total (INR):</td>
                      <td style="padding: 0.65rem 0.75rem; text-align: right; font-weight: 900; font-size: 1.15rem; color: #2563EB;">₹\${grandTotal.toFixed(2)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E2E8F0;">
                      <td style="padding: 0.35rem 0.75rem; color: #15803D; font-weight: 700;">Amount Paid:</td>
                      <td style="padding: 0.35rem 0.75rem; text-align: right; color: #15803D; font-weight: 700;">₹\${amountPaid.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 0.35rem 0.75rem; color: #64748B;">Balance Due:</td>
                      <td style="padding: 0.35rem 0.75rem; text-align: right; color: #64748B;">₹0.00</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- MOBILE PRODUCT CARDS (< 768px) -->
        <div class="invoice-products-mobile">
          \${mobileCardsHtml}

          <!-- Clean Mobile Price Summary -->
          <div class="invoice-mobile-summary-card">
            <div class="summary-words-box">
              <div class="words-label">Invoice Amount in Words</div>
              <div class="words-text">\${wordsStr}</div>
            </div>
            <div class="summary-breakdown">
              <div class="summary-row">
                <span>Taxable Subtotal:</span>
                <span class="font-bold">₹\${taxableSubtotal.toFixed(2)}</span>
              </div>
              \${cgst > 0 ? \`
                <div class="summary-row">
                  <span>CGST (9.0%):</span>
                  <span>₹\${cgst.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>SGST (9.0%):</span>
                  <span>₹\${sgst.toFixed(2)}</span>
                </div>
              \` : \`
                <div class="summary-row">
                  <span>IGST (18.0%):</span>
                  <span>₹\${totalTax.toFixed(2)}</span>
                </div>
              \`}
              <div class="summary-row">
                <span>Delivery Charges:</span>
                <span style="color: #16A34A; font-weight: 700;">\${shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(2)}</span>
              </div>
              <div class="summary-row summary-grand-total">
                <span>Grand Total:</span>
                <span class="grand-total-val">₹\${grandTotal.toFixed(2)}</span>
              </div>
              <div class="summary-row summary-paid">
                <span>Amount Paid:</span>
                <span class="paid-val">₹\${amountPaid.toFixed(2)}</span>
              </div>
              <div class="summary-row summary-balance">
                <span>Balance Due:</span>
                <span style="font-weight: 700;">₹0.00</span>
              </div>
            </div>
          </div>
        </div>

        <!-- BOTTOM SIGNATORY -->
        <div class="invoice-signatory-wrap">
          <div class="signatory-box">
            <div class="signatory-org">For MERIDIAN WHITE MIST PVT. LTD.</div>
            <div class="signatory-sig">Meridian White Mist</div>
            <div class="signatory-label">Authorized Signatory</div>
          </div>
        </div>

        <!-- TERMS & CONDITIONS -->
        <div class="invoice-terms-box">
          <strong style="color: #1E293B; display: block; margin-bottom: 0.25rem;">Terms & Conditions:</strong>
          <ul>
            <li>This is an electronically generated and verified official commercial Tax Invoice.</li>
            <li>All disputes are subject to Bengaluru jurisdiction.</li>
          </ul>
        </div>

        <!-- BRANDED INVOICE FOOTER BANNER -->
        <div class="invoice-footer-banner-wrap">
          <img src="/assets/images/invoice_footer_banner.png" alt="Stay Fresh with White Mist" style="width: 100%; height: auto; display: block;" onerror="this.onerror=null; this.src='/images/invoice_footer_banner.png';">
        </div>

        <div class="invoice-footer-thankyou">
          Thank you for choosing White Mist – Premium Bio-Enzyme Fabric Care.
        </div>
      \`;

      document.getElementById('adminInvoiceModal').style.display = 'flex';
    }

    function closeAdminInvoiceModal() {
      document.getElementById('adminInvoiceModal').style.display = 'none';
      currentAdminInvoice = null;
    }
    
    ${superAdminJsFunctions}`;

const oldInvoiceChunk = content.substring(
  content.indexOf(oldOpenAdminInvoiceModalStart),
  content.indexOf(oldCloseAdminInvoiceModalEnd) + oldCloseAdminInvoiceModalEnd.length
);

if (content.includes(oldOpenAdminInvoiceModalStart) && content.includes(oldCloseAdminInvoiceModalEnd)) {
  content = content.replace(oldInvoiceChunk, newOpenAdminInvoiceModal);
  console.log('✓ Replaced openAdminInvoiceModal with responsive dual-view and added Super Admin JS functions');
} else {
  console.log('⚠ Could not match oldInvoiceChunk');
}

fs.writeFileSync(adminHtmlPath, content, 'utf8');
console.log('Saved admin.html (Stage 4). Length:', content.length);

