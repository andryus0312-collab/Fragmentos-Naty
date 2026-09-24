// 📍 public/js/firestore.js
import { db } from "./firebase-config.js";
import { 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    where, 
    getDocs, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * Función para guardar un nuevo fragmento en la base de datos
 */
export async function guardarFragmento(tipo, titulo, contenido) {
    try {
        const docRef = await addDoc(collection(db, "fragmentos"), {
            tipo: tipo,          // 'poesia', 'prosa', 'ideas', 'imagenes'
            titulo: titulo,      // Título del escrito
            contenido: contenido,// Texto del escrito
            fecha: serverTimestamp() // Fecha y hora automática del servidor
        });
        console.log("Fragmento guardado con ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error al guardar el fragmento: ", e);
        return { success: false, error: e.message };
    }
}

/**
 * Función para obtener los fragmentos de una categoría específica
 */
export async function cargarFragmentos(tipo) {
    try {
        // Creamos una consulta: de la colección "fragmentos", donde "tipo" sea igual al seleccionado, ordenado por fecha
        const q = query(
            collection(db, "fragmentos"), 
            where("tipo", "==", tipo), 
            orderBy("fecha", "desc") // Los más recientes primero
        );

        const querySnapshot = await getDocs(q);
        const fragmentos = [];

        querySnapshot.forEach((doc) => {
            // Agregamos el ID del documento a los datos para poder editarlo/borrarlo después si queremos
            fragmentos.push({ id: doc.id, ...doc.data() });
        });

        return fragmentos;
    } catch (e) {
        console.error("Error al cargar fragmentos: ", e);
        return [];
    }
  }
