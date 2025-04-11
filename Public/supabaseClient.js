// supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dakpzknwpppvqqnzuzjo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRha3B6a253cHBwdnFxbnp1empvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDg3NDUsImV4cCI6MjA1OTM4NDc0NX0.C3a3yDgSZHnEgRpewHa99867hjde4nO-ZKgMhMAyTeg';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };


