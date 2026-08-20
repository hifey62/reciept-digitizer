# Receipt Digitizer

Turn a photo of a paper receipt into a structured, searchable expense record — extracted automatically by AI, reviewed and corrected by a human, then saved to a database and a Google Sheet for record-keeping.

Built as a real tool for small business owners in Nigeria who currently track expenses on paper or not at all.

## Demo

<!-- Paste the video/GIF embed markdown GitHub gives you here, after uploading -->

## Why this exists

Most small businesses don't have time to manually log every receipt into a spreadsheet. This app closes that gap: snap a photo, let AI read it, confirm it's correct, done. Records land automatically in a Google Sheet the owner already understands and can share with an accountant.

## How it works

1. **Upload** — take or upload a photo of a receipt
2. **Extract** — the image is sent to an AI vision model, which reads out the vendor, amount, date, category, and itemized list as structured data
3. **Review & Confirm** — the extracted data is shown back to the user as an editable form, so they can correct anything the AI got wrong before saving. AI output is treated as a first draft, never a final answer.
4. **Save** — once confirmed, the record is pushed to a Google Sheet (the owner's portable, human-readable record) and saved to a local database (powering the app's own ledger and dashboard)

## Tech stack

**Frontend:** React, Vite, Tailwind CSS
**Backend:** Node.js, Express
**Database:** SQLite + Prisma ORM
**AI extraction:** Groq (vision-capable LLM), structured JSON output
**Spreadsheet sync:** Google Apps Script, deployed as a Web App

## Architecture notes

- Sheets is pushed to *before* the database write. If the Sheets push fails, nothing is saved anywhere — this avoids a silent mismatch between the two systems.
- The AI extraction step and the save step are two separate API routes on purpose. Splitting them is what makes the human review step possible — the app never trusts AI output blindly.
- `Receipt` and `Item` are modeled as a one-to-many relationship (one receipt, many line items), linked by a `receiptId` foreign key.

## Status

🚧 Actively in development. Currently working: upload → AI extraction → review/edit → save to DB + Google Sheets.

Coming next: authentication, ledger view, spend dashboard.

## Running locally

**Backend**
\`\`\`bash
cd receipt-digitizer-backend
npm install
npm run dev
\`\`\`

**Frontend**
\`\`\`bash
cd receipt-digitizer-frontend
npm install
npm run dev
\`\`\`

Copy `.env.example` to `.env` in both folders and fill in your own values — you'll need a Groq API key and a deployed Google Apps Script URL.

## Author

Built by [Ifeoluwa Lapite](https://github.com/hifey62) as part of a public build-in-public portfolio series — one real, tested full-stack project every two weeks.