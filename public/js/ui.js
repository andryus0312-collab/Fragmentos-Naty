import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ UI iniciado");
  const root = document.documentElement;

  // LUZ
  const lightSlider = document.getElementById('lightSlider');
  const lightOverlay = document.getElementById('lightOverlay');
  const lightToggle = document.getElementById('lightToggle');
  
  if (lightSlider) {
    lightSlider.addEventListener('input', () => {
      const val = lightSlider.value / 100;
      root.style.setProperty('--light-intensity', val);
      if (lightOverlay) {
        if (val === 0) lightOverlay.classList.add('off');
        else lightOverlay.classList.remove('off');
      }
      if (lightToggle) lightToggle.textContent = val === 0 ? '🌙' : '💡';
    });
    lightSlider.value = 70;
    lightSlider.dispatchEvent(new Event('input'));
  }

  // TEXTO
  const textSizeSlider = document.getElementById('textSizeSlider');
  if (textSizeSlider) {
    textSizeSlider.addEventListener('input', () => {
      root.style.setProperty('--base-font-size', textSizeSlider.value + 'px');
    });
  }

  // MODO OSCURO
  const btnDark = document.getElementById('btnDarkMode');
  if (btnDark) {
    btnDark.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      btnDark.textContent = document.body.classList.contains('dark-mode') ? '️' : '🌙';
    });
  }

  // CERRAR SESIÓN
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut(auth);
      window.location.href = "index.html";
    });
  }

  // MODAL
  const modal = document.getElementById('writeModal');
  const btnNew = document.getElementById('newFragmentBtn');
  const btnClose = document.getElementById('closeModalBtn');
  const btnCancel = document.getElementById('cancelBtn');

  if (btnNew) btnNew.addEventListener('click', () => modal && modal.classList.add('active'));
  if (btnClose) btnClose.addEventListener('click', () => modal && modal.classList.remove('active'));
  if (btnCancel) btnCancel.addEventListener('click', () => modal && modal.classList.remove('active'));
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  console.log("✅ Todo listo - botones activos");
});== 'imagen' ? 'fotos' : 'documentos');
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

  const initialCat = document.querySelector('.nav-item.active')?.getAttribute('data-category') || 'poesia';
  renderFragmentos(initialCat);

  // BÚSQUEDA
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
        item.innerHTML = `<div class="search-result-title">${frag.titulo || 'Sin título'}</div><div class="search-result-text">${frag.contenido || ''}</div>`;
        item.addEventListener('click', () => searchModal.classList.remove('active'));
        searchResults.appendChild(item);
      });
    }
  });

  // PDF
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

  console.log("✅ Todo listo");
});datos)
            btnSave.textContent = "Guardando escrito...";
            const result = await guardarFragmento(tipo, titulo, contenido, urlArchivo, tipoArchivo);

            if (result.success) {
                toggleModal(false); // Cerrar modal
                renderFragmentos(tipo); // Recargar lista
            } else {
                alert("Error al guardar en la base de datos: " + result.error);
            }

            // Limpiar formulario y estado
            btnSave.textContent = originalText;
            btnSave.disabled = false;
            selectedFile = null;
            selectedFileType = null;
            filePreviewArea.style.display = 'none';
            fileImageInput.value = '';
            fileDocInput.value = '';
        });
                                   }

    // Cambiar de categoría (Poesía, Prosa, etc.)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const category = item.getAttribute('data-category');
            if (categoryTitle && categoryNames[category]) categoryTitle.textContent = categoryNames[category];
            renderFragmentos(category); // Cargar los datos de la nueva categoría
        });
    });

    // Cargar los datos iniciales al abrir la página
    const initialCategory = document.querySelector('.nav-item.active')?.getAttribute('data-category') || 'poesia';
    renderFragmentos(initialCategory);
    
    // --- 6. LÓGICA DE BÚSQUEDA ---
    const btnSearch = document.getElementById('btnSearch');
    const searchModal = document.getElementById('searchModal');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Abrir y cerrar modal de búsqueda
    if (btnSearch) btnSearch.addEventListener('click', () => {
        searchModal.classList.add('active');
        searchInput.value = '';
        searchResults.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Empieza a escribir para buscar...</p>';
        setTimeout(() => searchInput.focus(), 100); // Enfocar el input automáticamente
    });
    if (closeSearchBtn) closeSearchBtn.addEventListener('click', () => searchModal.classList.remove('active'));
    if (searchModal) searchModal.addEventListener('click', (e) => { if (e.target === searchModal) searchModal.classList.remove('active'); });

    // Función para buscar
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase().trim();
            
            if (texto.length < 2) {
                searchResults.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Escribe al menos 2 caracteres...</p>';
                return;
            }

            // Filtrar los fragmentos en memoria
            const resultados = fragmentosEnMemoria.filter(frag => {
                const titulo = (frag.titulo || '').toLowerCase();
                const contenido = (frag.contenido || '').toLowerCase();
                return titulo.includes(texto) || contenido.includes(texto);
            });

            // Mostrar resultados
            if (resultados.length === 0) {
                searchResults.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No se encontraron fragmentos con ese texto.</p>';
            } else {
                searchResults.innerHTML = '';
                resultados.forEach(frag => {
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.innerHTML = `
                        <div class="search-result-title">${frag.titulo || 'Sin título'}</div>
                        <div class="search-result-text">${frag.contenido || 'Sin contenido'}</div>
                    `;
                    // Al hacer clic en un resultado, cerrar búsqueda y hacer scroll (opcional)
                    item.addEventListener('click', () => {
                        searchModal.classList.remove('active');
                        // Aquí podríamos agregar lógica para hacer scroll hasta la tarjeta
                    });
                    searchResults.appendChild(item);
                });
            }
        });
                }

// --- 7. LÓGICA DE EXPORTACIÓN A PDF ---
    const btnExport = document.getElementById('btnExport');
    
    if (btnExport) {
        btnExport.addEventListener('click', async () => {
            const container = document.getElementById('fragmentsContainer');
            const categoryTitle = document.getElementById('categoryTitle').innerText;
            
            // Validar que haya algo que exportar
            if (container.children.length === 0 || container.innerText.includes('Aún no hay fragmentos')) {
                alert("No hay fragmentos en esta categoría para exportar.");
                return;
            }

            // Cambiar estado del botón
            const originalTooltip = btnExport.getAttribute('data-tooltip');
            btnExport.textContent = '⏳';
            btnExport.setAttribute('data-tooltip', 'Generando...');
            btnExport.disabled = true;

            // Configuración del PDF
            const opt = {
                margin:       15,
                filename:     `Fragmentos_${categoryTitle}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, logging: false }, // useCORS es vital para las imágenes de Supabase
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            try {
                // Generar y descargar
                await html2pdf().set(opt).from(container).save();
            } catch (error) {
                console.error("Error al generar PDF:", error);
                alert("Hubo un error al generar el PDF. Revisa la consola.");
            } finally {
                // Restaurar botón
                btnExport.textContent = '📥';
                btnExport.setAttribute('data-tooltip', originalTooltip);
                btnExport.disabled = false;
            }
        });
    }

    
});
