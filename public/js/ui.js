// 📍 public/js/ui.js
import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { guardarFragmento, cargarFragmentos } from "./firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    // --- 1. CONTROL DE LUZ ---
    const lightSlider = document.getElementById('lightSlider');
    const lightOverlay = document.getElementById('lightOverlay');
    const lightToggle = document.getElementById('lightToggle');
    const bulbGlass = document.getElementById('bulbGlass');
    const bulbGlow = document.getElementById('bulbGlow');
    const bulbInterior = document.getElementById('bulbInterior');
    const filaments = [document.getElementById('filament1'), document.getElementById('filament2'), document.getElementById('filament3')].filter(el => el !== null);

    function updateLight() {
        if (!lightSlider) return;
        const intensity = lightSlider.value / 100;
        root.style.setProperty('--light-intensity', intensity);
        if (intensity === 0) {
            if(lightOverlay) lightOverlay.classList.add('off');
            if(lightToggle) lightToggle.textContent = '🌙';
            if(bulbGlass) { bulbGlass.setAttribute('opacity', '0.3'); bulbGlass.setAttribute('fill', '#D0D0D0'); }
            if(bulbGlow) bulbGlow.setAttribute('opacity', '0');
            if(bulbInterior) bulbInterior.setAttribute('opacity', '0');
            filaments.forEach(f => f.setAttribute('stroke', '#888888'));
        } else {
            if(lightOverlay) lightOverlay.classList.remove('off');
            if(lightToggle) lightToggle.textContent = '💡';
            if(bulbGlass) { bulbGlass.setAttribute('opacity', '0.95'); bulbGlass.setAttribute('fill', '#FFF4D6'); }
            if(bulbGlow) bulbGlow.setAttribute('opacity', 0.4 + (intensity * 0.6));
            if(bulbInterior) bulbInterior.setAttribute('opacity', intensity * 0.8);
            filaments.forEach(f => { f.setAttribute('stroke', '#FF8C00'); f.setAttribute('stroke-width', 1.5 + (intensity * 1)); });
        }
    }
    if (lightSlider) {
        lightSlider.addEventListener('input', updateLight);
        const hour = new Date().getHours();
        lightSlider.value = (hour >= 20 || hour < 7) ? 40 : 80;
        updateLight();
    }
    if (lightToggle) {
        lightToggle.addEventListener('click', () => {
            lightSlider.value = (lightOverlay && lightOverlay.classList.contains('off')) ? 70 : 0;
            updateLight();
        });
    }

    // --- 2. CONTROL DE TAMAÑO DE TEXTO ---
    const textSizeSlider = document.getElementById('textSizeSlider');
    const textSizeToggle = document.getElementById('textSizeToggle');
    function updateTextSize() {
        if (!textSizeSlider) return;
        root.style.setProperty('--base-font-size', textSizeSlider.value + 'px');
        if (textSizeToggle) textSizeToggle.style.fontSize = (textSizeSlider.value * 1.1) + 'px';
    }
    if (textSizeSlider) { textSizeSlider.addEventListener('input', updateTextSize); updateTextSize(); }
    if (textSizeToggle) {
        textSizeToggle.addEventListener('click', () => {
            textSizeSlider.value = parseInt(textSizeSlider.value) <= 16 ? 20 : 14;
            updateTextSize();
        });
    }

    // --- 3. MODO OSCURO ---
    const btnDarkMode = document.getElementById('btnDarkMode');
    if (btnDarkMode) {
        btnDarkMode.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                btnDarkMode.textContent = '☀️'; btnDarkMode.setAttribute('data-tooltip', 'Modo Claro');
            } else {
                btnDarkMode.textContent = '🌙'; btnDarkMode.setAttribute('data-tooltip', 'Modo Oscuro');
            }
        });
    }

    // --- 4. CERRAR SESIÓN ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try { await signOut(auth); window.location.href = "index.html"; } 
            catch (error) { console.error("Error al salir:", error); }
        });
    }

    // --- 5. LÓGICA DEL MODAL Y BASE DE DATOS ---
    const newFragmentBtn = document.getElementById('newFragmentBtn');
    const writeModal = document.getElementById('writeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const writeForm = document.getElementById('writeForm');
    const fragmentsContainer = document.getElementById('fragmentsContainer');
    const navItems = document.querySelectorAll('.nav-item');
    const categoryTitle = document.getElementById('categoryTitle');

    const categoryNames = { 'poesia': 'Poesía', 'prosa': 'Prosa', 'ideas': 'Ideas', 'imagenes': 'Imágenes' };

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

            const card = document.createElement('div');
            card.className = 'fragment-card';
            // Usamos replace para respetar los saltos de línea
            card.innerHTML = `
                <div class="card-meta">${fechaStr}</div>
                <h3 class="card-title">${frag.titulo || 'Sin título'}</h3>
                <p class="card-text">${frag.contenido.replace(/\n/g, '<br>')}</p>
            `;
            fragmentsContainer.appendChild(card);
        });
    }

    // Guardar nuevo fragmento
    if (writeForm) {
        writeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titulo = document.getElementById('fragmentTitle').value.trim();
            const contenido = document.getElementById('fragmentText').value.trim();
            
            const activeNav = document.querySelector('.nav-item.active');
            const tipo = activeNav ? activeNav.getAttribute('data-category') : 'poesia';

            if (!contenido) { alert("Por favor escribe algo antes de guardar."); return; }

            const btnSave = writeForm.querySelector('.btn-save');
            const originalText = btnSave.textContent;
            btnSave.textContent = "Guardando...";
            btnSave.disabled = true;

            const result = await guardarFragmento(tipo, titulo, contenido);

            if (result.success) {
                toggleModal(false);
                renderFragmentos(tipo); // Recargar la lista inmediatamente
            } else {
                alert("Error al guardar: " + result.error);
            }

            btnSave.textContent = originalText;
            btnSave.disabled = false;
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
});
