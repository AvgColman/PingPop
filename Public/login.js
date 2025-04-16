console.log("✅ login.js is running!");

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://wkywenoxjvgjxaociect.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndreXdlbm94anZnanhhb2NpZWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTcxMjMsImV4cCI6MjA1OTk3MzEyM30.t_4qJwwp9MClViTGjmc4WR2yfBCvRjKnoTVclHVvhtY'
);

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert("❌ Please enter both username and password.");
    return;
  }

  console.log("🔍 Looking up email for username:", username);

  // Step 1: Get email for this username
  const { data: emailData, error: emailError } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username)
    .single();

  if (emailError || !emailData?.email) {
    console.error("❌ Username not found:", emailError);
    alert("Username not found.");
    return;
  }

  const email = emailData.email;
  console.log("📧 Found email:", email);

  // Step 2: Try login with email
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    console.error("❌ Login failed:", loginError.message);
    alert("Invalid login credentials.");
    return;
  }

  const user = loginData.user;
  if (!user) {
    alert("Login failed. Please try again.");
    return;
  }

  console.log("✅ Logged in user:", user);
  window.location.href = "profile.html";
});
