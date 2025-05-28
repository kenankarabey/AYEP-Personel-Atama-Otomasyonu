import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cquhyudpgufljctportp.supabase.co'; // <-- buraya kendi url'ini gir
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdWh5dWRwZ3VmbGpjdHBvcnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjg5OTAsImV4cCI6MjA2Mzg0NDk5MH0.FXVy52ccP90dS6cq33EgJ7UKh_bbjlmroKmCZKrfCCA'; // <-- buraya kendi anon key'ini gir

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 