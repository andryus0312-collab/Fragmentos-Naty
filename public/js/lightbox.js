// 📍 public/js/lightbox.js
// Visor de imagen en tamaño completo, reutilizable en cualquier página del sitio.
let overlay, imgEl, downloadBtn, closeBtn;

function crearLightbox() {
  if (overlay) return;
  overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <button class="lightbox-close" title="Cerrar">&times;</button>
    <img class="lightbox-img" src="" alt="Imagen ampliada">
    <a class="lightbox-download" href="#">⬇️ Descargar</a>
  `;
  document.body.appendChild(overlay);
  imgEl = overlay.querySelector(".lightbox-img");
  downloadBtn = overlay.querySelector(".lightbox-download");
  closeBtn = overlay.querySelector(".lightbox-close");

  closeBtn.addEventListener("click", cerrarLightbox);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) cerrarLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarLightbox(); });
}

function cerrarLightbox() {
  if (overlay) overlay.classList.remove("active");
}

export function openLightbox(url, nombreArchivo) {
  crearLightbox();
  imgEl.src = url;
  overlay.classList.add("active");

  downloadBtn.onclick = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(url, { mode: "cors" });
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = nombreArchivo || "imagen.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Si el navegador bloquea la descarga directa por CORS, la abrimos en pestaña nueva como respaldo.
      window.open(url, "_blank");
    }
  };
}
