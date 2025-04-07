// Initialize Socket.io
const socket = io('ws://localhost:5500');

const activity = document.querySelector('.activity');
const msgInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.send-btn');
const chatMessages = document.querySelector('.chat-messages');

let activityTimer;
let activityMessage;

function sendMessage(e) {
    e.preventDefault();
    if (msgInput.value.trim()) {
        // Remove the typing activity message immediately
        if (activityMessage) {
            activityMessage.remove();
            activityMessage = null;
        }

        // Send the message to the server
        socket.emit('message', msgInput.value);
        msgInput.value = "";
    }
    msgInput.focus();
}

msgInput.addEventListener('keypress', () => {
    // Emit that the user is typing
    socket.emit('activity', socket.id.substring(0, 5));
});

sendButton.addEventListener('click', sendMessage);
msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e);
    }
});

socket.on("message", (data) => {
    if (activityMessage) {
        activityMessage.remove();
        activityMessage = null;
    }

    const li = document.createElement('li');
    li.textContent = data;
    li.classList.add('bubble');

    if (data.startsWith(socket.id.substring(0, 5))) {
        li.classList.add('sent');
    } else {
        li.classList.add('received');
    }

    chatMessages.appendChild(li);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


socket.on("activity", (name) => {
    if (!activityMessage) {
        activityMessage = document.createElement('li');
        activityMessage.classList.add('activity-msg');
        chatMessages.appendChild(activityMessage);
    }
    activityMessage.textContent = `${name} is typing...`;

    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        if (activityMessage) {
            activityMessage.remove();
            activityMessage = null;
        }
    }, 2000);
});

// Supabase client
const supabase = supabase.createClient(
    'https://dakpzknwpppvqqnzuzjo.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRha3B6a253cHBwdnFxbnp1empvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDg3NDUsImV4cCI6MjA1OTM4NDc0NX0.C3a3yDgSZHnEgRpewHa99867hjde4nO-ZKgMhMAyTeg' // Supabase anon key
);

// Registration form event listener
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
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
