import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Receipt, 
  Search, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Printer, 
  Download, 
  ShoppingBag,
  CreditCard,
  Truck,
  ExternalLink
} from 'lucide-react';
import InvoiceModal from './InvoiceModal';

export default function CustomerOrdersModal({ isOpen, onClose, onBrowseProducts }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filterEmail, setFilterEmail] = useState(() => {
    return localStorage.getItem('wm_customer_email') || '';
  });

  const fetchCustomerOrders = async (email = '') => {
    setLoading(true);
    try {
      const q = email ? `?email=${encodeURIComponent(email)}` : '';
      const res = await fetch(`/api/customer/orders${q}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch customer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCustomerOrders(filterEmail);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredOrders = orders.filter(order => {
    const s = searchQuery.toLowerCase().trim();
    if (!s) return true;
    return (
      (order.id && order.id.toLowerCase().includes(s)) ||
      (order.customerName && order.customerName.toLowerCase().includes(s)) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(s)) ||
      (order.invoiceNumber && order.invoiceNumber.toLowerCase().includes(s)) ||
      (order.items && order.items.some(i => i.name && i.name.toLowerCase().includes(s)))
    );
  });

  const handleOpenInvoice = (order) => {
    if (order.invoice) {
      setSelectedInvoice(order.invoice);
    } else if (order.paymentStatus === 'PAID') {
      // Synthesize invoice view if not directly loaded
      setSelectedInvoice({
        invoiceNumber: order.invoiceNumber || `WM-INV-2026-${order.id.replace('WM-ORD-', '')}`,
        orderId: order.id,
        invoiceDate: order.invoiceDate || order.createdAt,
        paymentDate: order.createdAt,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        billingAddress: order.shippingAddress,
        items: order.items,
        subtotal: order.subtotal || +(order.total / 1.18).toFixed(2),
        cgst: order.cgst || +(order.tax / 2).toFixed(2),
        sgst: order.sgst || +(order.tax / 2).toFixed(2),
        shippingCharges: order.shippingFee || 0,
        discount: order.discount || 0,
        grandTotal: order.total,
        amountPaid: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus || 'PAID',
        transactionId: order.transactionId || `TXN-WM-${Math.floor(100000 + Math.random() * 900000)}`
      });
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}>
          {/* Modal Header */}
          <div style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB'
              }}>
                <Receipt size={22} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1E293B' }}>
                  My Orders & Bills
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
                  View placed orders, verify payments, and download official tax invoices.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px'
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Search & Lookup Toolbar */}
          <div style={{
            padding: '1rem 1.75rem',
            borderBottom: '1px solid #F1F5F9',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              flex: '1',
              minWidth: '240px'
            }}>
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search by Order ID (e.g. WM-ORD-8921) or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  fontSize: '0.85rem',
                  width: '100%',
                  color: '#1E293B'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Lookup by customer email..."
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
                style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '210px'
                }}
              />
              <button
                onClick={() => {
                  if (filterEmail) localStorage.setItem('wm_customer_email', filterEmail);
                  fetchCustomerOrders(filterEmail);
                }}
                style={{
                  backgroundColor: '#2563EB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Find Bills
              </button>
            </div>
          </div>

          {/* Orders Scrollable List */}
          <div style={{
            padding: '1.5rem 1.75rem',
            overflowY: 'auto',
            flex: '1',
            backgroundColor: '#F8FAFC'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                <Clock size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.75rem', color: '#2563EB' }} />
                <div>Loading your orders and verified invoices...</div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px dashed #CBD5E1'
              }}>
                <ShoppingBag size={48} color="#94A3B8" style={{ marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '1.15rem' }}>
                  No Orders Found
                </h3>
                <p style={{ margin: '0 0 1.25rem 0', color: '#64748B', fontSize: '0.88rem' }}>
                  You haven't placed any orders yet, or no orders match your search query.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    if (onBrowseProducts) onBrowseProducts();
                  }}
                  style={{
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.65rem 1.5rem',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Browse Detergents & Super Savers
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredOrders.map(order => {
                  const isPaid = order.paymentStatus === 'PAID';
                  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : order.date;

                  return (
                    <div key={order.id} style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '1.25rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      transition: 'border-color 0.2s'
                    }}>
                      {/* Order Card Top Bar */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        borderBottom: '1px solid #F1F5F9',
                        paddingBottom: '0.85rem',
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <strong style={{ fontSize: '1.05rem', color: '#2563EB', fontFamily: 'monospace' }}>
                              {order.id}
                            </strong>
                            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                              Placed on {dateStr}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>
                            Customer: <strong>{order.customerName}</strong> &bull; {order.customerEmail || order.customerPhone}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            backgroundColor: isPaid ? '#DCFCE7' : '#FEF3C7',
                            color: isPaid ? '#15803D' : '#92400E',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            {isPaid ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                            {order.paymentStatus || 'PAID'}
                          </span>

                          <span style={{
                            backgroundColor: '#F1F5F9',
                            color: '#334155',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {order.status || 'Confirmed'}
                          </span>
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                          Purchased Items:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: '#F8FAFC',
                              padding: '0.5rem 0.85rem',
                              borderRadius: '6px',
                              fontSize: '0.85rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package size={15} color="#2563EB" />
                                <span style={{ fontWeight: '600', color: '#1E293B' }}>{item.name}</span>
                                <span style={{ color: '#64748B', fontSize: '0.8rem' }}>&times; {item.qty}</span>
                              </div>
                              <span style={{ fontWeight: '700', color: '#1E293B' }}>
                                ₹{item.total || (item.price * item.qty)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financial Summary & Actions */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #F1F5F9',
                        paddingTop: '0.85rem',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}>
                        <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                          <div>Payment Method: <strong style={{ color: '#1E293B' }}>{order.paymentMethod || 'UPI'}</strong></div>
                          {order.invoiceNumber && (
                            <div style={{ marginTop: '0.15rem' }}>
                              Tax Invoice: <strong style={{ color: '#2563EB', fontFamily: 'monospace' }}>{order.invoiceNumber}</strong>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Total Paid</span>
                            <strong style={{ fontSize: '1.25rem', color: '#1E293B', fontWeight: '800' }}>
                              ₹{order.total}
                            </strong>
                          </div>

                          {isPaid ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => handleOpenInvoice(order)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  backgroundColor: '#2563EB',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '0.55rem 1rem',
                                  fontSize: '0.85rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s'
                                }}
                                title="View full professional tax invoice"
                              >
                                <FileText size={16} /> View Bill & PDF
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#D97706', fontStyle: 'italic' }}>
                              Invoice pending payment verification
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <InvoiceModal
          isOpen={Boolean(selectedInvoice)}
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
}

