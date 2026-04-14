// Google Apps Script - Bitacora de Trabajo
// Pegar en Apps Script > Guardar > Implementar como Aplicacion Web

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Intentar "Bitacora", si no existe usar la primera hoja
  var sheet = ss.getSheetByName('PabloMora');
  if (!sheet) sheet = ss.getSheets()[0];
  return sheet;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet();

    if (data.action === 'agregar') {
      sheet.appendRow([data.fecha, data.texto, data.timestamp, new Date().toISOString()]);
      return resp({ ok: true });
    }

    if (data.action === 'eliminar') {
      var rows = sheet.getDataRange().getValues();
      for (var i = rows.length - 1; i >= 1; i--) {
        if (Number(rows[i][2]) === Number(data.timestamp)) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return resp({ ok: true });
    }

    return resp({ ok: false, error: 'Accion no reconocida' });
  } catch (err) {
    return resp({ ok: false, error: err.toString() });
  }
}

function doGet(e) {
  try {
    var params = e.parameter || {};
    var sheet = getSheet();

    // Agregar via GET
    if (params.action === 'agregar' && params.fecha && params.texto && params.timestamp) {
      sheet.appendRow([params.fecha, params.texto, Number(params.timestamp), new Date().toISOString()]);
      return respCb(params.callback, { ok: true });
    }

    // Eliminar via GET
    if (params.action === 'eliminar' && params.timestamp) {
      var rows = sheet.getDataRange().getValues();
      for (var i = rows.length - 1; i >= 1; i--) {
        if (Number(rows[i][2]) === Number(params.timestamp)) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return respCb(params.callback, { ok: true });
    }

    // Listar registros
    var data = sheet.getDataRange().getValues();
    var registros = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === '' && data[i][1] === '') continue;
      registros.push({
        fecha: String(data[i][0]),
        texto: String(data[i][1]),
        timestamp: Number(data[i][2]) || 0
      });
    }

    return respCb(params.callback, { ok: true, registros: registros });

  } catch (err) {
    var cb = (e.parameter || {}).callback;
    return respCb(cb, { ok: false, error: err.toString(), registros: [] });
  }
}

function resp(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function respCb(callback, obj) {
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(obj) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return resp(obj);
}
