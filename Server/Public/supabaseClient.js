// Import the Supabase client library
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
    'https://dakpzknwpppvqqnzuzjo.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRha3B6a253cHBwdnFxbnp1empvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDg3NDUsImV4cCI6MjA1OTM4NDc0NX0.C3a3yDgSZHnEgRpewHa99867hjde4nO-ZKgMhMAyTeg' // Supabase anon key
);

export default supabase;
