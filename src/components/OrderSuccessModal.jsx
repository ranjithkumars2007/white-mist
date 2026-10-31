import React, { useEffect, useState } from 'react';
import { CheckCircle2, PackageCheck, Truck, Download, ShoppingBag, Calendar, FileText, Printer, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import InvoiceModal from './InvoiceModal';

export default function OrderSuccessModal({ orderDetails, onContinueShopping }) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!orderDetails) return null;

  useEffect(() => {
    // Fire festive celebration confetti!
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  }, []);

  const invNum = orderDetails.invoiceNumber || (orderDetails.invoice && orderDetails.invoice.invoiceNumber) || `WM-INV-2026-${(orderDetails.orderId || '8925').replace('WM-ORD-', '')}`;
  const invoiceData = orderDetails.invoice || {
    invoiceNumber: invNum,
    orderId: orderDetails.orderId,
    invoiceDate: new Date().toISOString(),
    paymentDate: new Date().toISOString(),
    customerName: orderDetails.customerName,
    customerEmail: orderDetails.customerEmail,
    customerPhone: orderDetails.phone,
    billingAddress: orderDetails.address,
    items: orderDetails.items,
    subtotal: +(orderDetails.total / 1.18).toFixed(2),
    taxableAmount: +(orderDetails.total / 1.18).toFixed(2),
    cgst: +((orderDetails.total - (orderDetails.total / 1.18)) / 2).toFixed(2),
    sgst: +((orderDetails.total - (orderDetails.total / 1.18)) / 2).toFixed(2),
    shippingCharges: 0,
    grandTotal: orderDetails.total,
    amountPaid: orderDetails.total,
    balanceDue: 0,
    paymentMethod: orderDetails.paymentMethod,
    paymentStatus: 'PAID',
    transactionId: orderDetails.transactionId || (orderDetails.transaction && orderDetails.transaction.id) || `TXN-WM-${Math.floor(100000 + Math.random() * 900000)}`
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '650px',
          width: '100%',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          position: 'relative',
          animation: 'bounceIn 0.4s ease'
        }}>
          
          {/* Celebration Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#DCFCE7',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <CheckCircle2 size={48} />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-purple-dark)', marginBottom: '0.4rem' }}>
            Payment Verified & Order Confirmed! 🎉
          </h2>

          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Thank you, <strong>{orderDetails.customerName}</strong>! Your payment was verified and official tax invoice generated.
          </p>

          {/* Order Details Badge Grid */}
          <div style={{
            background: '#FAFCFF',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            textAlign: 'left',
            marginBottom: '1.75rem',
            fontSize: '0.875rem'
          }}>
            <div className="order-success-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Order Reference ID</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--color-purple-primary)' }}>{orderDetails.orderId}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Official Tax Invoice</span>
                <strong style={{ fontSize: '0.95rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'monospace' }}>
                  <FileText size={15} /> {invNum}
                </strong>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Delivery Address:</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{orderDetails.address}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
              <span>Payment Method: <strong>{orderDetails.paymentMethod}</strong> (Status: <strong style={{ color: '#16A34A' }}>PAID</strong>)</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-purple-dark)' }}>Total Paid: ₹{orderDetails.total}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowInvoiceModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.85rem 1.6rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <FileText size={18} />
              <span>View & Download Tax Invoice</span>
            </button>

            <button 
              onClick={onContinueShopping}
              className="btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', background: '#3F1B85' }}
            >
              <ShoppingBag size={18} />
              <span>Continue Shopping</span>
            </button>
          </div>

        </div>
      </div>

      {showInvoiceModal && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          invoice={invoiceData}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </>
  );
}
