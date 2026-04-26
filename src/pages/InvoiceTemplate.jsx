import React, { useEffect } from 'react';
import './InvoiceTemplate.css';
import { captureCutColorInvoice, captureCutColorInvoices } from '../invoices/captureCutColor';

const invoices = captureCutColorInvoices;

function formatMoney(value, currency = 'XCD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 2,
    }).format(value);
}

function InvoiceActions() {
    return (
        <div className="invoice-actions" aria-label="Invoice actions">
            <a href="/" className="invoice-action-link">Back to site</a>
            <button type="button" onClick={() => window.print()}>Save as PDF</button>
        </div>
    );
}

function CaptureCutColorLogo() {
    return (
        <img
            className="invoice-logo-mark"
            src="/capture-cut-color-logo.jpg"
            alt="Capture Cut Color"
        />
    );
}

function InvoiceTemplateView({ invoice }) {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return (
        <main className="invoice-template" aria-label="CaptureCutColor invoice">
            <InvoiceActions />
            <article className="invoice-page">
                <header className="invoice-header">
                    <CaptureCutColorLogo />
                    <div className="invoice-title-block">
                        <h1>Invoice</h1>
                        <address>
                            <strong>{invoice.sender.name}</strong>
                            {invoice.sender.address.map((line) => <span key={line}>{line}</span>)}
                            <span>{invoice.sender.phone}</span>
                            <span>{invoice.sender.email}</span>
                        </address>
                    </div>
                </header>

                <section className="invoice-meta-section">
                    <div className="invoice-bill-to">
                        <p>Bill To</p>
                        <strong>{invoice.billTo.name}</strong>
                        {invoice.billTo.address?.map((line) => <span key={line}>{line}</span>)}
                        {invoice.billTo.phone && <span>Phone: {invoice.billTo.phone}</span>}
                        {invoice.billTo.mobile && <span>Mobile: {invoice.billTo.mobile}</span>}
                        {invoice.billTo.email && <span>{invoice.billTo.email}</span>}
                    </div>
                    <dl className="invoice-meta">
                        <div>
                            <dt>Invoice Number:</dt>
                            <dd>{invoice.invoiceNumber}</dd>
                        </div>
                        <div>
                            <dt>Invoice Date:</dt>
                            <dd>{invoice.invoiceDate}</dd>
                        </div>
                        <div>
                            <dt>Payment Due:</dt>
                            <dd>{invoice.paymentDue}</dd>
                        </div>
                        <div className="invoice-meta-highlight">
                            <dt>Amount Due ({invoice.currency}):</dt>
                            <dd>{formatMoney(subtotal, invoice.currency)}</dd>
                        </div>
                    </dl>
                </section>

                <table className="invoice-items">
                    <thead>
                        <tr>
                            <th scope="col">Items</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item) => (
                            <tr key={item.description}>
                                <td>
                                    <strong>{item.description}</strong>
                                    <span>{item.details}</span>
                                </td>
                                <td>{item.quantity}</td>
                                <td>{formatMoney(item.price, invoice.currency)}</td>
                                <td>{formatMoney(item.quantity * item.price, invoice.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <section className="invoice-total-section" aria-label="Invoice totals">
                    <dl>
                        <div>
                            <dt>Total:</dt>
                            <dd>{formatMoney(subtotal, invoice.currency)}</dd>
                        </div>
                        <div className="invoice-total-due">
                            <dt>Amount Due ({invoice.currency}):</dt>
                            <dd>{formatMoney(subtotal, invoice.currency)}</dd>
                        </div>
                    </dl>
                </section>

                <section className="invoice-notes">
                    <h2>Notes / Terms</h2>
                    {invoice.notes.terms.map((note) => <p key={note}>{note}</p>)}

                    <h3>Banking Details</h3>
                    <dl>
                        {invoice.notes.banking.map(([label, value]) => (
                            <div key={label}>
                                <dt>{label}:</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>

                    {invoice.notes.footer.map((note) => <p key={note}>{note}</p>)}
                </section>
            </article>
        </main>
    );
}

export default function InvoiceTemplate() {
    useEffect(() => {
        document.body.classList.add('invoice-print-view');
        return () => document.body.classList.remove('invoice-print-view');
    }, []);

    const search = new URLSearchParams(window.location.search);
    const requestedInvoice = search.get('invoice') || captureCutColorInvoice.slug;
    const selectedInvoice = invoices[requestedInvoice] || captureCutColorInvoice;

    return <InvoiceTemplateView invoice={selectedInvoice} />;
}
