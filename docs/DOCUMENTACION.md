# 📖 FRAGMENTOS — Documentación Técnica y de Proceso
### Espacio privado de creación · Escritura, memoria y arte

| Dato | Valor |
|---|---|
| **Proyecto** | Fragmentos |
| **Versión** | 1.0 (estable) |
| **Fecha de cierre** | Septiembre 2026 |
| **Usuario final** | Naty (autoría privada) |
| **Hosting** | GitHub Pages |
| **URL** | `andryus0312-collab.github.io/Fragmentos-Naty/public/` |
| **Estado** | ✅ En producción |
| **Metodología de construcción** | Iterativa, asistida por IA, 100 % gestionada desde móvil |

---

## 📑 Índice
1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Contexto y objetivos](#2-contexto-y-objetivos)
3. [Stack tecnológico](#3-stack-tecnológico)
4. [Arquitectura del sistema](#4-arquitectura-del-sistema)
5. [Diseño visual e interfaz](#5-diseño-visual-e-interfaz)
6. [Proceso de construcción (8 fases)](#6-proceso-de-construcción-8-fases)
7. [Catálogo de funcionalidades](#7-catálogo-de-funcionalidades)
8. [Seguridad y privacidad](#8-seguridad-y-privacidad)
9. [Despliegue y gestión de caché](#9-despliegue-y-gestión-de-caché)
10. [Resultado final](#10-resultado-final)
11. [Lecciones aprendidas](#11-lecciones-aprendidas)
12. [Anexos](#12-anexos)

---

## 1. Resumen ejecutivo

**Fragmentos** es una aplicación web privada de escritura creativa construida para una sola usuaria final (Naty). Permite redactar y clasificar textos en cuatro categorías (Poesía, Prosa, Ideas, Imágenes), adjuntar fotografías y documentos, buscar entre sus escritos y exportarlos a PDF, todo bajo autenticación por correo y contraseña.

El proyecto se construyó de forma iterativa en **8 fases**, sin computadora: todo el código fue escrito, versionado y desplegado desde un teléfono móvil mediante la interfaz web de GitHub. El backend se resolvió con servicios gratuitos en la nube: **Firebase** (autenticación y base de datos) y **Supabase** (almacenamiento de archivos), con hosting estático en **GitHub Pages**.

---

## 2. Contexto y objetivos

### 2.1 Contexto
Naty necesitaba un lugar íntimo en internet para preservar sus escritos: un diario creativo que no apareciera en buscadores, que nadie más pudiera leer y que funcionara bien desde el celular.

### 2.2 Requisitos funcionales originales
| # | Requisito | Prioridad |
|---|---|---|
| R1 | Acceso privado con login (correo + contraseña) | Alta |
| R2 | URL discreta / camuflada, sin indexar en buscadores | Alta |
| R3 | Cuatro categorías de escritura con navegación propia | Alta |
| R4 | Subida de fotos y documentos adjuntos | Alta |
| R5 | Buscador por palabra clave | Media |
| R6 | Exportación de escritos a PDF | Media |
| R7 | Control de luz ambiental y tamaño de texto (accesibilidad) | Media |
| R8 | Modo oscuro | Media |

### 2.3 Restricciones técnicas
- **Sin PC:** toda la gestión (código, commits, despliegue, consolas de servicios) se realizó desde móvil.
- **Coste cero:** solo servicios con capa gratuita (GitHub, Firebase, Supabase).
- **Accesible desde Cuba:** sin dependencias de pago ni tarjetas de crédito.

---

## 3. Stack tecnológico

| Capa | Tecnología | Rol | Justificación |
|---|---|---|---|
| Frontend | HTML5 + CSS3 + JavaScript vanilla (módulos ES) | Interfaz y lógica de cliente | Sin build steps: compatible con edición desde móvil |
| Hosting | GitHub Pages | Servir el sitio estático | Integrado al repositorio, gratuito |
| Autenticación | Firebase Authentication | Login por correo/contraseña | Reglas simples, un solo usuario |
| Base de datos | Cloud Firestore | Textos, títulos, categorías, fechas | NoSQL documental, tiempo real |
| Almacenamiento | Supabase Storage | Fotos y documentos (bucket `fragmentos`) | URLs públicas controladas por política |
| Librería PDF | html2pdf.js (CDN) | Exportar vistas a PDF A4 | Client-side, sin servidor |
| Depuración móvil | Eruda (CDN) | Consola de desarrollador en el celular | Esencial al no tener PC |
| Tipografías | Playfair Display + Inter (Google Fonts) | Identidad visual | Serif literaria + sans legible |

---

## 4. Arquitectura del sistema

![Arquitectura técnica de Fragmentos](img/01-arquitectura.png)
*Fig. 1 — Arquitectura de tres bloques: frontend estático, Firebase y Supabase.*

### 4.1 Flujos principales
1. **Login:** el frontend valida credenciales contra Firebase Authentication; si son correctas, redirige a `dashboard.html`.
2. **Lectura/escritura:** `firestore.js` consulta y escribe la colección `fragmentos` (`where tipo == categoría` + `orderBy fecha desc`).
3. **Archivos:** `storage.js` sube el archivo a Supabase (`fotos/` o `documentos/`) con nombre único (`Date.now() + extensión`) y devuelve la URL pública, que se guarda como campo del documento en Firestore.
4. **Exportación:** `html2pdf.js` captura el contenedor de tarjetas visibles y genera el PDF en el dispositivo.

### 4.2 Estructura del repositorio
```text
Fragmentos-Naty/
├── index.html                  ← Puente de redirección a /public (GitHub Pages)
└── public/
    ├── index.html              ← Pantalla de login
    ├── dashboard.html          ← Aplicación principal
    ├── css/
    │   ├── auth.css            ← Estilos del login
    │   └── dashboard.css       ← Estilos del dashboard (variables CSS)
    └── js/
        ├── firebase-config.js  ← Credenciales y exports (auth, db)
        ├── supabase-config.js  ← Cliente Supabase
        ├── auth.js             ← Lógica de inicio de sesión
        ├── firestore.js        ← guardarFragmento() / cargarFragmentos()
        ├── storage.js          ← subirArchivo()
        └── ui.js               ← Toda la lógica visual e interacción
```

---

## 5. Diseño visual e interfaz

### 5.1 Paleta de color
| Token | Hex | Uso |
|---|---|---|
| Fondo principal | `#A8CBE0` | Azul sereno del escritorio |
| Barra de navegación | `#154B75` | Azul profundo |
| Acento primario | `#1F7A4C` | Verde botón de acción |
| Texto principal | `#0A1628` | Contraste en modo claro |
| Tarjeta de login | `#1E1E1E` | Modo oscuro por defecto |

### 5.2 Componentes signature
- **Lámpara interactiva (SVG):** su brillo, el cono de luz y el overlay ambiental responden al slider de intensidad mediante la variable CSS `--light-intensity` y atributos SVG dinámicos (`opacity`, `fill`, `stroke`).
- **Sliders verticales gemelos:** tamaño de texto (`--base-font-size`, 12–24 px) e intensidad de luz (0–100).
- **Clusters FAB:** izquierda (buscar 🔍, exportar 📥, modo oscuro 🌙) y derecha (emojis 😊, cámara 📷, documento 📄), más botón de corazón ❤️ y widget musical añadidos en el cierre.
- **Modal de escritura:** título opcional, selector de categoría, área de texto, vista previa de archivo adjunto y pie con Cancelar/Guardar.

![Pantalla de login](img/02-login.png)
*Fig. 2 — Login: tarjeta oscura sobre fondo #A8CBE0.*

![Dashboard principal](img/03-dashboard.png)
*Fig. 3 — Dashboard: lámpara, sliders, categorías y clusters de acción.*

---

## 6. Proceso de construcción (8 fases)

![Línea de tiempo del proyecto](img/04-timeline.png)
*Fig. 4 — Las ocho fases de construcción, de la planificación al despliegue.*

### Fase 1 — Planificación y servicios
- Alta del proyecto Firebase (`fragmentos-naty`): Authentication (email/password), Firestore y reglas iniciales.
- Alta de Supabase: bucket `fragmentos` con carpetas `fotos/` y `documentos/`, política de subida y bucket marcado público para lectura.
- **Artefacto:** credenciales y definición de datos (`tipo, titulo, contenido, url_archivo, tipo_archivo, fecha`).

### Fase 2 — Repositorio y estructura
- Creación del repo `Fragmentos-Naty` en GitHub y del árbol `public/` (css, js, html).
- **Artefacto:** esqueleto versionado, flujo de trabajo 100 % móvil (Add file / Commit changes).

### Fase 3 — Login y diseño visual
- `index.html` + `auth.css`: tarjeta centrada, tipografía Playfair, meta `noindex, nofollow`.
- `auth.js` con `signInWithEmailAndPassword` y redirección a dashboard.
- **Artefacto:** puerta de entrada privada funcional.

### Fase 4 — Dashboard interactivo
- `dashboard.html` + `dashboard.css`: lámpara SVG, sliders, modo oscuro, barra de categorías, clusters FAB.
- `ui.js` (bloque visual): variables CSS `--light-intensity` y `--base-font-size`, toggle de tema, cierre de sesión.
- **Artefacto:** ambiente regulable y navegación por categorías.

### Fase 5 — Modal de escritura y Firestore
- Modal con formulario (`writeForm`), selector de categoría y vista previa de adjuntos.
- `firestore.js`: `guardarFragmento()` con `serverTimestamp()` y `cargarFragmentos()` con consulta compuesta.
- Render dinámico de tarjetas (`fragment-card`) con fecha formateada `es-ES`.
- **Artefacto:** ciclo completo escribir → guardar → leer.

### Fase 6 — Archivos con Supabase
- `storage.js`: `subirArchivo()` con nombre único y `getPublicUrl()`.
- Botones cámara/documento con patrón `openModalAndTrigger()`: abren el modal y disparan el selector de archivos 300 ms después.
- Vista previa de imagen con `FileReader` y botón "Quitar archivo".
- **Artefacto:** adjuntos visibles en las tarjetas (`.card-image`, `.card-doc-link`).

### Fase 7 — Búsqueda y exportación PDF
- Modal de búsqueda con filtrado en memoria (`fragmentosEnMemoria`) sobre título y contenido.
- Integración de `html2pdf.js` con `useCORS: true` (imprescindible para imprimir imágenes de Supabase).
- **Artefacto:** lupa funcional y descarga A4 por categoría.

### Fase 8 — Seguridad y despliegue
- Reglas de Firestore: `allow read, write: if request.auth != null;`.
- Usuario creado manualmente en Authentication (sin registro público).
- GitHub Pages desde rama `main` + `index.html` puente con `meta refresh` hacia `public/index.html`.
- **Artefacto:** sitio en línea con URL discreta y acceso restringido.

### Cierre — Estabilización y añadidos finales
- Ajustes de contraste en modo claro, selector de categoría dentro del modal, widget musical "Sin canción" y botón de corazón ❤️.
- Adopción del protocolo de diagnóstico (incógnito → validación → configuración).

---

## 7. Catálogo de funcionalidades

| Funcionalidad | Descripción | Estado |
|---|---|---|
| Login privado | Correo + contraseña, sin registro público | ✅ |
| Categorías | Poesía, Prosa, Ideas, Imágenes con título dinámico | ✅ |
| Escritura | Modal con título opcional, texto y categoría | ✅ |
| Adjuntos | Fotos (vista previa) y documentos PDF/DOC | ✅ |
| Búsqueda | Filtrado en tiempo real por título y contenido | ✅ |
| Exportar PDF | A4 vertical con imágenes embebidas | ✅ |
| Luz ambiental | Slider 0–100 con lámpara y overlay reactivos | ✅ |
| Tamaño de texto | Slider 12–24 px vía variable CSS | ✅ |
| Modo oscuro | Toggle global de tema | ✅ |
| Música y afecto | Widget musical y botón de corazón (cierre) | ✅ |

---

## 8. Seguridad y privacidad

1. **Autenticación obligatoria:** las reglas de Firestore exigen `request.auth != null` para leer y escribir.
2. **Sin indexación:** `<meta name="robots" content="noindex, nofollow">` en ambas páginas.
3. **URL discreta:** ruta larga de GitHub Pages, no difundida ni enlazada externamente.
4. **Usuario único:** la cuenta se creó manualmente en la consola de Firebase; no existe flujo de registro.
5. **Storage con política:** el bucket acepta escrituras autenticadas y lecturas públicas controladas (necesario para `useCORS` del PDF).

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 9. Despliegue y gestión de caché

- **Hosting:** GitHub Pages, rama `main`, carpeta raíz con puente:
```html
<meta http-equiv="refresh" content="0; url=public/index.html">
```
- **Cache-busting:** los `<script type="module">` se versionan con parámetro (`?v=2`, `?v=3`…) en cada cambio de lógica, para forzar descarga fresca.
- **Regla de prueba:** toda verificación se realiza en **modo incógnito** antes de tocar código (ver Documento 2).

---

## 10. Resultado final

![Resultado final en móvil](img/08-final-movil.png)
*Fig. 5 — Vista móvil oficial de cierre.*

![Resultado final en escritorio](img/09-final-escritorio.png)
*Fig. 6 — Vista escritorio oficial de cierre.*

El sitio quedó en producción con todas las funcionalidades del catálogo operativas y sin errores en consola.

---

## 11. Lecciones aprendidas

1. **La caché simula bugs:** un error de sintaxis "imposible de arreglar" era una copia vieja del script en el navegador.
2. **Leer el `code` del error:** `failed-precondition` ≠ bug de código; es un índice compuesto faltante.
3. **Mayúsculas importan:** en Firestore, `Tipo` ≠ `tipo`.
4. **Un módulo, una URL:** cargar el mismo archivo con y sin `?v=` crea instancias duplicadas (GoTrueClient).
5. **Validar antes de reescribir:** `node --check` evita reescribir código sano.
6. **Mobile-first real:** todo el ciclo de vida del proyecto cupo en un teléfono.

---

## 12. Anexos

### 12.1 Registro de capturas del proceso
| Archivo | Contenido | Momento |
|---|---|---|
| `img/10-consola-syntaxerror.png` | Consola Eruda con `SyntaxError` | Depuración Fase 8 |
| `img/11-consola-failed-precondition.png` | `FirebaseError: failed-precondition` | Carga de categorías |
| `img/12-firebase-config-placeholders.png` | Credenciales de ejemplo sin reemplazar | Diagnóstico login |
| `img/13-indice-creandose.png` | Panel de índices de Firestore ("Creando…") | Solución E-05 |

### 12.2 Glosario
- **Bucket:** contenedor de archivos en Supabase Storage.
- **Índice compuesto:** estructura que Firestore exige para combinar `where` + `orderBy`.
- **Cache-busting:** técnica de versionar URLs (`?v=n`) para invalidar caché.
- **FAB:** botón de acción flotante.
- **Modal:** ventana emergente superpuesta a la interfaz.

*— Fin del Documento 1 —*
