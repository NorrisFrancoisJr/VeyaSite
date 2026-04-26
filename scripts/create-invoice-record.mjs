import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sequencePath = resolve(root, 'invoices/invoice-sequence.json');
const recordsDir = resolve(root, 'src/invoices/records');

const defaultSender = {
    name: 'CaptureCutColor',
    address: ['Roseau', 'Dominica'],
    phone: '767 265 1689',
    email: 'norrisfrancoisjr.com',
};

const defaultNotes = {
    terms: ['Make all cheques payable to Norris Francois Jr'],
    banking: [
        ['Account Name', 'Norris Francois Jr'],
        ['Account Number', '800006298'],
        ['Mobile Number', '767-265-1689'],
    ],
    footer: [
        'Wire transfer details attached separately',
        'NB: Price in XCD. Banking fees handled by client.',
    ],
};

function getTodayDate() {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'America/Dominica',
    }).format(new Date());
}

function getArg(name) {
    const match = process.argv.find((arg) => arg.startsWith(`${name}=`));
    if (match) {
        return match.slice(name.length + 1);
    }

    const index = process.argv.indexOf(name);
    return index >= 0 ? process.argv[index + 1] : undefined;
}

function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function readJson(path) {
    return JSON.parse(await readFile(path, 'utf8'));
}

async function main() {
    const draftArg = getArg('--draft');

    if (!draftArg) {
        throw new Error('Missing --draft path. Example: npm run invoice:new -- --draft invoices/drafts/my-invoice.json');
    }

    const draftPath = resolve(root, draftArg);
    const draft = await readJson(draftPath);
    const sequence = await readJson(sequencePath);
    const invoiceNumber = String(sequence.nextInvoiceNumber);

    if (!Number.isInteger(sequence.nextInvoiceNumber)) {
        throw new Error(`${sequencePath} must contain an integer nextInvoiceNumber.`);
    }

    const slugBase = slugify(draft.slugBase || draft.billTo?.name || `invoice-${invoiceNumber}`);
    const slug = `${slugBase}-${invoiceNumber}`;
    const invoice = {
        slug,
        invoiceNumber,
        currency: draft.currency || 'XCD',
        invoiceDate: draft.invoiceDate || getTodayDate(),
        paymentDue: draft.paymentDue || draft.invoiceDate || getTodayDate(),
        sender: draft.sender || defaultSender,
        billTo: draft.billTo,
        items: draft.items,
        notes: draft.notes || defaultNotes,
    };

    if (!invoice.billTo || !Array.isArray(invoice.items) || invoice.items.length === 0) {
        throw new Error('Draft must include billTo and at least one item.');
    }

    await mkdir(recordsDir, { recursive: true });
    const recordPath = resolve(recordsDir, `${slug}.json`);
    await writeFile(recordPath, `${JSON.stringify(invoice, null, 2)}\n`);
    await writeFile(sequencePath, `${JSON.stringify({ nextInvoiceNumber: sequence.nextInvoiceNumber + 1 }, null, 2)}\n`);

    console.log(`Created invoice ${invoiceNumber}: ${recordPath}`);
    console.log(`Next invoice number is ${sequence.nextInvoiceNumber + 1}.`);
    console.log(`Export with: npm run export:invoice -- "http://127.0.0.1:5173/invoice-template?invoice=${slug}" "invoices/${slug}.pdf"`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
