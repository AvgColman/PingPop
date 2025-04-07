import supabase from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    // Registration form event listener
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const dob = document.getElementById('dob').value;

            try {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                const user = data.user;
                await supabase.from('users').insert([{ username, email: user.email, dob }]);

                alert('Registration successful!');
                window.location.href = 'login.html'; // Redirect to login
            } catch (err) {
                console.error("Registration error:", err);
                alert("Something went wrong.");
            }
        });
    }
});
