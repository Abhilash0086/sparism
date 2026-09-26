/**
 * Sparism enquiry form -> Google Sheet backend.
 *
 * Setup (also see README.md):
 * 1. Create a new Google Sheet. Rename its first tab "Enquiries".
 * 2. In the Sheet: Extensions -> Apps Script. Delete any sample code and
 *    paste this whole file in.
 * 3. Click Deploy -> New deployment -> type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the deployment URL and paste it into APPS_SCRIPT_URL in
 *    website/script.js.
 * 5. Submit a test enquiry from the site and confirm a new row appears.
 */

const SHEET_NAME = "Enquiries";

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Phone",
      "Address",
      "Email",
      "Product Interested In",
      "Message",
    ]);
  }

  let data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter || {};
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.phone || "",
    data.address || "",
    data.email || "",
    data.product || "",
    data.message || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Lets you open the deployment URL directly in a browser to sanity-check it's live.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "Sparism enquiry endpoint is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}
