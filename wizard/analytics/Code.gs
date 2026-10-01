/**
 * Wiki-eReader Wizard — Anonymous Analytics
 *
 * Ghi nhận:
 * - completed: câu trả lời + các model kết quả
 * - model_click: model nào được click và loại link nào
 *
 * Không ghi email, tên, IP hoặc User-Agent.
 *
 * Cách dùng:
 * 1) Tạo một Google Sheet mới.
 * 2) Extensions -> Apps Script.
 * 3) Dán file này vào Code.gs và Save.
 * 4) Deploy -> New deployment -> Web app.
 * 5) Execute as: Me.
 * 6) Who has access: Anyone.
 * 7) Copy URL /exec và đặt vào ANALYTICS_ENDPOINT trong wizard/index.html.
 */

const SHEET_NAME = 'Wizard Responses';

const HEADERS = [
  'server_timestamp',
  'event_type',
  'event_id',
  'analytics_version',
  'question_schema',
  'source',
  'answers_json',
  'result_model_ids',
  'model_id',
  'link_kind'
];

function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Script must be bound to the target Google Sheet.');
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet() {
  return jsonOutput({
    ok: true,
    service: 'wiki-ereader-wizard-analytics',
    sheet: SHEET_NAME
  });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Missing POST body.');
    }

    const data = JSON.parse(e.postData.contents);
    const allowed = ['completed', 'model_click'];
    if (!allowed.includes(data.type)) {
      throw new Error('Unsupported event type.');
    }

    const sheet = getSheet_();
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);

    try {
      sheet.appendRow([
        new Date(),
        String(data.type || ''),
        String(data.event_id || ''),
        String(data.analytics_version || ''),
        String(data.question_schema || ''),
        String(data.source || ''),
        String(data.answers_json || ''),
        String(data.result_model_ids || ''),
        String(data.model_id || ''),
        String(data.link_kind || '')
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonOutput({ok: true});
  } catch (err) {
    return jsonOutput({
      ok: false,
      error: String(err && err.message ? err.message : err)
    });
  }
}
