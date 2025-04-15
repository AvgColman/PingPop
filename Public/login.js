console.log("✅ login.js is running!");

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://wkywenoxjvgjxaociect.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndreXdlbm94anZnanhhb2NpZWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTcxMjMsImV4cCI6MjA1OTk3MzEyM30.t_4qJwwp9MClViTGjmc4WR2yfBCvRjKnoTVclHVvhtY'
);

// Tracks login activity
function logUserEvent(event, username) {
  fetch('http://localhost:5501/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, username })
  }).catch(err => console.error('Logging failed:', err));
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  console.log("🔐 Starting login for:", username);

  try {
    // Step 1: Find email based on username
    const { data: emailData, error: emailError } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', username)
      .single();

    if (emailError || !emailData?.email) {
      alert("❌ Username not found.");
      return;
    }

    const email = emailData.email;
    console.log("📧 Using email:", email);

    // Step 2: Sign in
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) {
      console.error("❌ Login error:", loginError.message);
      alert("❌ Incorrect password or login failed.");
      return;
    }

    const user = loginData?.user;

    if (!user) {
      console.error("❗ No user returned after login.");
      alert("❌ Login failed. No user found.");
      return;
    }

    console.log("✅ User logged in:", user.email);
    window.location.href = 'profile.html';  // Directly go to profile

  } catch (err) {
    console.error("💥 Unexpected login error:", err.message);
    alert("Something went wrong during login.");
  }
});
