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

- Paste a document into the page.
- Run the scanner locally in the browser.
- See flagged clauses grouped by risk level.
- Read why each clause deserves attention.
- Get direct questions to ask before signing.
- Load a short sample document to prove the scanner works.

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

Do not add private engine code, provider keys, analytics, user accounts, network
calls, server handlers, personal data, or local machine paths.
