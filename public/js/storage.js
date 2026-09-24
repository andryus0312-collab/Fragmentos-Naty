// 📍 public/js/storage.js
import { supabase } from "./supabase-config.js";

const BUCKET_NAME = "fragmentos"; // Asegúrate de que este nombre coincida con tu bucket en Supabase

/**
 * Función para subir un archivo a Supabase Storage
 * @param {File} file - El archivo seleccionado (foto o PDF)
 * @param {string} folder - La carpeta dentro del bucket (ej: 'fotos', 'documentos')
 * @returns {Promise<string|null>} - La URL pública del archivo o null si falla
 */
export async function subirArchivo(file, folder) {
    try {
        // Generar un nombre único para evitar sobrescribir archivos
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("Error al subir archivo:", error);
            return null;
        }

        // Obtener la URL pública para poder mostrarla/descargarla
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return urlData.publicUrl;

    } catch (error) {
        console.error("Error inesperado en storage:", error);
        return null;
    }
}
