/**
 * مثال: Code.gs الرئيسي — English Platform + Smart Cards بدون تعارض
 *
 * ضع smart-cards-webhook.gs في ملف منفصل (مثلاً SmartCards.gs)
 * واترك doPost / doGet هنا فقط مرة واحدة.
 */

const SPREADSHEET_ID = "1PvRPszBX5akZ3o9K4-9-jUlP28WxqMDVr7fNB5OZ3fQ";

// ── English Platform (GET) ──
function doGet(e) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var action = e.parameter.action;

  try {
    if (action === "login") {
      var sheet = ss.getSheetByName("Sheet3") || ss.getSheets()[0];
      sheet.appendRow([
        e.parameter.studentId || "",
        e.parameter.name || "",
        e.parameter.fingerprint || "",
        new Date().toLocaleString("en-EG"),
        "",
        "",
      ]);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Router: Smart Cards أولاً، ثم English Platform ──
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Smart Cards (Flash Cards app) — types: login, logout, check_messages, mark_read
    var scTypes = { login: 1, logout: 1, check_messages: 1, mark_read: 1 };
    if (scTypes[data.type]) {
      return scHandlePost_(data); // defined in SmartCards.gs
    }

    // English Platform POST handlers (أضف هنا إن وُجد)
    return ContentService.createTextOutput(JSON.stringify({ error: "unknown type" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
