# 🧯 FRAGMENTOS — Bitácora de Errores y Soluciones
### Registro técnico de incidencias, diagnósticos y correcciones

| Dato | Valor |
|---|---|
| **Proyecto** | Fragmentos v1.0 |
| **Periodo registrado** | Fases 3 → Cierre |
| **Herramienta de diagnóstico** | Consola Eruda (móvil) + `node --check` |
| **Total de incidencias** | 10 |
| **Clasificación** | 3 fantasmas (caché) · 3 configuración · 2 despliegue · 2 código/UX |

---

## 📑 Índice
1. [Objetivo y metodología](#1-objetivo-y-metodología)
2. [Vistazo general](#2-vistazo-general)
3. [Fichas detalladas](#3-fichas-detalladas)
4. [Protocolo de diagnóstico](#4-protocolo-de-diagnóstico)
5. [Análisis y conclusiones](#5-análisis-y-conclusiones)

---

## 1. Objetivo y metodología

Este documento registra cada incidencia relevante del proyecto con el formato:
**Síntoma → Contexto → Diagnóstico inicial → Causa real → Solución → Verificación → Lección.**

Su propósito es doble: (a) dejar trazabilidad técnica del cierre del proyecto y (b) fijar un protocolo de depuración que evite repetir falsos positivos.

---

## 2. Vistazo general

| ID | Síntoma | Causa real | Categoría | Solución |
|---|---|---|---|---|
| E-01 | "Error al iniciar sesión" | Credenciales de ejemplo sin reemplazar + usuario inexistente | Configuración | Credenciales reales + Add user |
| E-02 | Nada responde tras cargar | `ui.js` con fragmentos acumulados | Código | Reescritura limpia del archivo |
| E-03 | `SyntaxError: Unexpected token '}'` | Código huérfano pegado tras el cierre del listener | Código | Reconstrucción controlada |
| E-04 | `SyntaxError: Unexpected token '=='` | Mezcla de versiones + copia corrupta (`() = >`, `& &`) | Código | Archivo nuevo y verificado |
| E-05 | `SyntaxError: Illegal return statement` | **Fantasma:** caché del navegador | Fantasma | Incógnito + `?v=n` |
| E-06 | `FirebaseError: failed-precondition` | Índice compuesto faltante; 1.º intento con `Tipo` ≠ `tipo` | Configuración | Índice `tipo` asc + `fecha` desc |
| E-07 | Warning "Multiple GoTrueClient instances" | `supabase-config.js` cargado dos veces (script + import) | Despliegue | Eliminar `<script>` duplicado |
| E-08 | Subidas a Supabase fallan | URL y anon key de ejemplo | Configuración | Credenciales reales de Supabase |
| E-09 | Cámara/documento/emojis "no hacen nada" | Inputs dentro de modal cerrado | UX | `openModalAndTrigger()` |
| E-10 | 404 al publicar en GitHub Pages | Sitio servido desde raíz, archivos en `/public` | Despliegue | `index.html` puente con meta refresh |

---

## 3. Fichas detalladas

### E-01 · Login rechazado
- **Síntoma:** mensaje genérico "Error al iniciar sesión." bajo el botón Entrar.
- **Diagnóstico inicial:** sospecha de reglas de Firestore.
- **Causa real:** `firebase-config.js` conservaba placeholders (`TU_API_KEY_AQUI`) y la cuenta no existía en Authentication.
- **Solución:** pegar credenciales reales de la consola Firebase y crear el usuario con *Add user*.
- **Verificación:** entrada correcta al dashboard.
- **Lección:** auditar placeholders antes de depurar lógica.

### E-02 · Interfaz inerte
- **Síntoma:** la página carga visualmente pero ningún control responde.
- **Causa real:** un error de sintaxis en `ui.js` detenía todo el módulo; los listeners nunca se registraban.
- **Solución:** reescritura completa y ordenada del archivo.
- **Lección:** si el HTML pinta pero el JS no vive, el módulo completo está cayendo.

### E-03 · `Unexpected token '}'`
- **Síntoma:** consola Eruda roja al cargar dashboard.
- **Causa real:** fragmentos huérfanos pegados después del cierre `});` del `DOMContentLoaded`.
- **Solución:** reconstruir el archivo desde cero, verificando que la última línea sea `});`.
- **Lección:** los pegados sucesivos acumulan basura; reemplazar ≠ appending.

### E-04 · `Unexpected token '=='`
- **Síntoma:** error persistente tras "arreglar" `firestore.js`.
- **Diagnóstico inicial (erróneo):** se sospechó del operador `"=="` dentro de `where()`.
- **Causa real:** coexistencia de varias versiones del archivo y copia corrupta desde el móvil (`addEventListe ner`, `() = >`, `& &`).
- **Solución:** archivo nuevo, sin flechas ni `&&` en la primera pasada, y verificación visual de integridad.
- **Lección:** el copiado móvil puede corromper tokens; verificar integridad del pegado.

### E-05 · `Illegal return statement` (el fantasma)
- **Síntoma:** error de sintaxis que no desaparecía con ningún cambio de código.
- **Verificación clave:** `node --check` sobre todos los `.js` → **limpios**; en **modo incógnito** el error no existía.
- **Causa real:** el navegador servía una versión vieja cacheada del script.
- **Solución:** prueba en incógnito como regla cero + versionado `?v=n` en cada `<script>`.
- **Verificación:** consola limpia en incógnito y, tras bump de versión, también en sesión normal.

![Caché vs incógnito](img/05-cache-vs-incognito.png)
*Fig. 1 — El mismo sitio: error fantasma con caché, limpio en incógnito.*

### E-06 · `failed-precondition` en categorías
- **Síntoma:** ninguna categoría cargaba fragmentos; error rojo de Firestore.
- **Causa real:** la consulta `where("tipo","==",tipo) + orderBy("fecha","desc")` exige **índice compuesto**. El primer índice se creó con el campo `Tipo` (mayúscula): Firestore distingue mayúsculas y el índice no aplicaba.
- **Solución:** borrar el índice erróneo y crear `tipo` Ascendente + `fecha` Descendente; esperar estado *Habilitado*.
- **Verificación:** tarjetas cargando en las cuatro categorías.

![Índice compuesto Firestore](img/06-indice-firestore.png)
*Fig. 2 — Índice correcto y la trampa de mayúsculas/minúsculas.*

### E-07 · Dos clientes de Supabase
- **Síntoma:** warning `Multiple GoTrueClient instances detected`.
- **Causa real:** `dashboard.html` incluía `<script src="js/supabase-config.js?v=2">` mientras `storage.js` lo importaba sin sufijo: dos URLs = dos módulos = dos clientes.
- **Solución:** eliminar el `<script>`; el módulo se carga solo vía `import`.
- **Lección:** un módulo, una única URL de carga.

### E-08 · Supabase no sube
- **Síntoma:** `subirArchivo()` devolvía `null`.
- **Causa real:** `SUPABASE_URL` y `SUPABASE_ANON_KEY` seguían como texto de ejemplo.
- **Solución:** credenciales reales desde Supabase → Settings → API.
- **Lección:** checklist de credenciales al integrar cada servicio.

### E-09 · Botones que "no hacían nada"
- **Síntoma:** cámara, documento y emojis abrían el selector o nada, sin contexto de escritura.
- **Causa real:** los `<input type="file">` vivían dentro del modal cerrado; la selección no tenía dónde mostrarse.
- **Solución:** patrón `openModalAndTrigger(fn)`: abrir modal y disparar el selector tras 300 ms.
- **Lección:** el flujo UX debe preceder al evento técnico.

### E-10 · 404 en GitHub Pages
- **Síntoma:** la URL pública no encontraba la app.
- **Causa real:** Pages sirve desde la raíz del repo; la app vive en `/public`.
- **Solución:** `index.html` puente en raíz con `meta refresh` a `public/index.html`.
- **Lección:** conocer la carpeta de publicación del host estático.

---

## 4. Protocolo de diagnóstico

![Protocolo de diagnóstico de errores](img/07-protocolo.png)
*Fig. 3 — Flujograma oficial adoptado tras el cierre.*

1. **Error en consola** → reproducir en **modo incógnito**.
2. ¿Desaparece? → **Caché:** recarga forzada o bump `?v=n`. Fin.
3. ¿Persiste? → **Validar sintaxis** (`node --check`).
4. ¿Pasa limpio? → **Revisar configuración y credenciales** (placeholders, reglas, índices, códigos exactos del error).
5. ¿No pasa? → **Corregir el código puntual**, nunca reescribir todo.
6. Registrar la incidencia en esta bitácora.

---

## 5. Análisis y conclusiones

- **30 % de los errores eran fantasmas** de caché: costo de diagnóstico alto, costo de solución nulo.
- **30 % eran configuración** (credenciales, índices, duplicados): se previenen con checklist.
- **Solo 20 % eran código real**, y todos derivaban del mismo vector: pegados acumulativos desde móvil.
- **Regla de oro adoptada:** *incógnito primero, validación después, reescritura nunca como reflejo.*

*— Fin del Documento 2 —*
