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
      btnDark.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
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
});ument.createElement('div');
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
