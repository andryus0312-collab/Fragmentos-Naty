// 📍 public/js/firestore.js
import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function guardarFragmento(tipo, titulo, contenido, urlArchivo = null, tipoArchivo = null) {
  try {
    const docRef = await addDoc(collection(db, "fragmentos"), {
      tipo: tipo,
      titulo: titulo,
      contenido: contenido,
      url_archivo: urlArchivo,
      tipo_archivo: tipoArchivo,
      fecha: serverTimestamp()
    });
    console.log("Guardado:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error:", e);
    return { success: false, error: e.message };
  }
}

export async function cargarFragmentos(tipo) {
  try {
    const q = query(collection(db, "fragmentos"), where("tipo", "==", tipo), orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);
    const fragmentos = [];
    querySnapshot.forEach((doc) => {
      fragmentos.push({ id: doc.id, ...doc.data() });
    });
    return fragmentos;
  } catch (e) {
    console.error("Error:", e);
    return [];
  }
}
