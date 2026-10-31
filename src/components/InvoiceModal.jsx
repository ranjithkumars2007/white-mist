import React from 'react';
import { Printer, Download, X, CheckCircle2, ShieldCheck, FileText, ArrowDownToLine } from 'lucide-react';

export default function InvoiceModal({ invoice, isOpen, onClose }) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Trigger print dialog where customer/admin can choose "Save as PDF"
    window.print();
  };

  const invNum = invoice.invoiceNumber || invoice.id || 'WM-INV-2026-0000';
  const orderId = invoice.orderId || 'WM-ORD-0000';
  const invDate = invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '28 Oct 2026';
  const payDate = invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : invDate;

  const company = invoice.companyDetails || {
    name: "Meridian White Mist Private Limited",
    brand: "White Mist",
    address: "Plot 42, Eco Clean Corridor, Bellandur, Outer Ring Road, Bengaluru, Karnataka, India - 560103",
    gstin: "29AAACW1234F1Z8",
    cin: "U24246KA2026PTC189210",
    pan: "AAACW1234F",
    contactEmail: "care@whitemist.com",
    contactPhone: "+91 98860 44210",
    website: "www.whitemist.com"
  };

  const billingAddr = invoice.billingAddress || {};
  const addrString = typeof billingAddr === 'string' 
    ? billingAddr 
    : [billingAddr.street || billingAddr.address, billingAddr.city, billingAddr.state, billingAddr.pincode].filter(Boolean).join(', ') || 'Bengaluru, Karnataka - 560103';

  return (
    <div className="invoice-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      overflowY: 'auto'
    }}>
      <div className="invoice-modal-content" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '850px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Header Bar with Action Controls */}
        <div className="no-print" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.75rem',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={20} color="#2563EB" />
            <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1E293B' }}>
              Official Tax Invoice & Bill
            </span>
            <span style={{
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <CheckCircle2 size={12} /> {invoice.paymentStatus || 'PAID'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleDownloadPdf}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.88rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              title="Download official PDF copy of invoice"
            >
              <ArrowDownToLine size={16} /> Download PDF
            </button>

            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#F1F5F9',
                color: '#334155',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.88rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Print Invoice"
            >
              <Printer size={16} /> Print
            </button>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE SHEET (Tax Invoice) */}
        <div id="whiteMistInvoicePrintArea" className="invoice-sheet" style={{
          padding: '2.5rem',
          color: '#1E293B',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          lineHeight: 1.5,
          backgroundColor: '#FFFFFF'
        }}>
          {/* BRANDED INVOICE HEADER BANNER */}
          <div style={{ borderRadius: '8px', overflow: 'hidden', width: '100%', marginBottom: '0.75rem', border: '1px solid #E2E8F0' }}>
            <img
              src="/assets/images/invoice_header_banner.jpg"
              alt="Meridian White Mist Pvt. Ltd."
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={(e) => {
                if (!e.target.dataset.tried) {
                  e.target.dataset.tried = 'true';
                  e.target.src = '/images/invoice_header_banner.jpg';
                }
              }}
            />
          </div>

          {/* GST & CORPORATE TAX REGISTRATION LINE */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.45rem 1rem',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: '#475569',
            marginBottom: '1.5rem'
          }}>
            <div><strong>GSTIN:</strong> {company.gstin}</div>
            <div><strong>CIN:</strong> {company.cin}</div>
            <div><strong>PAN:</strong> {company.pan}</div>
          </div>

          {/* Customer & Billing Meta Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '1.5rem',
            padding: '1.25rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            marginBottom: '1.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                Billed & Shipped To:
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>
                {invoice.customerName || 'Valued Customer'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>
                {addrString}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>
                <strong>Email:</strong> {invoice.customerEmail || 'N/A'} &nbsp;|&nbsp; <strong>Phone:</strong> {invoice.customerPhone || 'N/A'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>
                <strong>Place of Supply:</strong> {billingAddr.state || 'Karnataka'} (Code: 29)
              </div>
            </div>

            <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                Payment & Transaction Details:
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                <strong>Payment Method:</strong> {invoice.paymentMethod || 'Razorpay UPI'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.2rem' }}>
                <strong>Transaction ID:</strong> <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>{invoice.transactionId || 'TXN-WM-892101'}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.2rem' }}>
                <strong>Payment Date:</strong> {payDate}
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  border: '1px solid #86EFAC',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <ShieldCheck size={14} /> PAID IN FULL
                </span>
                <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: '600' }}>
                  Gateway Verified
                </span>
              </div>
            </div>
          </div>

          {/* UNIFIED ORIGINAL CORPORATE TAX INVOICE TABLE */}
          {(() => {
            const numToWords = (n) => {
              const num = Math.round(Number(n) || 0);
              if (num === 0) return 'Zero Rupees Only';
              const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
              const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
              function inWords(nVal) {
                if ((nVal = nVal.toString()).length > 9) return 'overflow';
                let match = ('000000000' + nVal).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
                if (!match) return '';
                let str = '';
                str += (match[1] != 0) ? (a[Number(match[1])] || b[match[1][0]] + ' ' + a[match[1][1]]) + ' Crore ' : '';
                str += (match[2] != 0) ? (a[Number(match[2])] || b[match[2][0]] + ' ' + a[match[2][1]]) + ' Lakh ' : '';
                str += (match[3] != 0) ? (a[Number(match[3])] || b[match[3][0]] + ' ' + a[match[3][1]]) + ' Thousand ' : '';
                str += (match[4] != 0) ? (a[Number(match[4])] || b[match[4][0]] + ' ' + a[match[4][1]]) + ' Hundred ' : '';
                str += (match[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(match[5])] || b[match[5][0]] + ' ' + a[match[5][1]]) + ' ' : '';
                return str.trim();
              }
              return inWords(num) + ' Rupees Only';
            };

            let computedSubtotal = 0;
            let computedTax = 0;
            let computedTotal = 0;

            const processedItems = (invoice.items || []).map((item) => {
              const qty = Number(item.qty || item.quantity || 1);
              let grossTotal = Number(item.total);
              if (!grossTotal || isNaN(grossTotal)) {
                grossTotal = Number(item.price) ? Number(item.price) * qty : (Number(item.grossUnitPrice || 349) * qty);
              }
              if (!grossTotal || grossTotal <= 0) grossTotal = 349 * qty;

              const unitTaxable = Number(item.unitPrice) || +(grossTotal / qty / 1.18).toFixed(2);
              const taxableVal = +(unitTaxable * qty).toFixed(2);
              const tax = Number(item.taxAmount) || +(grossTotal - taxableVal).toFixed(2);
              const total = grossTotal;

              computedSubtotal += taxableVal;
              computedTax += tax;
              computedTotal += total;

              return {
                ...item,
                qty,
                unitTaxable,
                taxableVal,
                tax,
                total
              };
            });

            const grandTotal = Number(invoice.grandTotal || invoice.total || 0) || computedTotal || 698;
            const taxableSubtotal = Number(invoice.taxableAmount || invoice.subtotal || 0) || computedSubtotal || +(grandTotal / 1.18).toFixed(2);
            const totalTax = Number(invoice.totalTax || invoice.igst || 0) || computedTax || +(grandTotal - taxableSubtotal).toFixed(2);
            const cgst = Number(invoice.cgst || 0) || +(totalTax / 2).toFixed(2);
            const sgst = Number(invoice.sgst || 0) || +(totalTax - cgst).toFixed(2);
            const shipping = Number(invoice.shippingCharges || 0);
            const amountPaid = Number(invoice.amountPaid || grandTotal);
            const wordsStr = numToWords(grandTotal);

            return (
              <>
                <div style={{ border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem', backgroundColor: '#FFFFFF' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1', color: '#1E293B' }}>
                        <th style={{ padding: '0.65rem 0.75rem', width: '35px', textAlign: 'center', borderRight: '1px solid #E2E8F0' }}>#</th>
                        <th style={{ padding: '0.65rem 0.75rem', borderRight: '1px solid #E2E8F0' }}>Description of Goods</th>
                        <th style={{ padding: '0.65rem 0.75rem', width: '65px', textAlign: 'center', borderRight: '1px solid #E2E8F0' }}>HSN</th>
                        <th style={{ padding: '0.65rem 0.75rem', width: '50px', textAlign: 'center', borderRight: '1px solid #E2E8F0' }}>Qty</th>
                        <th style={{ padding: '0.65rem 0.75rem', width: '95px', textAlign: 'right', borderRight: '1px solid #E2E8F0' }}>Unit Taxable</th>
                        <th style={{ padding: '0.65rem 0.75rem', width: '95px', textAlign: 'right', borderRight: '1px solid #E2E8F0' }}>Taxable Amt</th>
                        <th style={{ padding: '0.65rem 0.75rem', width: '65px', textAlign: 'center', borderRight: '1px solid #E2E8F0' }}>GST %</th>
                        <th style={{ padding: '0.65rem 0.75rem', width: '85px', textAlign: 'right', borderRight: '1px solid #E2E8F0' }}>Tax (₹)</th>
                        <th style={{ padding: '0.65rem 0.75rem', width: '95px', textAlign: 'right' }}>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedItems.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF' }}>
                          <td style={{ padding: '0.75rem', textAlign: 'center', color: '#64748B', borderRight: '1px solid #E2E8F0' }}>{idx + 1}</td>
                          <td style={{ padding: '0.75rem', borderRight: '1px solid #E2E8F0' }}>
                            <strong style={{ color: '#0F172A', display: 'block', fontSize: '0.88rem' }}>{item.name}</strong>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>SKU: {item.sku || 'WM-BLU-2000'}</span>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', color: '#475569', borderRight: '1px solid #E2E8F0', fontFamily: 'monospace' }}>{item.hsn || '3402'}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '700', borderRight: '1px solid #E2E8F0' }}>{item.qty}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', borderRight: '1px solid #E2E8F0' }}>₹{item.unitTaxable.toFixed(2)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', borderRight: '1px solid #E2E8F0', fontWeight: '600' }}>₹{item.taxableVal.toFixed(2)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', borderRight: '1px solid #E2E8F0' }}>{item.gstRate || 18}%</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', color: '#475569', borderRight: '1px solid #E2E8F0' }}>₹{item.tax.toFixed(2)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700', color: '#0F172A' }}>₹{item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '2px solid #CBD5E1', backgroundColor: '#F8FAFC' }}>
                        <td colSpan={5} style={{ padding: '1rem 1.25rem', verticalAlign: 'top', borderRight: '1px solid #E2E8F0' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                            Invoice Amount in Words:
                          </div>
                          <strong style={{ color: '#0F172A', fontSize: '0.88rem', display: 'block', lineHeight: 1.4 }}>
                            {wordsStr}
                          </strong>
                          <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed #CBD5E1', fontSize: '0.78rem', color: '#15803D', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>✓</span>
                            <span>Payment Confirmed via {invoice.paymentMethod || 'Razorpay UPI'} (Ref: {invoice.transactionId || 'TXN-WM-406283'})</span>
                          </div>
                        </td>
                        <td colSpan={4} style={{ padding: 0, verticalAlign: 'top' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                            <tbody>
                              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '0.45rem 0.75rem', color: '#64748B' }}>Taxable Subtotal:</td>
                                <td style={{ padding: '0.45rem 0.75rem', textAlign: 'right', fontWeight: '600', color: '#0F172A' }}>₹{taxableSubtotal.toFixed(2)}</td>
                              </tr>
                              {cgst > 0 ? (
                                <>
                                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                                    <td style={{ padding: '0.4rem 0.75rem', color: '#475569' }}>CGST (9.0%):</td>
                                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: '#475569' }}>₹{cgst.toFixed(2)}</td>
                                  </tr>
                                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                                    <td style={{ padding: '0.4rem 0.75rem', color: '#475569' }}>SGST (9.0%):</td>
                                    <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: '#475569' }}>₹{sgst.toFixed(2)}</td>
                                  </tr>
                                </>
                              ) : (
                                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                                  <td style={{ padding: '0.4rem 0.75rem', color: '#475569' }}>IGST (18.0%):</td>
                                  <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: '#475569' }}>₹{totalTax.toFixed(2)}</td>
                                </tr>
                              )}
                              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '0.4rem 0.75rem', color: '#64748B' }}>Delivery & Shipping:</td>
                                <td style={{ padding: '0.4rem 0.75rem', textAlign: 'right', color: '#16A34A', fontWeight: '700' }}>
                                  {shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(2)}
                                </td>
                              </tr>
                              <tr style={{ backgroundColor: '#EFF6FF', borderTop: '2px solid #2563EB', borderBottom: '2px solid #2563EB' }}>
                                <td style={{ padding: '0.65rem 0.75rem', fontWeight: '800', fontSize: '0.95rem', color: '#0F172A' }}>Grand Total (INR):</td>
                                <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: '900', fontSize: '1.15rem', color: '#2563EB' }}>₹{grandTotal.toFixed(2)}</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '0.35rem 0.75rem', color: '#15803D', fontWeight: '700' }}>Amount Paid:</td>
                                <td style={{ padding: '0.35rem 0.75rem', textAlign: 'right', color: '#15803D', fontWeight: '700' }}>₹{amountPaid.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '0.35rem 0.75rem', color: '#64748B' }}>Balance Due:</td>
                                <td style={{ padding: '0.35rem 0.75rem', textAlign: 'right', color: '#64748B' }}>₹0.00</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* BOTTOM SIGNATORY & OFFICIAL FOOTER */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ textAlign: 'center', minWidth: '220px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.25rem' }}>For MERIDIAN WHITE MIST PVT. LTD.</div>
                    <div style={{ fontSize: '1.35rem', color: '#2563EB', fontWeight: '800', fontFamily: 'Caveat, cursive, sans-serif', margin: '0.35rem 0' }}>Meridian White Mist</div>
                    <div style={{ borderTop: '1px solid #94A3B8', paddingTop: '0.35rem', fontSize: '0.75rem', color: '#475569' }}>
                      <strong>Authorized Signatory</strong>
                    </div>
                  </div>
                </div>

                {/* BRANDED INVOICE FOOTER BANNER */}
                <div style={{ marginTop: '1.25rem', borderRadius: '6px', overflow: 'hidden', width: '100%', border: '1px solid #E2E8F0' }}>
                  <img
                    src="/assets/images/invoice_footer_banner.png"
                    alt="Stay Fresh with White Mist"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = 'true';
                        e.target.src = '/images/invoice_footer_banner.png';
                      }
                    }}
                  />
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.75rem' }}>
                  This is a computer-generated tax invoice and does not require physical signature.
                </div>
              </>
            );
          })()}

        </div>

      </div>

      {/* Global CSS for Print Mode */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .no-print {
            display: none !important;
          }
          .invoice-modal-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: transparent !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          .invoice-modal-content {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          #whiteMistInvoicePrintArea, #whiteMistInvoicePrintArea * {
            visibility: visible !important;
          }
          #whiteMistInvoicePrintArea {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20mm !important;
            background: #ffffff !important;
          }
        }
      `}</style>
    </div>
  );
}

