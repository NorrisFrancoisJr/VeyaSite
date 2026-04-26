# Veya Creative Proposal Content

Edit proposal copy, pricing, and labels in the client data file:

- `sabifiRiverResort.js`

The layout and PDF styling live separately in:

- `../pages/ProposalTemplate.jsx`
- `../pages/ProposalTemplate.css`

After editing proposal content, preview it at:

- `http://127.0.0.1:5173/proposal-template`

The browser page has a `Save as PDF` button. For the most accurate export, use:

```sh
npm run export:proposal
```

The export script uses Chrome's browser protocol so the PDF keeps the same landscape page size, backgrounds, fonts, and print rules as the browser preview.
