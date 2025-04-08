
document.addEventListener('DOMContentLoaded', () => {
    // Registration form event listener
    const registerForm = document.getElementById('registerForm');

    if(!registerForm){
        console.error('Registration form not found!');
        return;
    }

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const dob = document.getElementById('dob').value;

            if(!username || !email || !password || !dob){
                alert("Please fill out all fields.")
                return;
            }

            console.log('Submitting:', {username, email, dob});

            try {
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password
                });

                if (signUpError) throw signUpError;

                const user = signUpData?.user;

                if (!user || !user.id){
                    throw new Error("User not returned from signUp.");
                }


                // Insert profile info (id, username, email, dob, created_at)
                const { error: profileError } = await supabase.from('profiles').insert([{
                    id: user.id,
                    username,
                    email,
                    dob,
                    created_at: new Date().toISOString()
                }]);

                if (profileError) throw profileError;

                alert('Registration successful!');
                window.location.href = 'login.html';
            } catch (err) {
                console.error("Registration error:", err);
                alert(err.message || "Something went wrong. Check console for details.");
            }
        });
});
