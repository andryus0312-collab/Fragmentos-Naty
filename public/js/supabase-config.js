import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://TU_PROYECTO.supabase.co";
const SUPABASE_ANON_KEY = "TU_LLAVE_ANON_AQUI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
