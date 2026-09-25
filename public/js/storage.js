import { supabase } from "./supabase-config.js";

const BUCKET_NAME = "fragmentos";

export async function subirArchivo(file, folder) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error("Error subida:", error);
      return null;
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function eliminarArchivo(url) {
  try {
    const marker = `/${BUCKET_NAME}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return false;
    const filePath = decodeURIComponent(url.slice(idx + marker.length));
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    if (error) { console.error("Error eliminando archivo:", error); return false; }
    return true;
  } catch (error) {
    console.error("Error eliminando archivo:", error);
    return false;
  }
}
