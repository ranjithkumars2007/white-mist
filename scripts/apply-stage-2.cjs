const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.join(__dirname, '..', 'admin.html');
let content = fs.readFileSync(adminHtmlPath, 'utf8');

// 1. REPLACE #productModal WITH THE NEW 5-TAB MODAL MATCHING IMAGE 1
const oldProductModalRegex = /<!-- PRODUCT ADD\/EDIT MODAL -->[\s\S]*?<!-- ORDER DETAIL MODAL -->/;

const newProductModalHtml = `<!-- =======================================================================
       REGISTER NEW DETERGENT SKU & HOMEPAGE SHOWCASE MODAL (Matching Image 1)
       ======================================================================= -->
  <div class="modal-backdrop" id="productModal" style="display: none; z-index: 99999;">
    <div class="modal-box" style="max-width: 860px; max-height: 94vh; padding: 0; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
      
      <!-- Modal Header -->
      <div class="modal-header" style="padding: 1.25rem 1.5rem; background: #FAFCFF; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 0.5rem;" id="productModalTitle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <span>Register New Detergent SKU & Homepage Showcase</span>
          </h3>
          <p style="font-size: 0.82rem; color: #64748B; margin: 0.25rem 0 0 0;">
            Configure product catalog details, homepage presentation, media images, variants, and formula highlights.
          </p>
        </div>
        <button type="button" class="modal-close-btn" onclick="closeProductModal()" aria-label="Close dialog">✕</button>
      </div>

      <!-- Modal Tabs Navigation -->
      <div class="modal-tabs" id="newProductModalTabs" style="display: flex; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 0 1.25rem; margin: 0; overflow-x: auto; gap: 0.5rem;">
        <button type="button" class="modal-tab-btn active" data-tab="tab-pm-general" onclick="switchProductModalTab('tab-pm-general')">
          ✨ Homepage & Branding
        </button>
        <button type="button" class="modal-tab-btn" data-tab="tab-pm-images" onclick="switchProductModalTab('tab-pm-images')">
          🖼 Product Images & Media
        </button>
        <button type="button" class="modal-tab-btn" data-tab="tab-pm-pricing" onclick="switchProductModalTab('tab-pm-pricing')">
          🛍 Pack Sizes & Pricing
        </button>
        <button type="button" class="modal-tab-btn" data-tab="tab-pm-details" onclick="switchProductModalTab('tab-pm-details')">
          📄 Description & Features
        </button>
        <button type="button" class="modal-tab-btn" data-tab="tab-pm-preview" onclick="switchProductModalTab('tab-pm-preview')">
          👁 Live Homepage Card Preview
        </button>
      </div>

      <!-- Form Body -->
      <form id="productEditForm" onsubmit="event.preventDefault(); saveProductModalSubmit();" style="display: flex; flex-direction: column; flex: 1; overflow: hidden; margin: 0;">
        <input type="hidden" id="editProdId">
        <input type="hidden" id="editProdAccentColor" value="#0084FF">

        <div class="modal-body" style="padding: 1.5rem; overflow-y: auto; flex: 1;">
          
          <!-- TAB 1: HOMEPAGE & BRANDING -->
          <div class="pm-tab-pane" id="tab-pm-general" style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="form-grid-2">
              <div>
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                  Product Full Name *
                </label>
                <input type="text" id="editProdName" required class="form-input-text" placeholder="e.g. White Mist Ocean Fresh 2L Liquid Detergent" oninput="updateLivePreviewCard()">
              </div>
              <div>
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                  SKU Code *
                </label>
                <input type="text" id="editProdSku" required class="form-input-text" placeholder="e.g. WM-LD-2L-NEW">
              </div>
            </div>

            <div class="form-grid-2">
              <div>
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                  Storefront Category *
                </label>
                <select id="editProdCategory" class="form-select" style="background: #FFF;" onchange="updateLivePreviewCard()">
                  <!-- Dynamically populated -->
                </select>
              </div>
              <div>
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                  Homepage Card Badge
                </label>
                <select id="editProdBadge" class="form-select" style="background: #FFF;" onchange="updateLivePreviewCard()">
                  <option value="Bestseller">Bestseller</option>
                  <option value="Top Rated">Top Rated</option>
                  <option value="New Launch">New Launch</option>
                  <option value="Commercial Grade">Commercial Grade</option>
                  <option value="Gentle Care">Gentle Care</option>
                  <option value="Super Saver">Super Saver</option>
                  <option value="Eco Friendly">Eco Friendly</option>
                </select>
              </div>
            </div>

            <div>
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                Homepage Tagline / Highlight Subtitle *
              </label>
              <input type="text" id="editProdTagline" required class="form-input-text" placeholder="e.g. Deep Bio-Clean & 48-Hour Sea Breeze Scent Lock" oninput="updateLivePreviewCard()">
              <span style="font-size: 0.74rem; color: #64748B; margin-top: 3px; display: block;">
                This bold tagline is shown right below the product title on the homepage cards.
              </span>
            </div>

            <div class="form-grid-2">
              <div>
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                  Fragrance Profile
                </label>
                <input type="text" id="editProdFragrance" class="form-input-text" placeholder="e.g. Cool Ocean & Crisp Cotton" oninput="updateLivePreviewCard()">
              </div>
              <div>
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                  Machine Compatibility Pill
                </label>
                <select id="editProdMachineType" class="form-select" style="background: #FFF;" onchange="updateLivePreviewCard()">
                  <option value="Front & Top Load">Front & Top Load</option>
                  <option value="Front Load Special">Front Load Special</option>
                  <option value="Top Load & Bucket Wash">Top Load & Bucket Wash</option>
                  <option value="Delicates & Woollens">Delicates & Woollens</option>
                </select>
              </div>
            </div>

            <div>
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 6px;">
                Homepage Card Theme Color & Gradient
              </label>
              <div id="productColorPillsContainer" style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <button type="button" class="color-theme-pill active" data-color="#0084FF" onclick="setProductThemeColor('#0084FF', this)" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; border-radius: 999px; border: 2px solid #0084FF; background: rgba(0, 132, 255, 0.12); cursor: pointer; font-size: 0.8rem; font-weight: 600; color: #1E293B;">
                  <span style="width: 12px; height: 12px; border-radius: 50%; background: #0084FF;"></span>
                  <span>Ocean Blue</span>
                </button>
                <button type="button" class="color-theme-pill" data-color="#F01262" onclick="setProductThemeColor('#F01262', this)" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; border-radius: 999px; border: 1px solid #E2E8F0; background: #FFF; cursor: pointer; font-size: 0.8rem; font-weight: 600; color: #1E293B;">
                  <span style="width: 12px; height: 12px; border-radius: 50%; background: #F01262;"></span>
                  <span>Floral Pink</span>
                </button>
                <button type="button" class="color-theme-pill" data-color="#D97706" onclick="setProductThemeColor('#D97706', this)" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; border-radius: 999px; border: 1px solid #E2E8F0; background: #FFF; cursor: pointer; font-size: 0.8rem; font-weight: 600; color: #1E293B;">
                  <span style="width: 12px; height: 12px; border-radius: 50%; background: #D97706;"></span>
                  <span>Citrus Yellow</span>
                </button>
                <button type="button" class="color-theme-pill" data-color="#10B981" onclick="setProductThemeColor('#10B981', this)" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; border-radius: 999px; border: 1px solid #E2E8F0; background: #FFF; cursor: pointer; font-size: 0.8rem; font-weight: 600; color: #1E293B;">
                  <span style="width: 12px; height: 12px; border-radius: 50%; background: #10B981;"></span>
                  <span>Emerald Mint</span>
                </button>
                <button type="button" class="color-theme-pill" data-color="#8B5CF6" onclick="setProductThemeColor('#8B5CF6', this)" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; border-radius: 999px; border: 1px solid #E2E8F0; background: #FFF; cursor: pointer; font-size: 0.8rem; font-weight: 600; color: #1E293B;">
                  <span style="width: 12px; height: 12px; border-radius: 50%; background: #8B5CF6;"></span>
                  <span>Royal Violet</span>
                </button>
              </div>
            </div>

            <div style="display: flex; gap: 1.5rem; margin-top: 0.5rem; padding: 0.85rem 1rem; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: #1E293B; cursor: pointer;">
                <input type="checkbox" id="editProdIsFeatured" checked style="width: 17px; height: 17px; accent-color: #0284C7;">
                <span>Feature in Homepage Showcase</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: #1E293B; cursor: pointer;">
                <input type="checkbox" id="editProdIsActive" checked style="width: 17px; height: 17px; accent-color: #0284C7;">
                <span>Publish Active in Storefront</span>
              </label>
            </div>
          </div>

          <!-- TAB 2: PRODUCT IMAGES & MEDIA -->
          <div class="pm-tab-pane" id="tab-pm-images" style="display: none; flex-direction: column; gap: 1.25rem;">
            <!-- Upload Box -->
            <div style="border: 2px dashed #CBD5E1; border-radius: 12px; padding: 1.5rem; text-align: center; background: #F8FAFC; cursor: pointer;" onclick="document.getElementById('editProdImageFileInput').click()">
              <input type="file" id="editProdImageFileInput" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display: none;" onchange="handleProductImageUpload(event)">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #E0F2FE; color: #0284C7; display: flex; align-items: center; justify-content: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <strong style="font-size: 0.95rem; color: #0F172A;">Click to Upload Product Image from Device</strong>
                <span style="font-size: 0.78rem; color: #64748B;">Supports transparent bottle photos, PNG, JPG, WEBP, SVG (Max 10MB)</span>
              </div>
            </div>

            <!-- Image Asset Path / URL -->
            <div>
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                Image Asset URL / Path
              </label>
              <input type="text" id="editProdImage" class="form-input-text" value="/assets/images/bottle_blue.png" oninput="updateProductImageFromInput(this.value)">
            </div>

            <!-- Verified Brand Presets -->
            <div>
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 6px;">
                Or Choose from Verified White Mist Brand Bottles & Pouches:
              </label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)) ; gap: 0.75rem;">
                <div onclick="selectProductPresetImage('/assets/images/bottle_blue.png')" style="padding: 0.65rem 0.5rem; border: 1px solid #E2E8F0; border-radius: 8px; background: #FFF; text-align: center; cursor: pointer; transition: all 0.15s ease;">
                  <img src="/assets/images/bottle_blue.png" alt="Ocean Blue Bottle" style="height: 55px; object-fit: contain;">
                  <div style="font-size: 0.72rem; font-weight: 600; color: #334155; margin-top: 0.35rem;">Ocean Blue Bottle</div>
                </div>
                <div onclick="selectProductPresetImage('/assets/images/bottle_pink.png')" style="padding: 0.65rem 0.5rem; border: 1px solid #E2E8F0; border-radius: 8px; background: #FFF; text-align: center; cursor: pointer; transition: all 0.15s ease;">
                  <img src="/assets/images/bottle_pink.png" alt="Floral Pink Bottle" style="height: 55px; object-fit: contain;">
                  <div style="font-size: 0.72rem; font-weight: 600; color: #334155; margin-top: 0.35rem;">Floral Pink Bottle</div>
                </div>
                <div onclick="selectProductPresetImage('/assets/images/bottle_yellow.png')" style="padding: 0.65rem 0.5rem; border: 1px solid #E2E8F0; border-radius: 8px; background: #FFF; text-align: center; cursor: pointer; transition: all 0.15s ease;">
                  <img src="/assets/images/bottle_yellow.png" alt="Citrus Yellow Bottle" style="height: 55px; object-fit: contain;">
                  <div style="font-size: 0.72rem; font-weight: 600; color: #334155; margin-top: 0.35rem;">Citrus Yellow Bottle</div>
                </div>
                <div onclick="selectProductPresetImage('/assets/images/pouch_blue.png')" style="padding: 0.65rem 0.5rem; border: 1px solid #E2E8F0; border-radius: 8px; background: #FFF; text-align: center; cursor: pointer; transition: all 0.15s ease;">
                  <img src="/assets/images/pouch_blue.png" alt="Ocean Blue Pouch" style="height: 55px; object-fit: contain;">
                  <div style="font-size: 0.72rem; font-weight: 600; color: #334155; margin-top: 0.35rem;">Ocean Blue Pouch</div>
                </div>
                <div onclick="selectProductPresetImage('/assets/images/pouch_pink.png')" style="padding: 0.65rem 0.5rem; border: 1px solid #E2E8F0; border-radius: 8px; background: #FFF; text-align: center; cursor: pointer; transition: all 0.15s ease;">
                  <img src="/assets/images/pouch_pink.png" alt="Floral Pink Pouch" style="height: 55px; object-fit: contain;">
                  <div style="font-size: 0.72rem; font-weight: 600; color: #334155; margin-top: 0.35rem;">Floral Pink Pouch</div>
                </div>
                <div onclick="selectProductPresetImage('/assets/images/pouch_yellow.png')" style="padding: 0.65rem 0.5rem; border: 1px solid #E2E8F0; border-radius: 8px; background: #FFF; text-align: center; cursor: pointer; transition: all 0.15s ease;">
                  <img src="/assets/images/pouch_yellow.png" alt="Citrus Yellow Pouch" style="height: 55px; object-fit: contain;">
                  <div style="font-size: 0.72rem; font-weight: 600; color: #334155; margin-top: 0.35rem;">Citrus Yellow Pouch</div>
                </div>
              </div>
            </div>

            <!-- Live Image Showcase Preview -->
            <div style="display: flex; align-items: center; gap: 1.25rem; padding: 1rem; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
              <div id="imageStageWrapper" style="width: 100px; height: 110px; background: linear-gradient(135deg, rgba(0, 132, 255, 0.18) 0%, #FFFFFF 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #E2E8F0;">
                <img id="editProdImagePreview" src="/assets/images/bottle_blue.png" alt="Product Preview" style="max-height: 90px; max-width: 85px; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.15));" onerror="this.src='/assets/images/bottle_blue.png'">
              </div>
              <div>
                <h4 style="font-size: 0.9rem; font-weight: 700; color: #0F172A; margin: 0 0 0.25rem 0;">Live Image Showcase Preview</h4>
                <p style="font-size: 0.78rem; color: #64748B; margin: 0;">Rendered on responsive card canvas with theme drop-shadow and gradient backdrop.</p>
              </div>
            </div>
          </div>

          <!-- TAB 3: PACK SIZES & PRICING -->
          <div class="pm-tab-pane" id="tab-pm-pricing" style="display: none; flex-direction: column; gap: 1.25rem;">
            <!-- Primary Variant Box -->
            <div style="padding: 1.15rem; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
              <span style="font-size: 0.8rem; font-weight: 800; color: #0284C7; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.75rem;">
                Primary Variant: 2L Ergonomic Handle Bottle
              </span>
              <div class="form-grid-2" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
                <div>
                  <label class="form-label" style="font-size: 0.78rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                    Selling Price (₹) *
                  </label>
                  <input type="number" id="editProdPrice" required min="1" value="349" class="form-input-text" oninput="calculateProductDiscount(); updateLivePreviewCard();">
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.78rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                    MRP (₹) *
                  </label>
                  <input type="number" id="editProdMrp" required min="1" value="449" class="form-input-text" oninput="calculateProductDiscount(); updateLivePreviewCard();">
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.78rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                    Initial Stock Inventory (Units) *
                  </label>
                  <input type="number" id="editProdStockQty" required min="0" value="250" class="form-input-text">
                </div>
              </div>
              <div id="productDiscountBadge" style="margin-top: 0.75rem; font-size: 0.8rem; color: #166534; font-weight: 700;">
                Customer Discount: 22% OFF
              </div>
            </div>

            <!-- Secondary Variant Box -->
            <div style="padding: 1.15rem; background: #FFFFFF; border-radius: 10px; border: 1px solid #E2E8F0;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #0F172A; cursor: pointer; margin-bottom: 0.5rem;">
                <input type="checkbox" id="editProdHasPouch" onchange="togglePouchFields(this.checked)" style="width: 17px; height: 17px; accent-color: #0284C7;">
                <span>Include Secondary Refill Variant (e.g. 2kg Eco Spout Refill Pouch)</span>
              </label>

              <div id="pouchVariantFields" style="display: none; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; padding-top: 0.75rem; border-top: 1px solid #E2E8F0;">
                <div>
                  <label class="form-label" style="font-size: 0.78rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                    Refill Pouch Selling Price (₹)
                  </label>
                  <input type="number" id="editProdPouchPrice" value="299" class="form-input-text">
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.78rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                    Refill Pouch MRP (₹)
                  </label>
                  <input type="number" id="editProdPouchMrp" value="399" class="form-input-text">
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.78rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                    Pouch Image Asset
                  </label>
                  <input type="text" id="editProdPouchImage" value="/assets/images/pouch_blue.png" class="form-input-text">
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 4: DESCRIPTION & FEATURES -->
          <div class="pm-tab-pane" id="tab-pm-details" style="display: none; flex-direction: column; gap: 1rem;">
            <div>
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                Product Description (Homepage Quick View & Details)
              </label>
              <textarea id="editProdShortDesc" rows="3" class="form-textarea" placeholder="Comprehensive description of bio-active stain lifting action..." style="font-family: inherit;"></textarea>
            </div>

            <div>
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
                Key Highlights / Bullet Features (One feature per line)
              </label>
              <textarea id="editProdFeatures" rows="4" class="form-textarea" placeholder="10x Bio-Enzyme Stain Action&#10;Front Load & Top Load Safe&#10;48-Hour Fragrance Lock&#10;Color Guard Technology" style="font-family: inherit;"></textarea>
              <span style="font-size: 0.74rem; color: #64748B; margin-top: 3px; display: block;">
                These highlights appear in the interactive Quick View drawer and product specification sheets.
              </span>
            </div>
          </div>

          <!-- TAB 5: LIVE HOMEPAGE CARD PREVIEW -->
          <div class="pm-tab-pane" id="tab-pm-preview" style="display: none; justify-content: center; padding: 1rem;">
            <div style="width: 100%; maxWidth: 360px; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; padding: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); display: flex; flex-direction: column;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
                <span id="previewCardBadge" class="badge badge-primary" style="font-size: 0.72rem; padding: 0.25rem 0.65rem; border-radius: 999px;">Bestseller</span>
                <span id="previewCardCategory" style="font-size: 0.75rem; color: #64748B; font-weight: 600;">Daily Wash Liquid</span>
              </div>
              <div id="previewCardStage" style="width: 100%; height: 180px; border-radius: 12px; background: linear-gradient(135deg, rgba(0, 132, 255, 0.15) 0%, #FFFFFF 100%); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; border: 1px solid #E2E8F0;">
                <img id="previewCardImg" src="/assets/images/bottle_blue.png" alt="Preview Product" style="max-height: 150px; object-fit: contain; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2));">
              </div>
              <h3 id="previewCardTitle" style="font-size: 1.05rem; font-weight: 800; color: #0F172A; margin: 0 0 0.35rem 0; line-height: 1.3;">White Mist Ocean Fresh</h3>
              <p id="previewCardTagline" style="font-size: 0.78rem; color: #475569; margin: 0 0 0.85rem 0; line-height: 1.4;">Deep Bio-Clean & 48-Hour Sea Breeze Scent Lock</p>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px solid #F1F5F9;">
                <div>
                  <span style="font-size: 0.72rem; color: #64748B; display: block;">Selling Price</span>
                  <div style="display: flex; align-items: baseline; gap: 0.35rem;">
                    <strong id="previewCardPrice" style="font-size: 1.25rem; font-weight: 900; color: #0284C7;">₹349</strong>
                    <span id="previewCardMrp" style="font-size: 0.82rem; color: #94A3B8; text-decoration: line-through;">₹449</span>
                  </div>
                </div>
                <button type="button" style="background: #0284C7; color: #FFF; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; pointer-events: none;">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="modal-footer" style="padding: 1rem 1.5rem; background: #F8FAFC; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; margin: 0;">
          <button type="button" class="btn-action-public" onclick="closeProductModal()">
            Cancel
          </button>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button type="button" id="btnNextProductTab" onclick="nextProductModalTab()" style="background: #FFFFFF; color: #0284C7; border: 1px solid #BAE6FD; padding: 0.55rem 1rem; border-radius: 8px; font-size: 0.84rem; font-weight: 600; cursor: pointer;">
              Next Step →
            </button>
            <button type="submit" id="btnSubmitProductForm" style="background: #0284C7; color: #FFFFFF; border: none; padding: 0.55rem 1.35rem; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25); display: inline-flex; align-items: center; gap: 0.45rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Publish Product to Store & Homepage</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- ORDER DETAIL MODAL -->`;

if (oldProductModalRegex.test(content)) {
  content = content.replace(oldProductModalRegex, newProductModalHtml);
  console.log('✓ Successfully replaced #productModal with modern 5-tab SKU & Showcase modal');
} else {
  console.log('⚠ Could not find oldProductModalRegex match');
}

fs.writeFileSync(adminHtmlPath, content, 'utf8');
console.log('Saved admin.html (Stage 2). Length:', content.length);

