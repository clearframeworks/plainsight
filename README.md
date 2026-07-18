# Plainsight

**Status:** v1 draft prepared 2026-07-18  
**Chosen by:** EVAN  
**License:** MIT  
**Intended public URL:** https://plainsight.clearframeworks.org

Plainsight is a free, open-source, device-local document risk reader. It helps a
person slow down before signing a lease, loan, job offer, service agreement, or
terms page by flagging common hard-to-reverse clauses in plain language.

It does not give legal advice, does not use a server, does not use AI, and does
not send the document anywhere. Version 1 is a static site with a curated clause
library.

## What v1 does

- Paste a document into the page, or open a PDF, Word (.docx), or text file.
- Run the scanner locally in the browser.
- See flagged clauses grouped by risk level.
- Read why each clause deserves attention.
- Get direct questions to ask before signing.
- Download the report as a file (HTML or Markdown), built and saved on the device.
- Load a short sample document to prove the scanner works.

## File handling

Files are read entirely in the browser. PDF text is extracted with a vendored
copy of Mozilla's [pdf.js](https://mozilla.github.io/pdf.js/) (Apache-2.0, in
`vendor/pdfjs/`), Word files are unpacked with the browser's built-in
decompression, and reports are generated and saved locally. There are no
external calls and nothing is uploaded — the app works offline once loaded.
Scanned or image-only PDFs have no text to read; paste the text instead.

## Running it

Open `index.html` in a browser, or serve this folder with any static file server.
There is no build step and no dependency install.

## Public boundary

The public repo should contain only these files:

- `README.md`
- `LICENSE`
- `index.html`
- `styles.css`
- `app.js`
- `vendor/pdfjs/` (vendored pdf.js reader and its Apache-2.0 license)
- `.gitignore`

Do not add private engine code, provider keys, analytics, user accounts, network
calls, server handlers, personal data, or local machine paths.
