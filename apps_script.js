// Google Apps Script - Bitacora de Trabajo
// Pegar esto en Extensiones > Apps Script de tu Google Sheet

const HOJA = 'Bitacora';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(HOJA);

    if (data.action === 'agregar') {
      sheet.appendRow([
        data.fecha,
        data.texto,
        data.timestamp,
        new Date().toISOString()
      ]);
      return jsonResponse({ ok: true });
    }

    if (data.action === 'eliminar') {
      const rows = sheet.getDataRange().getValues();
      for (let i = rows.length - 1; i >= 1; i--) {
        if (Number(rows[i][2]) === Number(data.timestamp)) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: 'Accion no reconocida' });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(HOJA);
    const data = sheet.getDataRange().getValues();
    const registros = [];

    for (let i = 1; i < data.length; i++) {
      registros.push({
        fecha: data[i][0],
        texto: data[i][1],
        timestamp: Number(data[i][2])
      });
    }

    return jsonResponse({ ok: true, registros: registros });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString(), registros: [] });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
