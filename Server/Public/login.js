// Supabase client
const supabase = supabase.createClient(
    'https://dakpzknwpppvqqnzuzjo.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRha3B6a253cHBwdnFxbnp1empvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDg3NDUsImV4cCI6MjA1OTM4NDc0NX0.C3a3yDgSZHnEgRpewHa99867hjde4nO-ZKgMhMAyTeg' // Supabase anon key
);



// Login form event listener
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    try {
        const { user, error } = await supabase.auth.signInWithPassword({ email: username, password });
        if (error) throw error;

        alert('Login successful!');
        window.location.href = 'profile.html'; // Redirect to profile
    } catch (err) {
        console.error("Login error:", err);
        alert("Invalid login credentials.");
    }
});
