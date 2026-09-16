# Grado · Banco de práctica de Ingeniería de Sistemas

Web estática en HTML, CSS y JavaScript, preparada para GitHub Pages. Sin backend, claves de API, base de datos externa ni instalación de dependencias en producción.

## Practicar

- Banco completo de 147 preguntas: 131 de opción múltiple, 4 de verdadero/falso y 12 abiertas. Se conservan las 13 tablas del Word.
- Todas las preguntas o sesiones de 10, 25 o 50, filtradas por área. Orden aleatorio sin repeticiones; las letras de las opciones se conservan.
- «No sé la respuesta» en todas las preguntas. Navegación libre y guardado automático en el navegador.
- Al final: puntaje, desglose automático/autoevaluado, errores, respuestas desconocidas y preguntas sin clave válida para consultar al docente.
- Copia para ChatGPT con todas las opciones, correctas marcadas, explicaciones y notas. Alternativas de selección manual y descarga `.txt` si el portapapeles no está disponible.
- Nueva práctica solo de errores y respuestas desconocidas. Explorador del banco con búsqueda y filtros.

El progreso es local a cada navegador/dispositivo. Una nueva sesión reemplaza la anterior. No se envían respuestas a un servidor. Las tipografías opcionales se descargan de Google Fonts, con fuentes de sistema como respaldo.

## Respuestas y puntaje

El documento **sí contenía respuestas**. Se revisaron conceptualmente y se conservaron en `sourceAnswer` y `sourceCorrectOptions`. La clave es material de estudio revisado por IA, no una clave oficial aprobada por el docente. Ver [criterios y observaciones](REVIEW.md).

Cada pregunta evaluable vale 1 punto. Incorrecta y «No sé» valen 0. Puntaje = aciertos / preguntas evaluables × 100, redondeado al entero más cercano. Las abiertas son autoevaluadas con una guía, nunca calificadas automáticamente por similitud de texto.

La pregunta 55 contiene una premisa incorrecta sobre vistas con JOIN: no puntúa y aparece en observaciones. En la 118 se aceptan B y C, pues LIFO y FILO son equivalentes. Los ejemplos corregidos conservan el original en `sourcePrompt`.

## Ejecutar localmente

Desde la carpeta del repositorio:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Abrir http://127.0.0.1:8000. No abrir `index.html` con doble clic: los navegadores restringen `fetch` y módulos desde `file://`.

## Publicar en GitHub Pages

En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**.

URL esperada: https://isaac0155.github.io/examen_grado_sis/

Los recursos usan rutas relativas para funcionar bajo `/examen_grado_sis/`. `.nojekyll` evita el procesamiento Jekyll. No hace falta compilación.

## Datos y mantenimiento

- `data/questions.json`: base completa que consume la web.
- `data/revisions.json`: correcciones y explicaciones editoriales, separadas de la extracción.
- `scripts/import_docx.py`: importador reproducible con Python estándar (zip y XML). No necesita Word ni paquetes externos.
- `core.js`: mezcla, calificación, validación de sesión y exportación.
- `app.js`: interfaz y persistencia; `styles.css`: presentación adaptable.

Para regenerar el banco desde el archivo original:

```sh
python scripts/import_docx.py "/ruta/BANCO DE PREGUNTAS.docx"
node --test tests/core.test.js
```

El importador está adaptado a este Word y valida los números 1–147. Recupera la pregunta 43, que estaba pegada a la explicación de la 42, conserva saltos de línea y tablas y aplica las revisiones. El hash SHA-256 del archivo fuente se guarda en el JSON. El documento original no se publica.

Al modificar preguntas o claves, actualizar `version` en el importador para invalidar sesiones antiguas y ejecutar las pruebas. El sitio no carga scripts ni HTML desde el banco: el contenido se escapa antes de mostrarlo.

## Pruebas

```sh
node --test tests/core.test.js
```

Las pruebas comprueban integridad del banco, mezclado, puntaje, exclusión de preguntas inválidas, autoevaluación, recuperación de sesión y exportación. La interfaz se verifica también en navegador: escritorio y móvil, práctica completa, reanudación, copiado y búsqueda.

La prueba de navegador está en `tests/browser.test.mjs`. Requiere Playwright solo para desarrollo (`npm install --no-save playwright`) y Edge instalado; con el servidor local en el puerto 8765, ejecutar `node tests/browser.test.mjs`. Se pueden configurar `TEST_URL`, `BROWSER_CHANNEL` y `PLAYWRIGHT_MODULE`. Guarda capturas en `work/`, ignorado por Git. El sitio publicado no requiere estas dependencias.
