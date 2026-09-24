// 📍 public/js/ui.js
import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CONTROL DE LUZ ---
    const lightSlider = document.getElementById('lightSlider');
    const lightOverlay = document.getElementById('lightOverlay');
    const lightToggle = document.getElementById('lightToggle');
    const root = document.documentElement;
    
    // Elementos de la bombilla (si existen en el HTML)
    const bulbGlass = document.getElementById('bulbGlass');
    const bulbGlow = document.getElementById('bulbGlow');
    const bulbInterior = document.getElementById('bulbInterior');
    const filaments = [
        document.getElementById('filament1'), 
        document.getElementById('filament2'), 
        document.getElementById('filament3')
    ].filter(el => el !== null); // Filtrar por si no existen

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
        // Ajuste inicial según la hora
        const hour = new Date().getHours();
        lightSlider.value = (hour >= 20 || hour < 7) ? 40 : 80;
        updateLight();
    }

    if (lightToggle) {
        lightToggle.addEventListener('click', () => {
            lightSlider.value = lightOverlay && lightOverlay.classList.contains('off') ? 70 : 0;
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

    if (textSizeSlider) {
        textSizeSlider.addEventListener('input', updateTextSize);
        updateTextSize(); // Inicializar
    }

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
                btnDarkMode.textContent = '☀️';
                btnDarkMode.setAttribute('data-tooltip', 'Modo Claro');
            } else {
                btnDarkMode.textContent = '🌙';
                btnDarkMode.setAttribute('data-tooltip', 'Modo Oscuro');
            }
        });
    }

    // --- 4. CAMBIO DE CATEGORÍAS (Poesía, Prosa, etc.) ---
    const navItems = document.querySelectorAll('.nav-item');
    const categoryTitle = document.getElementById('categoryTitle');
    
    // Mapeo de nombres para el título grande
    const categoryNames = {
        'poesia': 'Poesía',
        'prosa': 'Prosa',
        'ideas': 'Ideas',
        'imagenes': 'Imágenes'
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Quitar clase activa de todos
            navItems.forEach(nav => nav.classList.remove('active'));
            // Añadir a este
            item.classList.add('active');
            
            // Cambiar título si existe
            const category = item.getAttribute('data-category');
            if (categoryTitle && categoryNames[category]) {
                categoryTitle.textContent = categoryNames[category];
            }
        });
    });

    // --- 5. CERRAR SESIÓN ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = "index.html"; // Redirigir al login
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                alert("Hubo un error al intentar salir.");
            }
        });
    }
});
