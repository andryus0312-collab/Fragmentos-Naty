// 📍 public/js/ui.js (VERSIÓN SIN IMPORTS - TODO EN UNO)

// Esperar a que Firebase esté listo
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Iniciando Fragmentos...");
    
    const root = document.documentElement;

    // --- 1. CONTROL DE LUZ ---
    const lightSlider = document.getElementById('lightSlider');
    const lightOverlay = document.getElementById('lightOverlay');
    const lightToggle = document.getElementById('lightToggle');

    if (lightSlider) {
        console.log("✅ Slider de luz encontrado");
        lightSlider.addEventListener('input', () => {
            const intensity = lightSlider.value / 100;
            root.style.setProperty('--light-intensity', intensity);
            if (lightOverlay) {
                if (intensity === 0) lightOverlay.classList.add('off');
                else lightOverlay.classList.remove('off');
            }
            if (lightToggle) lightToggle.textContent = intensity === 0 ? '🌙' : '💡';
            console.log("💡 Intensidad:", intensity);
        });
    } else {
        console.error("❌ No se encontró el slider de luz");
    }

    // --- 2. CONTROL DE TAMAÑO DE TEXTO ---
    const textSizeSlider = document.getElementById('textSizeSlider');
    const textSizeToggle = document.getElementById('textSizeToggle');
    
    if (textSizeSlider) {
        console.log("✅ Slider de texto encontrado");
        textSizeSlider.addEventListener('input', () => {
            root.style.setProperty('--base-font-size', textSizeSlider.value + 'px');
            if (textSizeToggle) textSizeToggle.style.fontSize = (textSizeSlider.value * 1.1) + 'px';
        });
    }

    if (textSizeToggle) {
        textSizeToggle.addEventListener('click', () => {
            textSizeSlider.value = parseInt(textSizeSlider.value) <= 16 ? 20 : 14;
            textSizeSlider.dispatchEvent(new Event('input'));
        });
    }

    // --- 3. MODO OSCURO ---
    const btnDarkMode = document.getElementById('btnDarkMode');
    if (btnDarkMode) {
        console.log("✅ Botón modo oscuro encontrado");
        btnDarkMode.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            btnDarkMode.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });
    }

    // --- 4. CERRAR SESIÓN ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        console.log("✅ Botón cerrar sesión encontrado");
        logoutBtn.addEventListener('click', () => {
            console.log("🔒 Cerrando sesión...");
            alert("Cerrar sesión (pendiente de implementar con Firebase)");
        });
    }

    // --- 5. MODAL ---
    const newFragmentBtn = document.getElementById('newFragmentBtn');
    const writeModal = document.getElementById('writeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    function toggleModal(show) {
        if (writeModal) {
            if (show) {
                writeModal.classList.add('active');
                console.log("📝 Modal abierto");
            } else {
                writeModal.classList.remove('active');
                console.log("📝 Modal cerrado");
            }
        }
    }

    if (newFragmentBtn) {
        console.log("✅ Botón nuevo fragmento encontrado");
        newFragmentBtn.addEventListener('click', () => toggleModal(true));
    }
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));
    if (cancelBtn) cancelBtn.addEventListener('click', () => toggleModal(false));

    console.log("✅✅✅ Todos los botones básicos están activos ✅✅✅");
});pt = {
                margin: 15, filename: `Fragmentos.pdf`, image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            try {
                if (typeof html2pdf !== 'undefined') {
                    await html2pdf().set(opt).from(fragmentsContainer).save();
                } else {
                    alert("La librería PDF no cargó. Revisa tu conexión.");
                }
            } catch (error) { console.error("Error PDF:", error); } 
            finally {
                btnExport.textContent = '📥'; btnExport.disabled = false;
            }
        });
    }
}); }

    if (fileImageInput) fileImageInput.addEventListener('change', (e) => handleFileSelect(e, 'imagen'));
    if (fileDocInput) fileDocInput.addEventListener('change', (e) => handleFileSelect(e, 'documento'));

    // Botón para quitar el archivo
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', () => {
            selectedFile = null;
            selectedFileType = null;
            filePreviewArea.style.display = 'none';
            fileImageInput.value = '';
            fileDocInput.value = '';
        });
    }
    
    // Abrir y cerrar modal
    function toggleModal(show) {
        if (show) writeModal.classList.add('active');
        else { writeModal.classList.remove('active'); writeForm.reset(); }
    }
    if (newFragmentBtn) newFragmentBtn.addEventListener('click', () => toggleModal(true));
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));
    if (cancelBtn) cancelBtn.addEventListener('click', () => toggleModal(false));
    if (writeModal) {
        writeModal.addEventListener('click', (e) => { if (e.target === writeModal) toggleModal(false); });
    }

    // Función para mostrar los fragmentos en pantalla
    async function renderFragmentos(tipo) {
        if (!fragmentsContainer) return;
        fragmentsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 20px;">Cargando tus fragmentos...</p>';
        
        const fragmentos = await cargarFragmentos(tipo);
        fragmentosEnMemoria = fragmentos; // Guardar en memoria para la búsqueda
        fragmentsContainer.innerHTML = ''; 

        if (fragmentos.length === 0) {
            fragmentsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 20px;">Aún no hay fragmentos en esta categoría. ¡Sé el primero en escribir!</p>';
            return;
        }

        fragmentos.forEach(frag => {
            let fechaStr = "Fecha reciente";
            if (frag.fecha && frag.fecha.seconds) {
                const date = new Date(frag.fecha.seconds * 1000);
                fechaStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
            }

            // Lógica para mostrar archivos adjuntos
            let archivoHTML = '';
            if (frag.url_archivo) {
                if (frag.tipo_archivo === 'imagen') {
                    archivoHTML = `<img src="${frag.url_archivo}" alt="Imagen adjunta" class="card-image">`;
                } else if (frag.tipo_archivo === 'documento') {
                    archivoHTML = `
                        <a href="${frag.url_archivo}" target="_blank" class="card-doc-link">
                            📄 Ver / Descargar Documento
                        </a>`;
                }
            }

            const card = document.createElement('div');
            card.className = 'fragment-card';
            card.innerHTML = `
                <div class="card-meta">${fechaStr}</div>
                <h3 class="card-title">${frag.titulo || 'Sin título'}</h3>
                ${archivoHTML}
                <p class="card-text">${frag.contenido ? frag.contenido.replace(/\n/g, '<br>') : ''}</p>
            `;
            fragmentsContainer.appendChild(card);
        });
    }

    // Guardar nuevo fragmento (con soporte para archivos y selector de categoría)
    if (writeForm) {
        writeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titulo = document.getElementById('fragmentTitle').value.trim();
            const contenido = document.getElementById('fragmentText').value.trim();
            
            // USAR LA CATEGORÍA DEL SELECTOR DEL MODAL
            const tipo = categorySelect ? categorySelect.value : 'poesia';

            if (!contenido && !selectedFile) { 
                alert("Por favor escribe algo o adjunta un archivo."); 
                return; 
            }

            const btnSave = writeForm.querySelector('.btn-save');
            const originalText = btnSave.textContent;
            btnSave.textContent = "Procesando...";
            btnSave.disabled = true;

            let urlArchivo = null;
            let tipoArchivo = null;

            if (selectedFile) {
                btnSave.textContent = "Subiendo archivo...";
                const folder = selectedFileType === 'imagen' ? 'fotos' : 'documentos';
                urlArchivo = await subirArchivo(selectedFile, folder);
                tipoArchivo = selectedFileType;
                
                if (!urlArchivo) {
                    alert("Error al subir el archivo. Intenta de nuevo.");
                    btnSave.textContent = originalText;
                    btnSave.disabled = false;
                    return;
                }
            }

            btnSave.textContent = "Guardando escrito...";
            const result = await guardarFragmento(tipo, titulo, contenido, urlArchivo, tipoArchivo);

            if (result.success) {
                toggleModal(false);
                renderFragmentos(tipo);
            } else {
                alert("Error al guardar: " + result.error);
            }

            btnSave.textContent = originalText;
            btnSave.disabled = false;
            selectedFile = null;
            selectedFileType = null;
            filePreviewArea.style.display = 'none';
            fileImageInput.value = '';
            fileDocInput.value = '';
        });
    }

            // Guardar en Firestore (Base de datos)
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
