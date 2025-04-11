import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://wkywenoxjvgjxaociect.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndreXdlbm94anZnanhhb2NpZWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTcxMjMsImV4cCI6MjA1OTk3MzEyM30.t_4qJwwp9MClViTGjmc4WR2yfBCvRjKnoTVclHVvhtY'
);

window.addEventListener('DOMContentLoaded', async () => {
  console.log(" DOM loaded. Running profile.js");

  const usernameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');

  // Step 1: Check session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.warn(" No session or user found.");
    window.location.href = 'login.html';
    return;
  }

  const userId = session.user.id;
  console.log("Logged-in user ID:", userId);

  // Step 2: Look up profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, email')
    .eq('user_id', userId)
    .single();

  if (error || !profile) {
    console.warn("Profile not found:", error);
    alert("Could not load your profile.");
    return;
  }

  // Step 3: Update inputs
  console.log("Profile found:", profile);
  usernameInput.value = profile.username || '';
  emailInput.value = profile.email || '';
});
