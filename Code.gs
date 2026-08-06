/**
 * =========================================================
 *  Hari ❤ Varshini — RSVP → Google Sheets
 *  Google Apps Script backend (Code.gs)
 * =========================================================
 *
 *  DEPLOYMENT
 *  ----------
 *  1. Open https://sheets.google.com/ and create a new sheet
 *     named e.g. "Hari-Varshini RSVP".
 *  2. In the sheet, click  Extensions → Apps Script.
 *  3. Delete any starter code, then paste THIS file's contents.
 *  4. Click the disk icon to save.
 *  5. Click  Deploy → New deployment
 *        Type            : Web app
 *        Description     : RSVP endpoint
 *        Execute as      : Me
 *        Who has access  : Anyone
 *  6. Click Deploy. Authorize when prompted.
 *  7. Copy the "Web app URL" (ends in /exec).
 *  8. Open  script.js  and paste that URL as the value of
 *     the GOOGLE_SHEETS_URL constant near the top.
 *
 *  That's it — RSVPs will now append into your sheet.
 *
 *  NOTE
 *  ----
 *  The frontend posts as text/plain with mode:'no-cors' so
 *  there is no CORS preflight and it works from any host
 *  (GitHub Pages / Netlify / Vercel). This script parses the
 *  raw JSON body accordingly.
 */

// The name of the sheet tab we write into.
const SHEET_NAME = 'RSVPs';

// The column order — extend at will.
const COLUMNS = ['timestamp', 'name', 'phone', 'email', 'guests', 'attending', 'message'];

/**
 * doPost — receives the RSVP submission from the site.
 */
function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(body);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(COLUMNS.map(c => c.charAt(0).toUpperCase() + c.slice(1)));
      // Style the header row
      const headerRange = sheet.getRange(1, 1, 1, COLUMNS.length);
      headerRange.setFontWeight('bold').setBackground('#b48a3c').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    const row = COLUMNS.map(c => data[c] || '');
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet — friendly landing so people who visit the URL directly
 * see something instead of an error.
 */
function doGet() {
  return ContentService
    .createTextOutput('Hari ❤ Varshini — RSVP endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
