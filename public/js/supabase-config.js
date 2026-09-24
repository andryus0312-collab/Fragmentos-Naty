import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://hyrjcuxxjnfjqnawvgxk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cmpjdXh4am5manFuYXd2Z3hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDI0OTc1OCwiZXhwIjoyMTA1ODI1NzU4fQ.uDrhmBboKJ-aw6RBNVxJSUfMyzKc2YyrzY4bHWajgEs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
