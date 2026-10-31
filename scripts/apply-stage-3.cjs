const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.join(__dirname, '..', 'admin.html');
let content = fs.readFileSync(adminHtmlPath, 'utf8');

// 1. UPDATE renderProductsTable TO ADD S.NO (#)
const oldRenderProductsTable = `      tbody.innerHTML = products.map(p => {
        const defaultSize = (p.sizes && p.sizes.find(s => s.isDefault)) || (p.sizes && p.sizes[0]) || { price: 0, mrp: 0 };
        return \`
          <tr>
            <td>
              <img src="\${p.image}" alt="\${p.name}" class="table-product-thumb" onerror="this.src='/assets/images/bottle_blue.png'">
            </td>`;

const newRenderProductsTable = `      tbody.innerHTML = products.map((p, idx) => {
        const defaultSize = (p.sizes && p.sizes.find(s => s.isDefault)) || (p.sizes && p.sizes[0]) || { price: 0, mrp: 0 };
        return \`
          <tr>
            <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${idx + 1}</td>
            <td>
              <img src="\${p.image}" alt="\${p.name}" class="table-product-thumb" onerror="this.src='/assets/images/bottle_blue.png'">
            </td>\`;`;

if (content.includes(oldRenderProductsTable)) {
  content = content.replace(oldRenderProductsTable, newRenderProductsTable);
  console.log('✓ Added S.No to renderProductsTable');
} else {
  console.log('⚠ Could not find oldRenderProductsTable');
}

// 2. UPDATE loadCategoriesData TO ADD S.NO (#)
const oldLoadCategoriesData = `        if (tbody) {
          tbody.innerHTML = allCategories.map((c, idx) => \`
            <tr>
              <td><strong style="color: var(--text-main);">\${c.name}</strong></td>`;

const newLoadCategoriesData = `        if (tbody) {
          tbody.innerHTML = allCategories.map((c, idx) => \`
            <tr>
              <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${idx + 1}</td>
              <td><strong style="color: var(--text-main);">\${c.name}</strong></td>\`;`;

if (content.includes(oldLoadCategoriesData)) {
  content = content.replace(oldLoadCategoriesData, newLoadCategoriesData);
  console.log('✓ Added S.No to loadCategoriesData');
} else {
  console.log('⚠ Could not find oldLoadCategoriesData');
}

// 3. UPDATE renderOrdersTable TO ADD S.NO (#) AND NOWRAP ON ORDER ID
const oldRenderOrdersTable = `      tbody.innerHTML = orders.map(o => {
        const orderDateStr = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (o.date || '--');
        const itemCount = (o.items || []).reduce((sum, it) => sum + (Number(it.qty || it.quantity) || 1), 0);
        const firstItemName = o.items && o.items[0] ? (o.items[0].name || '') : '';

        return \`
          <tr>
            <td>
              <a href="javascript:void(0)" onclick="openOrderModal('\${o.id}')" style="color: var(--color-primary); font-family: monospace; font-size: 0.92rem; font-weight: 800; text-decoration: underline;" title="View Order Details">
                \${o.id}
              </a>
            </td>
            <td style="white-space: nowrap; font-size: 0.82rem; color: var(--text-muted);">\${orderDateStr}</td>`;

const newRenderOrdersTable = `      tbody.innerHTML = orders.map((o, idx) => {
        const orderDateStr = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (o.date || '--');
        const itemCount = (o.items || []).reduce((sum, it) => sum + (Number(it.qty || it.quantity) || 1), 0);
        const firstItemName = o.items && o.items[0] ? (o.items[0].name || '') : '';

        return \`
          <tr>
            <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${idx + 1}</td>
            <td style="white-space: nowrap;">
              <a href="javascript:void(0)" onclick="openOrderModal('\${o.id}')" style="white-space: nowrap; color: var(--color-primary); font-family: monospace; font-size: 0.92rem; font-weight: 800; text-decoration: underline;" title="View Order Details">
                \${o.id}
              </a>
            </td>
            <td style="white-space: nowrap; font-size: 0.82rem; color: var(--text-muted);">\${orderDateStr}</td>\`;`;

if (content.includes(oldRenderOrdersTable)) {
  content = content.replace(oldRenderOrdersTable, newRenderOrdersTable);
  console.log('✓ Added S.No and nowrap to renderOrdersTable');
} else {
  console.log('⚠ Could not find oldRenderOrdersTable');
}

// 4. UPDATE renderTransactionsTable TO ADD S.NO (#) AND NOWRAP ON TXN ID & ORDER ID
const oldRenderTransactionsTable = `      tbody.innerHTML = txns.map(t => {
        const st = (t.paymentStatus || 'SUCCESS').toUpperCase();
        let statusBadge = '<span class="badge badge-success">SUCCESS</span>';
        if (st === 'PENDING') statusBadge = '<span class="badge badge-warning">PENDING</span>';
        if (st === 'FAILED') statusBadge = '<span class="badge badge-danger">FAILED</span>';
        if (st === 'REFUNDED') statusBadge = '<span class="badge" style="background: #F3E8FF; color: #7E22CE; border: 1px solid #D8B4FE;">REFUNDED</span>';

        const d = t.transactionDate || t.createdAt ? new Date(t.transactionDate || t.createdAt) : new Date();
        const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        return \`
          <tr>
            <td>
              <strong style="color: var(--color-cyan); font-family: monospace; font-size: 0.88rem; cursor: pointer; text-decoration: underline;" onclick="openTransactionModal('\${t.id}')" title="Click to view transaction details">\${t.id}</strong>
            </td>
            <td>
              <span style="font-family: monospace; font-size: 0.85rem; color: var(--text-main); font-weight: 600;">\${t.orderId}</span>
            </td>`;

const newRenderTransactionsTable = `      tbody.innerHTML = txns.map((t, idx) => {
        const st = (t.paymentStatus || 'SUCCESS').toUpperCase();
        let statusBadge = '<span class="badge badge-success">SUCCESS</span>';
        if (st === 'PENDING') statusBadge = '<span class="badge badge-warning">PENDING</span>';
        if (st === 'FAILED') statusBadge = '<span class="badge badge-danger">FAILED</span>';
        if (st === 'REFUNDED') statusBadge = '<span class="badge" style="background: #F3E8FF; color: #7E22CE; border: 1px solid #D8B4FE;">REFUNDED</span>';

        const d = t.transactionDate || t.createdAt ? new Date(t.transactionDate || t.createdAt) : new Date();
        const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        return \`
          <tr>
            <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${idx + 1}</td>
            <td style="white-space: nowrap;">
              <strong style="white-space: nowrap; color: var(--color-cyan); font-family: monospace; font-size: 0.88rem; cursor: pointer; text-decoration: underline;" onclick="openTransactionModal('\${t.id}')" title="Click to view transaction details">\${t.id}</strong>
            </td>
            <td style="white-space: nowrap;">
              <span style="white-space: nowrap; font-family: monospace; font-size: 0.85rem; color: var(--text-main); font-weight: 600;">\${t.orderId}</span>
            </td>\`;`;

if (content.includes(oldRenderTransactionsTable)) {
  content = content.replace(oldRenderTransactionsTable, newRenderTransactionsTable);
  console.log('✓ Added S.No and nowrap to renderTransactionsTable');
} else {
  console.log('⚠ Could not find oldRenderTransactionsTable');
}

// 5. UPDATE renderInvoicesTable TO ADD S.NO (#) AND NOWRAP ON INVOICE # & ORDER ID
const oldRenderInvoicesTable = `      tbody.innerHTML = invs.map(i => {
        const dateStr = i.invoiceDate ? new Date(i.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '28 Oct 2026';
        return \`
          <tr>
            <td>
              <strong style="color: var(--color-primary); font-family: monospace; font-size: 0.92rem;">\${i.invoiceNumber}</strong>
            </td>
            <td>
              <span style="font-family: monospace; font-size: 0.85rem; color: var(--text-main); font-weight: 600;">\${i.orderId}</span>
            </td>`;

const newRenderInvoicesTable = `      tbody.innerHTML = invs.map((i, idx) => {
        const dateStr = i.invoiceDate ? new Date(i.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '28 Oct 2026';
        return \`
          <tr>
            <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${idx + 1}</td>
            <td style="white-space: nowrap;">
              <strong style="white-space: nowrap; color: var(--color-primary); font-family: monospace; font-size: 0.92rem;">\${i.invoiceNumber}</strong>
            </td>
            <td style="white-space: nowrap;">
              <span style="white-space: nowrap; font-family: monospace; font-size: 0.85rem; color: var(--text-main); font-weight: 600;">\${i.orderId}</span>
            </td>\`;`;

if (content.includes(oldRenderInvoicesTable)) {
  content = content.replace(oldRenderInvoicesTable, newRenderInvoicesTable);
  console.log('✓ Added S.No and nowrap to renderInvoicesTable');
} else {
  console.log('⚠ Could not find oldRenderInvoicesTable');
}

// 6. UPDATE renderMessagesTable TO ADD S.NO (#)
const oldRenderMessagesTable = `      tbody.innerHTML = msgs.map(m => \`
        <tr>
          <td style="font-size: 0.78rem; color: var(--text-muted); white-space: nowrap;">\${new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>`;

const newRenderMessagesTable = `      tbody.innerHTML = msgs.map((m, idx) => \`
        <tr>
          <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${idx + 1}</td>
          <td style="font-size: 0.78rem; color: var(--text-muted); white-space: nowrap;">\${new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>\`;`;

if (content.includes(oldRenderMessagesTable)) {
  content = content.replace(oldRenderMessagesTable, newRenderMessagesTable);
  console.log('✓ Added S.No to renderMessagesTable');
} else {
  console.log('⚠ Could not find oldRenderMessagesTable');
}

// 7. UPDATE loadSettingsData TO CALL loadAdminUsers AND ADD S.NO TO AUDIT LOGS
const oldAuditLogsMap = `        document.getElementById('fullAuditLogsTbody').innerHTML = logs.map(l => \`
          <tr>
            <td style="font-size: 0.78rem; color: var(--text-dim); white-space: nowrap;">\${new Date(l.timestamp).toLocaleString()}</td>`;

const newAuditLogsMap = `        loadAdminUsers();
        document.getElementById('fullAuditLogsTbody').innerHTML = logs.map((l, idx) => \`
          <tr>
            <td style="text-align: center; font-weight: 700; color: var(--text-dim); width: 45px;">\${idx + 1}</td>
            <td style="font-size: 0.78rem; color: var(--text-dim); white-space: nowrap;">\${new Date(l.timestamp).toLocaleString()}</td>\`;`;

if (content.includes(oldAuditLogsMap)) {
  content = content.replace(oldAuditLogsMap, newAuditLogsMap);
  console.log('✓ Updated loadSettingsData to loadAdminUsers & S.No on audit logs');
} else {
  console.log('⚠ Could not find oldAuditLogsMap');
}

fs.writeFileSync(adminHtmlPath, content, 'utf8');
console.log('Saved admin.html (Stage 3). Length:', content.length);

