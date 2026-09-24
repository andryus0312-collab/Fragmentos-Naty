import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { guardarFragmento, cargarFragmentos } from "./firestore.js";
import { subirArchivo } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("UI iniciado");
  const root = document.documentElement;

  const lightSlider = document.getElementById('lightSlider');
  const lightOverlay = document.getElementById('lightOverlay');
  const lightToggle = document.getElementById('lightToggle');
  const bulbGlass = document.getElementById('bulbGlass');
  const bulbGlow = document.getElementById('bulbGlow');
  const bulbInterior = document.getElementById('bulbInterior');
  const filaments = [document.getElementById('filament1'), document.getElementById('filament2'), document.getElementById('filament3')].filter(el => el);

  function updateLight() {
    if (!lightSlider) return;
    const intensity = lightSlider.value / 100;
    root.style.setProperty('--light-intensity', intensity);
    if (intensity === 0) {
      if (lightOverlay) lightOverlay.classList.add('off');
      if (lightToggle) lightToggle.textContent = '🌙';
      if (bulbGlass) { bulbGlass.setAttribute('opacity', '0.3'); bulbGlass.setAttribute('fill', '#D0D0D0'); }
      if (bulbGlow) bulbGlow.setAttribute('opacity', '0');
      if (bulbInterior) bulbInterior.setAttribute('opacity', '0');
      filaments.forEach(f => f.setAttribute('stroke', '#888888'));
    } else {
      if (lightOverlay) lightOverlay.classList.remove('off');
      if (lightToggle) lightToggle.textContent = '💡';
      if (bulbGlass) { bulbGlass.setAttribute('opacity', '0.95'); bulbGlass.setAttribute('fill', '#FFF4D6'); }
      if (bulbGlow) bulbGlow.setAttribute('opacity', 0.4 + (intensity * 0.6));
      if (bulbInterior) bulbInterior.setAttribute('opacity', intensity * 0.8);
      filaments.forEach(f => { f.setAttribute('stroke', '#FF8C00'); f.setAttribute('stroke-width', 1.5 + intensity); });
    }
  }

  if (lightSlider) {
    lightSlider.addEventListener('input', updateLight);
    const hour = new Date().getHours();
    lightSlider.value = (hour >= 20 || hour < 7) ? 40 : 80;
    updateLight();
  }
  if (lightToggle) lightToggle.addEventListener('click', () => {
    lightSlider.value = (lightOverlay && lightOverlay.classList.contains('off')) ? 70 : 0;
    updateLight();
  });

  const textSizeSlider = document.getElementById('textSizeSlider');
  const textSizeToggle = document.getElementById('textSizeToggle');
  if (textSizeSlider) {
    textSizeSlider.addEventListener('input', () => {
      root.style.setProperty('--base-font-size', textSizeSlider.value + 'px');
      if (textSizeToggle) textSizeToggle.style.fontSize = (textSizeSlider.value * 1.1) + 'px';
    });
  }
  if (textSizeToggle) textSizeToggle.addEventListener('click', () => {
    textSizeSlider.value = parseInt(textSizeSlider.value) <= 16 ? 20 : 14;
    textSizeSlider.dispatchEvent(new Event('input'));
  });

  const btnDarkMode = document.getElementById('btnDarkMode');
  if (btnDarkMode) btnDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    btnDarkMode.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '';
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });

  const newFragmentBtn = document.getElementById('newFragmentBtn');
  const writeModal = document.getElementById('writeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const writeForm = document.getElementById('writeForm');
  const fragmentsContainer = document.getElementById('fragmentsContainer');
  const navItems = document.querySelectorAll('.nav-item');
  const categoryTitle = document.getElementById('categoryTitle');
  const categorySelect = document.getElementById('fragmentCategory');
  const categoryNames = { 'poesia': 'Poesía', 'prosa': 'Prosa', 'ideas': 'Ideas', 'imagenes': 'Imágenes' };
  let fragmentosEnMemoria = [];

  function toggleModal(show) {
    if (!writeModal) return;
    if (show) {
      writeModal.classList.add('active');
      if (categorySelect) {
        const activeNav = document.querySelector('.nav-item.active');
        if (activeNav) categorySelect.value = activeNav.getAttribute('data-category');
      }
    } else {
      writeModal.classList.remove('active');
      if (writeForm) writeForm.reset();
    }
  }

  if (newFragmentBtn) newFragmentBtn.addEventListener('click', () => toggleModal(true));
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));
  if (cancelBtn) cancelBtn.addEventListener('click', () => toggleModal(false));
  if (writeModal) writeModal.addEventListener('click', (e) => { if (e.target === writeModal) toggleModal(false); });

  const btnCamera = document.getElementById('btnCamera');
  const btnDoc = document.getElementById('btnDoc');
  const btnEmoji = document.querySelector('.fab-right .fab-btn');
  const fileImageInput = document.getElementById('fileImage');
  const fileDocInput = document.getElementById('fileDoc');
  const filePreviewArea = document.getElementById('filePreview');
  const fileNameText = document.getElementById('fileName');
  const imagePreview = document.getElementById('imagePreview');
  const removeFileBtn = document.getElementById('removeFileBtn');
  let selectedFile = null;
  let selectedFileType = null;

  function openModalAndTrigger(fn) {
    toggleModal(true);
    setTimeout(() => { if (fn) fn(); }, 300);
  }

  if (btnCamera) btnCamera.addEventListener('click', () => openModalAndTrigger(() => fileImageInput && fileImageInput.click()));
  if (btnDoc) btnDoc.addEventListener('click', () => openModalAndTrigger(() => fileDocInput && fileDocInput.click()));
  if (btnEmoji) btnEmoji.addEventListener('click', () => openModalAndTrigger(null));

  function handleFileSelect(event, type) {
    const file = event.target.files[0];
    if (file) {
      selectedFile = file;
      selectedFileType = type;
      if (filePreviewArea) filePreviewArea.style.display = 'block';
      if (fileNameText) fileNameText.textContent = 'Archivo: ' + file.name;
      if (type === 'imagen' && imagePreview) {
        const reader = new FileReader();
        reader.onload = (e) => { imagePreview.src = e.target.result; imagePreview.style.display = 'block'; };
        reader.readAsDataURL(file);
      } else if (imagePreview) imagePreview.style.display = 'none';
    }
  }

  if (fileImageInput) fileImageInput.addEventListener('change', (e) => handleFileSelect(e, 'imagen'));
  if (fileDocInput) fileDocInput.addEventListener('change', (e) => handleFileSelect(e, 'documento'));
  if (removeFileBtn) removeFileBtn.addEventListener('click', () => {
    selectedFile = null; selectedFileType = null;
    if (filePreviewArea) filePreviewArea.style.display = 'none';
    if (fileImageInput) fileImageInput.value = '';
    if (fileDocInput) fileDocInput.value = '';
  });

  if (categorySelect) categorySelect.addEventListener('change', (e) => {
    const cat = e.target.value;
    navItems.forEach(nav => {
      nav.classList.remove('active');
      if (nav.getAttribute('data-category') === cat) nav.classList.add('active');
    });
    if (categoryTitle && categoryNames[cat]) categoryTitle.textContent = categoryNames[cat];
  });

  async function renderFragmentos(tipo) {
    if (!fragmentsContainer) return;
    fragmentsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">Cargando...</p>';
    try {
      const fragmentos = await cargarFragmentos(tipo);
      fragmentosEnMemoria = fragmentos;
      fragmentsContainer.innerHTML = '';
      if (fragmentos.length === 0) {
        fragmentsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">Aún no hay fragmentos. ¡Sé el primero!</p>';
        return;
      }
      fragmentos.forEach(frag => {
        let fechaStr = "Reciente";
        if (frag.fecha && frag.fecha.seconds) {
          const date = new Date(frag.fecha.seconds * 1000);
          fechaStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        let archivoHTML = '';
        if (frag.url_archivo) {
          if (frag.tipo_archivo === 'imagen') archivoHTML = '<img src="' + frag.url_archivo + '" class="card-image">';
          else if (frag.tipo_archivo === 'documento') archivoHTML = '<a href="' + frag.url_archivo + '" target="_blank" class="card-doc-link">📄 Ver Documento</a>';
        }
        const card = document.createElement('div');
        card.className = 'fragment-card';
        card.innerHTML = '<div class="card-meta">' + fechaStr + '</div><h3 class="card-title">' + (frag.titulo || 'Sin título') + '</h3>' + archivoHTML + '<p class="card-text">' + (frag.contenido ? frag.contenido.replace(/\n/g, '<br>') : '') + '</p>';
        fragmentsContainer.appendChild(card);
      });
    } catch (e) {
      console.error("Error cargando:", e);
      fragmentsContainer.innerHTML = '<p style="text-align:center; color:red; padding:20px;">Error al cargar.</p>';
    }
  }

  if (writeForm) writeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('fragmentTitle').value.trim();
    const contenido = document.getElementById('fragmentText').value.trim();
    const tipo = categorySelect ? categorySelect.value : 'poesia';
    if (!contenido && !selectedFile) { alert("Escribe algo o adjunta un archivo."); return; }
    const btnSave = writeForm.querySelector('.btn-save');
    const originalText = btnSave.textContent;
    btnSave.textContent = "Procesando..."; btnSave.disabled = true;
    let urlArchivo = null, tipoArchivo = null;
    if (selectedFile) {
      btnSave.textContent = "Subiendo...";
      urlArchivo = await subirArchivo(selectedFile, selectedFileType === 'imagen' ? 'fotos' : 'documentos');
      tipoArchivo = selectedFileType;
      if (!urlArchivo) { alert("Error al subir."); btnSave.textContent = originalText; btnSave.disabled = false; return; }
    }
    btnSave.textContent = "Guardando...";
    const result = await guardarFragmento(tipo, titulo, contenido, urlArchivo, tipoArchivo);
    if (result.success) { toggleModal(false); renderFragmentos(tipo); }
    else alert("Error: " + result.error);
    btnSave.textContent = originalText; btnSave.disabled = false;
    selectedFile = null; selectedFileType = null;
    if (filePreviewArea) filePreviewArea.style.display = 'none';
    if (fileImageInput) fileImageInput.value = '';
    if (fileDocInput) fileDocInput.value = '';
  });

  navItems.forEach(item => item.addEventListener('click', () => {
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    const cat = item.getAttribute('data-category');
    if (categoryTitle && categoryNames[cat]) categoryTitle.textContent = categoryNames[cat];
    renderFragmentos(cat);
  }));

  const initialCat = document.querySelector('.nav-item.active') ? document.querySelector('.nav-item.active').getAttribute('data-category') : 'poesia';
  renderFragmentos(initialCat);

  const btnSearch = document.getElementById('btnSearch');
  const searchModal = document.getElementById('searchModal');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (btnSearch) btnSearch.addEventListener('click', () => {
    if (searchModal) { searchModal.classList.add('active'); if (searchInput) { searchInput.value = ''; searchInput.focus(); } }
  });
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', () => searchModal && searchModal.classList.remove('active'));
  if (searchModal) searchModal.addEventListener('click', (e) => { if (e.target === searchModal) searchModal.classList.remove('active'); });
  if (searchInput) searchInput.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase().trim();
    if (!searchResults) return;
    if (texto.length < 2) { searchResults.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Escribe al menos 2 caracteres...</p>'; return; }
    const resultados = fragmentosEnMemoria.filter(f => (f.titulo || '').toLowerCase().includes(texto) || (f.contenido || '').toLowerCase().includes(texto));
    if (resultados.length === 0) searchResults.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No se encontraron.</p>';
    else {
      searchResults.innerHTML = '';
      resultados.forEach(frag => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = '<div class="search-result-title">' + (frag.titulo || 'Sin título') + '</div><div class="search-result-text">' + (frag.contenido || '') + '</div>';
        item.addEventListener('click', () => searchModal.classList.remove('active'));
        searchResults.appendChild(item);
      });
    }
  });

  const btnExport = document.getElementById('btnExport');
  if (btnExport) btnExport.addEventListener('click', async () => {
    if (!fragmentsContainer || fragmentsContainer.children.length === 0) { alert("No hay fragmentos."); return; }
    if (typeof html2pdf === 'undefined') { alert("Librería PDF no cargó."); return; }
    btnExport.textContent = '⏳'; btnExport.disabled = true;
    try {
      await html2pdf().set({ margin: 15, filename: 'Fragmentos.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4' } }).from(fragmentsContainer).save();
    } catch (err) { console.error(err); }
    finally { btnExport.textContent = '📥'; btnExport.disabled = false; }
  });

  console.log("Todo listo");
});
