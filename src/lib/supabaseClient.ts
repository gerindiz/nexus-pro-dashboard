import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validamos que las llaves existan para que no falle en silencio
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Error: No se encontraron las llaves en .env.local. Verifica la ubicación del archivo.");
}

// IMPORTANTE: El 'export' permite que Dashboard.tsx lo encuentre
export const supabase = createClient(supabaseUrl, supabaseAnonKey)