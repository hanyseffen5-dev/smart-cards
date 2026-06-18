/**
 * Smart Cards — جزء منفصل بدون تعارض مع English Platform
 *
 * ⚠️ في Google Apps Script كل ملفات .gs تشترك نفس النطاق:
 *    - لا تُعرّف doPost / doGet / SPREADSHEET_ID مرة ثانية هنا
 *    - كل الثوابت والدوال هنا تبدأ بـ SC_
 *
 * ── خيار 1 (مُفضّل): مشروع Apps Script منفصل ──
 *    أنشئ مشروعاً جديداً مربوطاً بشيت Smart Cards فقط → الصق هذا الملف
 *    → Deploy → Web app → انسخ الرابط إلى .env
 *
 * ── خيار 2: نفس المشروع مع English Platform ──
 *    1. احذف أي doPost / doGet مكرّر من Untitled.gs أو ss.gs
 *    2. في Code.gs (الملف الرئيسي) عدّل doPost ليستدعي scHandlePost_ أولاً:
 *
 *    function doPost(e) {
 *      var data = JSON.parse(e.postData.contents);
 *      var scTypes = { login:1, logout:1, check_messages:1, mark_read:1, payment_proof:1 };
 *      if (scTypes[data.type]) return scHandlePost_(data);
 *      // ... باقي كود English Platform هنا ...
 *    }
 *
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1PvRPszBX5akZ3o9K4-9-jUlP28WxqMDVr7fNB5OZ3fQ
 */

var SC_SPREADSHEET_ID = "1PvRPszBX5akZ3o9K4-9-jUlP28WxqMDVr7fNB5OZ3fQ";
var SC_LOGIN_SHEET = "smart cards";
var SC_MESSAGES_SHEET = "smart cards messages";

/** نقطة الدخول — استدعِها من doPost الرئيسي فقط */
function scHandlePost_(data) {
  var ss = SpreadsheetApp.openById(SC_SPREADSHEET_ID);

  if (data.type === "login") {
    return scHandleLogin_(ss, data);
  }
  if (data.type === "logout") {
    return scHandleLogout_(ss, data);
  }
  if (data.type === "check_messages") {
    return scHandleCheckMessages_(ss, data);
  }
  if (data.type === "mark_read") {
    return scHandleMarkRead_(ss, data);
  }
  if (data.type === "payment_proof") {
    return scHandlePaymentProof_(ss, data);
  }

  return scJsonResponse({ error: "unknown type: " + (data.type || "(missing)") });
}

/** Find the best row for a fingerprint (prefers BLOCK row). Returns 1-based row or -1. */
function scFindMessageRow_(sheet, fpNorm) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var rows = sheet.getRange(2, 1, lastRow, 5).getValues();
  var fallback = -1;
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toLowerCase() !== fpNorm) continue;
    fallback = i + 2;
    if (String(rows[i][3] || "").trim().toUpperCase() === "BLOCK") return i + 2;
  }
  return fallback;
}

function scHandleLogin_(ss, data) {
  var sheet = ss.getSheetByName(SC_LOGIN_SHEET);
  if (!sheet) throw new Error('Sheet not found: "' + SC_LOGIN_SHEET + '"');
  sheet.appendRow([
    data.shortFp || "",
    data.name || "",
    data.fingerprint || "",
    data.loginTime || "",
    "",
    "",
  ]);
  return scJsonResponse({ ok: true });
}

function scHandleLogout_(ss, data) {
  var sheet = ss.getSheetByName(SC_LOGIN_SHEET);
  if (!sheet) throw new Error('Sheet not found: "' + SC_LOGIN_SHEET + '"');
  var lastRow = sheet.getLastRow();
  var fp = String(data.fingerprint || "").trim().toLowerCase();
  if (lastRow >= 2 && fp) {
    // Include lastRow — the previous code used lastRow-1 and skipped the newest session row.
    var values = sheet.getRange(2, 1, lastRow, 6).getValues();
    for (var i = values.length - 1; i >= 0; i--) {
      if (String(values[i][2]).trim().toLowerCase() === fp && !values[i][4]) {
        var rowNum = i + 2;
        sheet.getRange(rowNum, 5).setValue(data.exitTime || "");
        sheet.getRange(rowNum, 6).setValue(data.duration || "");
        break;
      }
    }
  }
  return scJsonResponse({ ok: true });
}

function scHandleCheckMessages_(ss, data) {
  var sheet = ss.getSheetByName(SC_MESSAGES_SHEET);
  if (!sheet) throw new Error('Sheet not found: "' + SC_MESSAGES_SHEET + '"');

  var fpNorm = String(data.fingerprint || "").trim().toLowerCase();
  if (!fpNorm) {
    return scJsonResponse({ alreadyExists: false, message: null, isBlocked: false, paymentSubmitted: false });
  }

  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    var rows = sheet.getRange(2, 1, lastRow, 5).getValues();
    var found = false;
    var messageToSend = null;
    var blockNote = null;
    var blocked = false;
    var paymentSubmitted = false;
    for (var j = 0; j < rows.length; j++) {
      if (String(rows[j][0]).trim().toLowerCase() !== fpNorm) continue;
      found = true;
      var msg = String(rows[j][1] || "").trim();
      var readSt = String(rows[j][2] || "").trim().toLowerCase();
      var proof = String(rows[j][4] || "").trim();
      if (proof) paymentSubmitted = true;
      if (String(rows[j][3] || "").trim().toUpperCase() === "BLOCK") blocked = true;
      if (msg) blockNote = msg;
      if (msg && readSt.indexOf("read") === -1) messageToSend = msg;
    }
    if (found) {
      if (blocked) messageToSend = blockNote;
      return scJsonResponse({
        alreadyExists: true,
        message: messageToSend,
        isBlocked: blocked,
        paymentSubmitted: paymentSubmitted,
      });
    }
  }

  sheet.appendRow([fpNorm, "", "", "", ""]);
  return scJsonResponse({ alreadyExists: false, message: null, isBlocked: false, paymentSubmitted: false });
}

function scHandleMarkRead_(ss, data) {
  var sheet = ss.getSheetByName(SC_MESSAGES_SHEET);
  if (!sheet) throw new Error('Sheet not found: "' + SC_MESSAGES_SHEET + '"');

  var fp = String(data.fingerprint || "").trim().toLowerCase();
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2 && fp) {
    var rows = sheet.getRange(2, 1, lastRow, 4).getValues();
    var ts = Utilities.formatDate(new Date(), "Africa/Cairo", "yyyy/MM/dd HH:mm:ss");
    // Mark the row that has an unread message; otherwise the last matching row.
    var markRow = -1;
    for (var k = rows.length - 1; k >= 0; k--) {
      if (String(rows[k][0]).trim().toLowerCase() !== fp) continue;
      if (markRow < 0) markRow = k;
      var msg = String(rows[k][1] || "").trim();
      var readSt = String(rows[k][2] || "").trim().toLowerCase();
      if (msg && readSt.indexOf("read") === -1) {
        markRow = k;
        break;
      }
    }
    if (markRow >= 0) {
      sheet.getRange(markRow + 2, 3).setValue("read - " + ts);
    }
  }
  return scJsonResponse({ ok: true });
}

function scHandlePaymentProof_(ss, data) {
  var sheet = ss.getSheetByName(SC_MESSAGES_SHEET);
  if (!sheet) throw new Error('Sheet not found: "' + SC_MESSAGES_SHEET + '"');

  var fpNorm = String(data.fingerprint || "").trim().toLowerCase();
  var base64 = String(data.imageBase64 || "").trim();
  var mime = String(data.mimeType || "image/jpeg").trim();
  if (!fpNorm || !base64) {
    return scJsonResponse({ ok: false, error: "missing fingerprint or image" });
  }

  var rowNum = scFindMessageRow_(sheet, fpNorm);
  if (rowNum < 0) {
    sheet.appendRow([fpNorm, "", "", "BLOCK", ""]);
    rowNum = sheet.getLastRow();
  }

  var bytes = Utilities.base64Decode(base64);
  var blob = Utilities.newBlob(bytes, mime, "payment-" + fpNorm.slice(0, 8) + ".jpg");
  var file = DriveApp.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var url = "https://drive.google.com/uc?export=view&id=" + file.getId();
  var ts = Utilities.formatDate(new Date(), "Africa/Cairo", "yyyy/MM/dd HH:mm:ss");

  sheet.getRange(rowNum, 5).setFormula('=IMAGE("' + url + '")');
  sheet.getRange(rowNum, 5).setNote("قيد المراجعة - " + ts);

  return scJsonResponse({ ok: true });
}

function scJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * ── للمشروع المنفصل فقط (بدون English Platform) ──
 * إذا Smart Cards في مشروع لوحده، أزل التعليق عن doPost/doGet أدناه
 * واحذف scHandlePost_ call من أي ملف آخر.
 */
function doGet() {
  return scJsonResponse({ ok: true });
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    return scHandlePost_(data);
  } catch (err) {
    return scJsonResponse({ error: err.toString() });
  }
}
