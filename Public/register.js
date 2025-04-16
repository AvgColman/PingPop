console.log("✅ register.js is running!");

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://wkywenoxjvgjxaociect.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndreXdlbm94anZnanhhb2NpZWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTcxMjMsImV4cCI6MjA1OTk3MzEyM30.t_4qJwwp9MClViTGjmc4WR2yfBCvRjKnoTVclHVvhtY'
);

// Optional: log user events
function logUserEvent(event, username) {
  fetch('http://localhost:5501/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, username })
  }).catch(err => console.error('Logging failed:', err));
}

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  if (!registerForm) {
    console.error("⚠️ registerForm not found!");
    return;
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const dob = document.getElementById('dob').value;

    if (!username || !email || !password || !dob) {
      alert("❌ Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      alert("🔐 Password must be at least 6 characters.");
      return;
    }

    logUserEvent("Registration Attempt", email);

    try {
      // Step 1: Register user in Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) {
        console.error("❌ Sign-up error:", signUpError);
        alert("Registration failed: " + signUpError.message);
        return;
      }

      // Step 2: Retrieve authenticated user from Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error("❌ Failed to get user from session:", userError);
        alert("Could not verify the user after sign-up.");
        return;
      }

      const user = userData.user;
      console.log("✅ Verified user ID from getUser():", user.id);

      // Step 3: Upsert into profiles table (handles conflicts gracefully)
      const { data: profileInsert, error: profileError } = await supabase
        .from('profiles')
        .upsert([{
          user_id: user.id,
          username,
          email,
          dob,
          created_at: new Date().toISOString()
        }], { onConflict: ['user_id'] });

      if (profileError) {
        console.error("❌ Profile insert/upsert error:", profileError);
        alert("User registered, but saving the profile failed.");
        return;
      }

      console.log("✅ Profile upserted:", profileInsert);
      alert("🎉 Registration successful! You can now log in.");
      window.location.href = "login.html";

    } catch (err) {
      console.error("🔥 Unexpected registration error:", err);
      alert("Something went wrong. Please try again.");
    }
  });
});
