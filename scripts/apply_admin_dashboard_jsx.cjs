const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'src', 'components', 'AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original AdminDashboard.jsx length:', content.length);

// 1. Add UserCheck to imports
if (!content.includes('UserCheck,')) {
  content = content.replace('import { \n  Receipt,', 'import { \n  UserCheck,\n  Receipt,');
  console.log('✓ Added UserCheck to imports');
}

// 2. Add customer logins state variables
const oldInvoicesState = `  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('all');`;

const newCustomerLoginsState = `  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('all');

  // Customer Login Activity State
  const [customerLoginsList, setCustomerLoginsList] = useState([]);
  const [customerLoginsTotal, setCustomerLoginsTotal] = useState(0);
  const [customerLoginsToday, setCustomerLoginsToday] = useState(0);
  const [customerLoginsSearch, setCustomerLoginsSearch] = useState('');
  const [customerLoginsStatus, setCustomerLoginsStatus] = useState('all');
  const [customerLoginsDate, setCustomerLoginsDate] = useState('');
  const [customerLoginsPage, setCustomerLoginsPage] = useState(1);
  const [customerLoginsTotalPages, setCustomerLoginsTotalPages] = useState(1);
  const [customerLoginsLoading, setCustomerLoginsLoading] = useState(false);`;

if (!content.includes('customerLoginsList') && content.includes(oldInvoicesState)) {
  content = content.replace(oldInvoicesState, newCustomerLoginsState);
  console.log('✓ Added customer logins state variables');
}

// 3. Add fetchCustomerLogins function
const oldFetchInvoices = `  const fetchInvoices = async () => {`;

const newFetchCustomerLogins = `  const fetchCustomerLogins = async (page = 1) => {
    try {
      setCustomerLoginsLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10
      });
      if (customerLoginsSearch) params.set('search', customerLoginsSearch);
      if (customerLoginsStatus && customerLoginsStatus !== 'all') params.set('status', customerLoginsStatus);
      if (customerLoginsDate) params.set('date', customerLoginsDate);

      const res = await fetch(\`/api/admin/customer-logins?\${params.toString()}\`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setCustomerLoginsList(data.records || []);
        setCustomerLoginsTotal(data.summary?.totalLogins ?? data.totalAll ?? data.total ?? (data.records || []).length);
        setCustomerLoginsToday(data.summary?.todayLogins ?? 0);
        setCustomerLoginsPage(data.page || 1);
        setCustomerLoginsTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error('Failed to fetch customer logins', e);
    } finally {
      setCustomerLoginsLoading(false);
    }
  };

  const fetchInvoices = async () => {`;

if (!content.includes('fetchCustomerLogins') && content.includes(oldFetchInvoices)) {
  content = content.replace(oldFetchInvoices, newFetchCustomerLogins);
  console.log('✓ Added fetchCustomerLogins function');
}

// 4. Call fetchCustomerLogins in useEffect
const oldEffectCall = `      fetchTransactions();
      fetchInvoices();`;

const newEffectCall = `      fetchTransactions();
      fetchInvoices();
      fetchCustomerLogins(1);`;

if (!content.includes('fetchCustomerLogins(1);') && content.includes(oldEffectCall)) {
  content = content.replace(oldEffectCall, newEffectCall);
  console.log('✓ Added fetchCustomerLogins to initial useEffect');
}

// 5. Update title map
const oldTitleMap = `    invoices: 'Invoice Management',`;
const newTitleMap = `    invoices: 'Invoice Management',
    'customer-logins': 'Customer Login Activity',`;

if (!content.includes("'customer-logins': 'Customer Login Activity'") && content.includes(oldTitleMap)) {
  content = content.replace(oldTitleMap, newTitleMap);
  console.log('✓ Added customer-logins to titleMap');
}

// 6. Add Customer Logins nav item to sidebar
const oldSidebarInvoices = `{ id: 'invoices', label: 'Invoices', icon: Receipt, badge: invoicesList.length },`;
const newSidebarCustomerLogins = `{ id: 'invoices', label: 'Invoices', icon: Receipt, badge: invoicesList.length },
            { id: 'customer-logins', label: 'Customer Logins', icon: UserCheck, badge: customerLoginsToday || customerLoginsList.length },`;

if (!content.includes("id: 'customer-logins'") && content.includes(oldSidebarInvoices)) {
  content = content.replace(oldSidebarInvoices, newSidebarCustomerLogins);
  console.log('✓ Added Customer Logins nav item to sidebar');
}

// 7. Add S.No (#) to Orders Table
const oldOrdersThead = `<tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>`;

const newOrdersThead = `<tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ width: '45px', textAlign: 'center', padding: '0.85rem 0.5rem' }}>#</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>`;

if (content.includes(oldOrdersThead)) {
  content = content.replace(oldOrdersThead, newOrdersThead);
}

const oldOrdersMap = `{ordersList.map(order => {
                      const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (order.date || '--');

                      return (
                        <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.85rem 1rem' }}>`;

const newOrdersMap = `{ordersList.map((order, orderIdx) => {
                      const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (order.date || '--');

                      return (
                        <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ textAlign: 'center', fontWeight: '700', color: '#94A3B8', width: '45px', padding: '0.85rem 0.5rem' }}>{orderIdx + 1}</td>
                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>`;

if (content.includes(oldOrdersMap)) {
  content = content.replace(oldOrdersMap, newOrdersMap);
  console.log('✓ Added S.No to Orders table');
}

// 8. Add S.No (#) to Transactions Table
const oldTxnThead = `<tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Txn ID</th>`;

const newTxnThead = `<tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ width: '45px', textAlign: 'center', padding: '0.85rem 0.5rem' }}>#</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Txn ID</th>`;

if (content.includes(oldTxnThead)) {
  content = content.replace(oldTxnThead, newTxnThead);
}

const oldTxnMap = `{filteredTransactions.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.85rem 1rem' }}>`;

const newTxnMap = `{filteredTransactions.map((t, txnIdx) => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ textAlign: 'center', fontWeight: '700', color: '#94A3B8', width: '45px', padding: '0.85rem 0.5rem' }}>{txnIdx + 1}</td>
                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>`;

if (content.includes(oldTxnMap)) {
  content = content.replace(oldTxnMap, newTxnMap);
  console.log('✓ Added S.No to Transactions table');
}

// 9. Add S.No (#) to Invoices Table
const oldInvoicesThead = `<tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Invoice Number</th>`;

const newInvoicesThead = `<tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ width: '45px', textAlign: 'center', padding: '0.85rem 0.5rem' }}>#</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Invoice Number</th>`;

if (content.includes(oldInvoicesThead)) {
  content = content.replace(oldInvoicesThead, newInvoicesThead);
}

const oldInvoicesMap = `{filteredInvoices.map(inv => (
                        <tr key={inv.invoiceNumber} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.85rem 1rem' }}>`;

const newInvoicesMap = `{filteredInvoices.map((inv, invIdx) => (
                        <tr key={inv.invoiceNumber} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ textAlign: 'center', fontWeight: '700', color: '#94A3B8', width: '45px', padding: '0.85rem 0.5rem' }}>{invIdx + 1}</td>
                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>`;

if (content.includes(oldInvoicesMap)) {
  content = content.replace(oldInvoicesMap, newInvoicesMap);
  console.log('✓ Added S.No to Invoices table');
}

// 10. Add Customer Login Activity Panel in activeTab switch
const invoicesTabEnd = `          {activeTab === 'invoices' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>`;

const customerLoginsViewJsx = `          {/* CUSTOMER LOGIN ACTIVITY VIEW */}
          {activeTab === 'customer-logins' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                    Customer Login Activity
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                    Monitor and manage customer sign-in history.
                  </p>
                </div>
                <button
                  onClick={() => fetchCustomerLogins(1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: '#334155',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                  }}
                >
                  <RefreshCw size={14} className={customerLoginsLoading ? 'spin' : ''} />
                  Refresh
                </button>
              </div>

              {/* 2 Compact Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Logins
                    </span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(2, 132, 199, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
                      <UserCheck size={18} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    {customerLoginsTotal}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>●</span> All-time customer sessions
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Today's Logins
                    </span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                      <Clock size={18} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#10B981', margin: 0 }}>
                    {customerLoginsToday}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>●</span> Active today (since 00:00)
                  </div>
                </div>
              </div>

              {/* Toolbar Search & Filter */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.85rem' }}>
                    <Search size={16} color="#64748B" />
                    <input
                      type="text"
                      placeholder="Search customer name or email..."
                      value={customerLoginsSearch}
                      onChange={(e) => setCustomerLoginsSearch(e.target.value)}
                      style={{ border: 'none', outline: 'none', fontSize: '0.85rem', width: '220px' }}
                    />
                  </div>
                  <select
                    value={customerLoginsStatus}
                    onChange={(e) => setCustomerLoginsStatus(e.target.value)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Logged In">Logged In</option>
                    <option value="Logged Out">Logged Out</option>
                  </select>
                  <input
                    type="date"
                    value={customerLoginsDate}
                    onChange={(e) => setCustomerLoginsDate(e.target.value)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  />
                  {(customerLoginsSearch || customerLoginsStatus !== 'all' || customerLoginsDate) && (
                    <button
                      onClick={() => {
                        setCustomerLoginsSearch('');
                        setCustomerLoginsStatus('all');
                        setCustomerLoginsDate('');
                        fetchCustomerLogins(1);
                      }}
                      style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.45rem 0.75rem', fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Showing {customerLoginsList.length} of {customerLoginsTotal} records
                </span>
              </div>

              {/* Login History Table */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflowX: 'auto', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                      <th style={{ width: '45px', textAlign: 'center', padding: '0.85rem 0.5rem' }}>#</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Email Address</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Login Date</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Login Time</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerLoginsList.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                              <UserCheck size={24} />
                            </div>
                            <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '0.95rem' }}>No customer login activity found</div>
                            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, maxWidth: '320px' }}>No customer sign-in records match the current filter criteria.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      customerLoginsList.map((item, idx) => {
                        const name = item.customerName || item.email?.split('@')[0] || 'Customer';
                        const initials = name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase() || 'CU';
                        const isLoggedIn = (item.status || '').toLowerCase() === 'logged in';

                        return (
                          <tr key={item.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ textAlign: 'center', fontWeight: '700', color: '#94A3B8', width: '45px', padding: '0.85rem 0.5rem' }}>
                              {(customerLoginsPage - 1) * 10 + idx + 1}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284C7, #0369A1)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
                                  {initials}
                                </div>
                                <strong style={{ color: '#0F172A', fontSize: '0.9rem' }}>{name}</strong>
                              </div>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                              {item.email}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#64748B' }}>
                              {item.loginDate || '—'}
                            </td>
                            <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#64748B' }}>
                              {item.loginTime || '—'}
                            </td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              {isLoggedIn ? (
                                <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.65rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                                  Logged In
                                </span>
                              ) : (
                                <span style={{ backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.65rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />
                                  Logged Out
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Page {customerLoginsPage} of {customerLoginsTotalPages}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    disabled={customerLoginsPage <= 1}
                    onClick={() => fetchCustomerLogins(customerLoginsPage - 1)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.82rem', cursor: customerLoginsPage <= 1 ? 'not-allowed' : 'pointer', opacity: customerLoginsPage <= 1 ? 0.5 : 1 }}
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={customerLoginsPage >= customerLoginsTotalPages}
                    onClick={() => fetchCustomerLogins(customerLoginsPage + 1)}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.82rem', cursor: customerLoginsPage >= customerLoginsTotalPages ? 'not-allowed' : 'pointer', opacity: customerLoginsPage >= customerLoginsTotalPages ? 0.5 : 1 }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>`;

if (!content.includes("activeTab === 'customer-logins'") && content.includes(invoicesTabEnd)) {
  content = content.replace(invoicesTabEnd, customerLoginsViewJsx);
  console.log('✓ Injected customer-logins view panel JSX into AdminDashboard.jsx');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Saved AdminDashboard.jsx. Final length:', content.length);

