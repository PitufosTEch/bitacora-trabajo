// Google Apps Script - Bitacora de Trabajo
// Pegar esto en Extensiones > Apps Script de tu Google Sheet
// Luego: Implementar > Aplicacion web > Ejecutar como Yo > Cualquier persona con cuenta Google

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
    const params = e.parameter || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(HOJA);

    // Si viene con accion=agregar via GET (fallback para CORS)
    if (params.action === 'agregar' && params.fecha && params.texto && params.timestamp) {
      sheet.appendRow([
        params.fecha,
        params.texto,
        Number(params.timestamp),
        new Date().toISOString()
      ]);
      // Devolver JSONP si hay callback
      if (params.callback) {
        return ContentService
          .createTextOutput(params.callback + '(' + JSON.stringify({ ok: true }) + ')')
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return jsonResponse({ ok: true });
    }

    // Si viene con accion=eliminar via GET
    if (params.action === 'eliminar' && params.timestamp) {
      const rows = sheet.getDataRange().getValues();
      for (let i = rows.length - 1; i >= 1; i--) {
        if (Number(rows[i][2]) === Number(params.timestamp)) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      if (params.callback) {
        return ContentService
          .createTextOutput(params.callback + '(' + JSON.stringify({ ok: true }) + ')')
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return jsonResponse({ ok: true });
    }

    // Default: devolver todos los registros
    const data = sheet.getDataRange().getValues();
    const registros = [];
    for (let i = 1; i < data.length; i++) {
      registros.push({
        fecha: String(data[i][0]),
        texto: String(data[i][1]),
        timestamp: Number(data[i][2])
      });
    }

    const result = { ok: true, registros: registros };

    if (params.callback) {
      return ContentService
        .createTextOutput(params.callback + '(' + JSON.stringify(result) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return jsonResponse(result);

  } catch (err) {
    const errResult = { ok: false, error: err.toString(), registros: [] };
    if ((e.parameter || {}).callback) {
      return ContentService
        .createTextOutput(e.parameter.callback + '(' + JSON.stringify(errResult) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return jsonResponse(errResult);
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
