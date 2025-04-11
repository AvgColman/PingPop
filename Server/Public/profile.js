import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://wkywenoxjvgjxaociect.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndreXdlbm94anZnanhhb2NpZWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTcxMjMsImV4cCI6MjA1OTk3MzEyM30.t_4qJwwp9MClViTGjmc4WR2yfBCvRjKnoTVclHVvhtY'
);

const greeting = document.getElementById('greeting');

const { data: { session }, error: sessionError } = await supabase.auth.getSession();

if (sessionError || !session?.user) {
  greeting.textContent = "You are not logged in.";
} else {
  const userId = session.user.id;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, email')
    .eq('user_id', userId)
    .single();

  if (error || !profile) {
    greeting.textContent = "Welcome! Profile not found.";
  } else {
    greeting.textContent = `👋 Welcome back, ${profile.username || profile.email}`;
  }
}
