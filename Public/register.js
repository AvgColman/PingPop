console.log("✅ register.js is running!");

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://wkywenoxjvgjxaociect.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndreXdlbm94anZnanhhb2NpZWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTcxMjMsImV4cCI6MjA1OTk3MzEyM30.t_4qJwwp9MClViTGjmc4WR2yfBCvRjKnoTVclHVvhtY'
);

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
      // Step 1: Register user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) {
        console.error("❌ Sign-up error:", signUpError);
        alert("Registration failed: " + signUpError.message);
        return;
      }

      // Step 2: Wait briefly and re-fetch user to get valid ID
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error("❌ Failed to retrieve user after signUp:", userError);
        alert("Could not retrieve new user session.");
        return;
      }

      const user = userData.user;
      console.log("✅ Verified user ID from getUser():", user.id);

      // Step 3: Insert profile with correct user_id
      const { data: profileInsert, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          user_id: user.id,
          username,
          email,
          dob,
          created_at: new Date().toISOString()
        }]);

      if (profileError) {
        console.error("❌ Profile insert error:", profileError);
        alert("User registered, but profile insert failed.");
        return;
      }

      console.log("✅ Profile successfully inserted:", profileInsert);
      alert("🎉 Registration successful! You can now log in.");
      window.location.href = "login.html";

    } catch (err) {
      console.error("🔥 Unexpected registration error:", err);
      alert("Something went wrong. See console for details.");
    }
  });
});
