document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const dob = document.getElementById('dob').value;

    if (!username || !email || !password || !dob) {
      alert("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      console.log("🔐 SignUp Response:", signUpData);
      if (signUpError) {
        console.error("❌ SignUp Error:", signUpError);
        alert(`Signup failed: ${signUpError.message}`);
        return;
      }

      const user = signUpData.user;
      if (!user?.id) {
        alert("User created, but no user ID returned.");
        return;
      }

      // Insert into profiles
      const { error: profileError } = await supabase.from('profiles').insert([{
        user_id: user.id,
        username,
        email: user.email || email,
        dob,
        created_at: new Date().toISOString()
      }]);

      if (profileError) {
        console.error("❌ Profile Insert Error:", profileError);
        alert(`Profile insert failed: ${profileError.message}`);
        return;
      }

      alert("✅ Registration successful!");
      window.location.href = 'login.html';

    } catch (err) {
      console.error("🔥 Unexpected error:", err);
      alert("An unexpected error occurred. Check the console.");
    }
  });
});
