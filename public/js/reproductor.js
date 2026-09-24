// 📍 public/js/reproductor.js
// Reproductor de una sola canción de ambiente, persistente entre páginas del diario.
import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { supabase } from "./supabase-config.js";

const BUCKET_NAME = "fragmentos";
const LS_TIME = "fragmentos_musica_time";
const LS_PLAYING = "fragmentos_musica_playing";
const LS_URL = "fragmentos_musica_url";

let audio = null;

async function obtenerCancionActual() {
  const ref = doc(db, "configuracion", "cancion");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

function actualizarUI(playing) {
  const btn = document.getElementById("musicaPlayPause");
  if (btn) btn.textContent = playing ? "⏸️" : "▶️";
}

function guardarEstado(playing) {
  localStorage.setItem(LS_PLAYING, playing ? "1" : "0");
}

function crearAudioElement(url) {
  if (audio) { audio.pause(); audio.src = ""; }
  audio = new Audio(url);
  audio.loop = true;
  audio.addEventListener("timeupdate", () => {
    localStorage.setItem(LS_TIME, String(audio.currentTime));
  });
  return audio;
}

async function intentarReproducir() {
  try {
    await audio.play();
    guardarEstado(true);
    actualizarUI(true);
  } catch (err) {
    // El navegador bloqueó el autoplay: arrancamos en el primer toque, sin pedirlo explícitamente.
    const resume = () => {
      audio.play().then(() => { guardarEstado(true); actualizarUI(true); }).catch(() => {});
    };
    document.addEventListener("click", resume, { once: true });
    document.addEventListener("touchstart", resume, { once: true });
  }
}

export async function initReproductor() {
  const cancion = await obtenerCancionActual();
  const btnPlayPause = document.getElementById("musicaPlayPause");
  const inputSubir = document.getElementById("musicaSubirInput");
  const btnBorrar = document.getElementById("musicaBorrarBtn");
  const nombreSpan = document.getElementById("musicaNombre");

  if (!cancion) {
    if (nombreSpan) nombreSpan.textContent = "Sin canción";
    if (btnPlayPause) btnPlayPause.style.display = "none";
    if (btnBorrar) btnBorrar.style.display = "none";
    localStorage.removeItem(LS_PLAYING);
    localStorage.removeItem(LS_TIME);
    localStorage.removeItem(LS_URL);
    audio = null;
  } else {
    if (nombreSpan) nombreSpan.textContent = cancion.nombre || "Canción";
    if (btnPlayPause) btnPlayPause.style.display = "";
    if (btnBorrar) btnBorrar.style.display = "";
    crearAudioElement(cancion.url);

    const urlGuardada = localStorage.getItem(LS_URL);
    const esLaMisma = urlGuardada === cancion.url;
    const tiempoGuardado = esLaMisma ? parseFloat(localStorage.getItem(LS_TIME) || "0") : 0;
    const estabaSonando = esLaMisma ? localStorage.getItem(LS_PLAYING) === "1" : true;

    localStorage.setItem(LS_URL, cancion.url);
    if (tiempoGuardado && isFinite(tiempoGuardado)) audio.currentTime = tiempoGuardado;

    if (estabaSonando) await intentarReproducir();
    else actualizarUI(false);
  }

  if (btnPlayPause) btnPlayPause.onclick = () => {
    if (!audio) return;
    if (audio.paused) { audio.play(); guardarEstado(true); actualizarUI(true); }
    else { audio.pause(); guardarEstado(false); actualizarUI(false); }
  };

  if (inputSubir) inputSubir.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (nombreSpan) nombreSpan.textContent = "Subiendo...";

    // Solo puede existir una canción: se borra la anterior del almacenamiento antes de subir la nueva.
    const anterior = await obtenerCancionActual();
    if (anterior && anterior.ruta_storage) {
      await supabase.storage.from(BUCKET_NAME).remove([anterior.ruta_storage]);
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `musica/${fileName}`;

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, { cacheControl: "3600", upsert: false });
    if (error) {
      alert("No se pudo subir la canción. Intenta de nuevo.");
      if (nombreSpan) nombreSpan.textContent = anterior ? anterior.nombre : "Sin canción";
      return;
    }
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    await setDoc(doc(db, "configuracion", "cancion"), {
      url: urlData.publicUrl,
      nombre: file.name,
      ruta_storage: filePath,
      fecha: new Date()
    });

    localStorage.removeItem(LS_TIME);
    localStorage.setItem(LS_PLAYING, "1");
    e.target.value = "";
    initReproductor();
  };

  if (btnBorrar) btnBorrar.onclick = async () => {
    const actual = await obtenerCancionActual();
    if (!actual) return;
    if (!confirm("¿Eliminar la canción actual? Se borrará también del almacenamiento.")) return;

    if (actual.ruta_storage) {
      await supabase.storage.from(BUCKET_NAME).remove([actual.ruta_storage]);
    }
    await deleteDoc(doc(db, "configuracion", "cancion"));

    if (audio) { audio.pause(); audio.src = ""; audio = null; }
    localStorage.removeItem(LS_PLAYING);
    localStorage.removeItem(LS_TIME);
    localStorage.removeItem(LS_URL);
    initReproductor();
  };
}
