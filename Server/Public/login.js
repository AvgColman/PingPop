console.log("✅ login.js is running!");

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

//  Initialize Supabase
const supabase = createClient(
  'https://wkywenoxjvgjxaociect.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndreXdlbm94anZnanhhb2NpZWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTcxMjMsImV4cCI6MjA1OTk3MzEyM30.t_4qJwwp9MClViTGjmc4WR2yfBCvRjKnoTVclHVvhtY'
);

//  Login form submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  console.log("🔐 Starting login for:", username);

  try {
    // Step 1: Lookup email using username
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', username)
      .single();

    console.log("📨 Email lookup result:", data, error);

    if (error || !data?.email) {
      alert("❌ Username not found.");
      return;
    }

    const email = data.email;
    console.log("📧 Using email:", email);

    // Step 2: Sign in with email + password
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log("🚀 Login response:", loginData, loginError);

    if (loginError) {
      alert("❌ Incorrect password.");
      return;
    }

    alert("✅ Login successful!");
    window.location.href = 'profile.html';

  } catch (err) {
    console.error("💥 Login error:", err.message);
    alert("Something went wrong during login.");
  }
});
