# Configurar Google Sheets para la Bitacora

## Paso 1: Crear la Hoja
1. Ve a https://sheets.google.com y crea una hoja nueva
2. Nombra la hoja "Bitacora"
3. En la primera fila pon estos encabezados:
   - A1: fecha
   - B1: texto
   - C1: timestamp
   - D1: fechaRegistro

## Paso 2: Crear el Apps Script
1. En la hoja, ve a **Extensiones > Apps Script**
2. Borra todo el codigo que aparece
3. Pega el contenido del archivo `apps_script.js` que esta en esta carpeta
4. Guarda (Ctrl+S)

## Paso 3: Desplegar
1. Click en **Implementar > Nueva implementacion**
2. En tipo, selecciona **Aplicacion web**
3. Descripcion: "Bitacora API"
4. Ejecutar como: **Yo**
5. Quien tiene acceso: **Cualquier persona**
6. Click en **Implementar**
7. Autoriza con tu cuenta Google cuando lo pida
8. **Copia la URL** que te da (algo como https://script.google.com/macros/s/XXXXX/exec)

## Paso 4: Pegar la URL en la app
1. Abre el archivo `index.html`
2. Busca la linea que dice `const APPS_SCRIPT_URL = '...'`
3. Reemplaza con la URL que copiaste
4. Haz commit y push:
   ```
   cd C:\Users\migue\bitacora
   git add -A && git commit -m "Agregar Google Sheets" && git push
   ```
5. Espera 1-2 minutos y listo
