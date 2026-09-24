import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("UI iniciado");
  const root = document.documentElement;

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
      if (lightToggle) lightToggle.textContent = val === 0 ? 'luna' : 'bombilla';
    });
    lightSlider.value = 70;
    lightSlider.dispatchEvent(new Event('input'));
  }

  const textSizeSlider = document.getElementById('textSizeSlider');
  if (textSizeSlider) {
    textSizeSlider.addEventListener('input', () => {
      root.style.setProperty('--base-font-size', textSizeSlider.value + 'px');
    });
  }

  const btnDark = document.getElementById('btnDarkMode');
  if (btnDark) {
    btnDark.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut(auth);
      window.location.href = "index.html";
    });
  }

  const modal = document.getElementById('writeModal');
  const btnNew = document.getElementById('newFragmentBtn');
  const btnClose = document.getElementById('closeModalBtn');
  const btnCancel = document.getElementById('cancelBtn');

  if (btnNew) btnNew.addEventListener('click', () => { if (modal) modal.classList.add('active'); });
  if (btnClose) btnClose.addEventListener('click', () => { if (modal) modal.classList.remove('active'); });
  if (btnCancel) btnCancel.addEventListener('click', () => { if (modal) modal.classList.remove('active'); });

  console.log("Todo listo");
});
