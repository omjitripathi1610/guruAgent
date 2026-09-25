// supabase-client.js

// 1. Project Base URL
const SUPABASE_URL = 'https://dsbhtlkdorlvfaefsszo.supabase.co';

// 2. Publishable Key (Jo default ke aage copy ki thi)
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_aDBYNNJm650QDcrIEKBiCQ_T8Y_wQpZ'; // Apni Puri Key Paste Karein

// 3. Supabase Client Init
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);