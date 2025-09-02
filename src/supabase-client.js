import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xdguojifedjtvfiszhcm.supabase.co'; // Replace with your actual Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZ3VvamlmZWRqdHZmaXN6aGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTg0NjYsImV4cCI6MjA2ODEzNDQ2Nn0.uczDB9BlCLk6tf7cIQ_J2kwp8bnjaaUUcrK34-DnAdQ'; // Replace with your actual public anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
