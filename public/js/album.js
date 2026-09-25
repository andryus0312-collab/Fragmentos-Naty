// 📍 public/js/album.js
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { subirArchivo } from "./storage.js";
import { initReproductor } from "./reproductor.js";
import { openLightbox } from "./lightbox.js";

const EMOJIS = ["❤️","😊","😍","🥰","😢","😂","🎉","✨","🌸","☀️","🌙","⭐","💕","😘","🤗","😌","🙏","👨‍👩‍👧‍👦","👶","🐾","📸","🌷","🎂","💛"];

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  iniciarAlbum();
});

function iniciarAlbum() {
  initReproductor();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });

  const albumGrid = document.getElementById("albumGrid");
  const addBtn = document.getElementById("addPhotoBtn");
  const modal = document.getElementById("photoModal");
  const closeModalBtn = document.getElementById("closePhotoModalBtn");
  const cancelBtn = document.getElementById("cancelPhotoBtn");
  const form = document.getElementById("photoForm");
  const fileInput = document.getElementById("photoFile");
  const captionInput = document.getElementById("photoCaption");
  const emojiBtn = document.getElementById("emojiPickerBtn");
  const emojiPanel = document.getElementById("emojiPanel");
  const previewImg = document.getElementById("photoPreview");
  const saveBtn = form ? form.querySelector(".btn-save") : null;

  function toggleModal(show) {
    if (!modal) return;
    if (show) modal.classList.add("active");
    else {
      modal.classList.remove("active");
      if (form) form.reset();
      if (previewImg) { previewImg.style.display = "none"; previewImg.src = ""; }
      if (emojiPanel) emojiPanel.classList.remove("active");
    }
  }

  if (addBtn) addBtn.addEventListener("click", () => toggleModal(true));
  if (closeModalBtn) closeModalBtn.addEventListener("click", () => toggleModal(false));
  if (cancelBtn) cancelBtn.addEventListener("click", () => toggleModal(false));
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) toggleModal(false); });

  if (fileInput) fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file && previewImg) {
      const reader = new FileReader();
      reader.onload = (e) => { previewImg.src = e.target.result; previewImg.style.display = "block"; };
      reader.readAsDataURL(file);
    }
  });

  if (emojiBtn) emojiBtn.addEventListener("click", () => {
    if (emojiPanel) emojiPanel.classList.toggle("active");
  });
  if (emojiPanel) {
    EMOJIS.forEach(emoji => {
      const span = document.createElement("span");
      span.className = "emoji-option";
      span.textContent = emoji;
      span.addEventListener("click", () => {
        if (captionInput) {
          const start = captionInput.selectionStart || captionInput.value.length;
          const end = captionInput.selectionEnd || captionInput.value.length;
          captionInput.value = captionInput.value.slice(0, start) + emoji + captionInput.value.slice(end);
          captionInput.focus();
        }
      });
      emojiPanel.appendChild(span);
    });
  }

  async function cargarAlbum() {
    if (!albumGrid) return;
    albumGrid.innerHTML = '<p style="text-align:center; color:var(--text-muted); grid-column:1/-1;">Cargando recuerdos...</p>';
    try {
      const q = query(collection(db, "album_especial"), orderBy("fecha", "desc"));
      const snap = await getDocs(q);
      if (snap.empty) {
        albumGrid.innerHTML = '<p style="text-align:center; color:var(--text-muted); grid-column:1/-1;">Aún no hay fotos aquí. ¡Agrega la primera! 💕</p>';
        return;
      }
      albumGrid.innerHTML = "";
      snap.forEach(docSnap => {
        const data = docSnap.data();
        const card = document.createElement("div");
        card.className = "polaroid";
        card.innerHTML = `
          <img src="${data.url_imagen}" alt="Recuerdo" class="polaroid-img">
          <p class="polaroid-caption">${(data.descripcion || "").replace(/</g, "&lt;")}</p>
          <button class="polaroid-delete" title="Eliminar">🗑️</button>
        `;
        card.querySelector(".polaroid-delete").addEventListener("click", async (e) => {
          e.stopPropagation();
          if (!confirm("¿Eliminar esta foto del álbum?")) return;
          await deleteDoc(doc(db, "album_especial", docSnap.id));
          cargarAlbum();
        });
        card.querySelector(".polaroid-img").addEventListener("click", () => {
          openLightbox(data.url_imagen, `album-${docSnap.id}.jpg`);
        });
        albumGrid.appendChild(card);
      });
    } catch (e) {
      console.error("Error cargando álbum:", e);
      albumGrid.innerHTML = '<p style="text-align:center; color:red; grid-column:1/-1;">Error al cargar el álbum.</p>';
    }
  }

  if (form) form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    if (!file) { alert("Elige una foto primero."); return; }
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "Subiendo..."; saveBtn.disabled = true;
    try {
      const url = await subirArchivo(file, "album");
      if (!url) { alert("Error al subir la foto."); return; }
      await addDoc(collection(db, "album_especial"), {
        url_imagen: url,
        descripcion: captionInput.value.trim(),
        fecha: serverTimestamp()
      });
      toggleModal(false);
      cargarAlbum();
    } finally {
      saveBtn.textContent = originalText; saveBtn.disabled = false;
    }
  });

  cargarAlbum();
}
