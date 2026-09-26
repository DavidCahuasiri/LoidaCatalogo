const SUPABASE_URL = "https://pjwpjgsnceojrrpdonqk.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqd3BqZ3NuY2VvanJycGRvbnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzc0ODUsImV4cCI6MjEwNTkxMzQ4NX0.57Gxyc4HFh_ppcWybLeW84JFn05I181T1IMgTX-UpOw";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);