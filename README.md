<p align="center">
  <img src="https://img.shields.io/badge/Estado-✅%20En%20Producción-1F7A4C?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Versión-1.0-154B75?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Licencia-Privada-E53E3E?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Hosting-GitHub%20Pages-181717?style=for-the-badge&logo=github" />
  <img src="https://img.shields.io/badge/Construido%20desde-📱%20Móvil-A8CBE0?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Metodología-Mobile%20First-1F7A4C?style=flat-square" />
</p>

<br>

<h1 align="center">📖 FRAGMENTOS</h1>
<h3 align="center"><em>Espacio privado de creación · Escritura, memoria y arte</em></h3>

<p align="center">
  <a href="https://andryus0312-collab.github.io/Fragmentos-Naty/public/" target="_blank">
    <img src="https://img.shields.io/badge/🌐%20Visitar%20el%20sitio-1F7A4C?style=for-the-badge" />
  </a>
  <a href="./docs/DOCUMENTACION.md" target="_blank">
    <img src="https://img.shields.io/badge/📘%20Documentación-154B75?style=for-the-badge" />
  </a>
  <a href="./docs/ERRORES.md" target="_blank">
    <img src="https://img.shields.io/badge/🧯%20Bitácora%20de%20errores-E53E3E?style=for-the-badge" />
  </a>
</p>

<br>

---

## 🌿 Sobre el proyecto

**Fragmentos** es una aplicación web privada de escritura creativa, construida como diario íntimo para una única usuaria final. Permite redactar textos, clasificarlos por categorías, adjuntar fotografías y documentos, buscar entre los escritos y exportarlos a PDF, todo bajo acceso restringido por correo y contraseña.

> *"Un rincón propio en internet: discreto, sin indexar, seguro y diseñado para que las palabras vivan tranquilas."*

<p align="center">
  <img src="docs/img/08-final-movil.png" width="300" alt="Vista móvil" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="docs/img/09-final-escritorio.png" width="500" alt="Vista escritorio" />
</p>

---

## ✨ Características

| Categoría | Funcionalidades |
|---|---|
| 🔐 **Privacidad** | Login único, sin registro público, URL discreta, `noindex/nofollow` |
| ✍️ **Escritura** | Modal con título, texto y selector de categoría en tiempo real |
| 🗂️ **Categorías** | Poesía · Prosa · Ideas · Imágenes, con navegación dinámica |
| 📎 **Adjuntos** | Subida de fotos y documentos a Supabase Storage |
| 🔍 **Búsqueda** | Filtrado en tiempo real por título y contenido |
| 📥 **Exportación** | PDF A4 con imágenes embebidas vía `html2pdf.js` |
| 💡 **Ambiente** | Lámpara SVG reactiva + slider de intensidad de luz |
| 📏 **Accesibilidad** | Slider de tamaño de texto (12–24 px) vía variable CSS |
| 🌙 **Temas** | Modo claro y modo oscuro con toggle global |
| 🎵 **Detalles** | Widget musical y botón de corazón (cierre del proyecto) |

---

## 🛠️ Stack tecnológico

---

## 📂 Estructura del repositorio

```text
Fragmentos-Naty/
│
├── README.md                      ← Este archivo
├── index.html                     ← Puente meta-refresh a /public (GitHub Pages)
│
├── public/
│   ├── index.html                 ← Pantalla de login
│   ├── dashboard.html             ← Aplicación principal
│   │
│   ├── css/
│   │   ├── auth.css               ← Estilos del login
│   │   └── dashboard.css          ← Estilos del dashboard + variables CSS
│   │
│   └── js/
│       ├── firebase-config.js     ← Credenciales Firebase (auth, db)
│       ├── supabase-config.js     ← Cliente Supabase
│       ├── auth.js                ← Lógica de inicio de sesión
│       ├── firestore.js           ← guardarFragmento / cargarFragmentos
│       ├── storage.js             ← subirArchivo a Supabase
│       └── ui.js                  ← Lógica visual e interacción completa
│
└── docs/
    ├── DOCUMENTACION.md           ← 📘 Documentación técnica y de proceso
    ├── ERRORES.md                 ← 🧯 Bitácora de errores y soluciones
    ├── Fragmentos_Documentacion_Completa.doc  ← 📄 Versión Word
    └── img/                       ← Capturas y diagramas del proyecto
```

---

## 🎨 Paleta de color

| Token | Hex | Uso |
|---|---|---|
| 🟦 Fondo principal | `#A8CBE0` | Azul sereno del escritorio |
| 🟦 Barra de navegación | `#154B75` | Azul profundo |
| 🟩 Acento primario | `#1F7A4C` | Verde de acción |
| ⬛ Texto principal | `#0A1628` | Contraste en modo claro |
| ⬛ Tarjeta login | `#1E1E1E` | Modo oscuro por defecto |

---

## 🚀 Metodología de construcción

Este proyecto tiene una característica poco común: **se construyó íntegramente desde un teléfono móvil**, sin computadora. Todo el ciclo —código, commits, consolas de servicios, despliegue— se operó desde la interfaz web de GitHub y herramientas de depuración móvil.

**8 fases de desarrollo:**

1. 🗺️ **Planificación y servicios** → alta de Firebase y Supabase
2. 📦 **Repositorio y estructura** → árbol de archivos en GitHub
3. 🔐 **Login y diseño visual** → `index.html` + `auth.css`
4. 💡 **Dashboard interactivo** → lámpara SVG, sliders, modo oscuro
5. ✍️ **Modal de escritura y Firestore** → ciclo escribir/guardar/leer
6. 📎 **Archivos con Supabase** → fotos y documentos adjuntos
7. 🔍 **Búsqueda y exportación PDF** → lupa funcional y descarga A4
8. 🚀 **Seguridad y despliegue** → reglas, usuario único y GitHub Pages

---

## 🔒 Seguridad

| Medida | Implementación |
|---|---|
| Autenticación obligatoria | `request.auth != null` en reglas de Firestore |
| Sin indexación | `<meta name="robots" content="noindex, nofollow">` |
| URL discreta | Ruta larga de GitHub Pages, no difundida |
| Usuario único | Cuenta creada manualmente; no hay flujo de registro |
| Storage con política | Escrituras autenticadas; lecturas públicas controladas |

---

## 📖 Documentación

El proyecto cuenta con tres documentos oficiales dentro de la carpeta `docs/`:

| Documento | Contenido |
|---|---|
| 📘 [DOCUMENTACION.md](./docs/DOCUMENTACION.md) | Arquitectura, stack, proceso de construcción, seguridad, resultado |
| 🧯 [ERRORES.md](./docs/ERRORES.md) | 10 fichas de incidencias: síntomas, diagnósticos, soluciones y lecciones |
| 📄 [Fragmentos_Documentacion_Completa.doc](./docs/Fragmentos_Documentacion_Completa.doc) | Versión Word profesional descargable |

---

## 📊 Estado del proyecto

| Módulo | Estado |
|---|---|
| Frontend | ✅ Estable |
| Login / Auth | ✅ Estable |
| CRUD de fragmentos | ✅ Estable |
| Subida de archivos | ✅ Estable |
| Búsqueda | ✅ Estable |
| Exportación PDF | ✅ Estable |
| Hosting | ✅ En producción |

---

## 🧠 Lecciones aprendidas

> *"La caché simula bugs. Leer el code exacto del error. Las mayúsculas importan. Un módulo, una URL. Validar antes de reescribir. Incógnito primero."*

El cierre del proyecto dejó un protocolo de diagnóstico formal que hoy es parte de la bitácora: **incógnito primero, validación después, reescritura nunca como reflejo.**

---

## 🤝 Créditos

- **Desarrollo y dirección:** [@andryus0312-collab](https://github.com/andryus0312-collab)
- **Asistencia técnica:** IA conversacional (iteración asistida)
- **Destinataria:** Naty 🌴
- **Cierre del proyecto:** Septiembre 2026

---

<p align="center">
  <br>
  <img src="https://img.shields.io/badge/Hecho%20con%20❤️%20-Amor%20para%20Naty-FF6B9D?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Desde-Cuba%20🇨🇺-154B75?style=for-the-badge" />
</p>

<p align="center">
  <br>
  <sub>✨ <b>Un camión de cariño, construido palabra por palabra desde Cuba, para que Naty tenga su propio rincón en internet.</b> ✨</sub>
</p>

<p align="center">
  <sub>🌴 📖 🌙 💡 🎵</sub>
</p>
