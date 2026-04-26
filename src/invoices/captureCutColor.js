const invoiceModules = import.meta.glob('./records/*.json', {
    eager: true,
    import: 'default',
});

export const captureCutColorInvoices = Object.values(invoiceModules).reduce((records, invoice) => {
    records[invoice.slug] = invoice;

    if (invoice.aliases) {
        invoice.aliases.forEach((alias) => {
            records[alias] = invoice;
        });
    }

    return records;
}, {});

export const captureCutColorInvoice = captureCutColorInvoices['safe-haven-deposit-300'];
