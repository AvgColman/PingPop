/*document.addEventListener('DOMContentLoaded', () => {
    const socket = io('wss://ping-pop.com', {
        path: '/socket.io',
    });

    const activity = document.querySelector('.activity');
    const msgInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');

    console.log(activity, msgInput, sendButton, chatMessages);

    let activityTimer;
    let activityMessage;

    if (!msgInput || !sendButton || !chatMessages) return;

    function sendMessage(e) {
        e.preventDefault();
        if (msgInput.value.trim()) {
            if (activityMessage) {
                activityMessage.remove();
                activityMessage = null;
            }

            // Send message to server
            socket.emit('message', msgInput.value);
            msgInput.value = "";
        }
        msgInput.focus();
    }

    msgInput.addEventListener('keypress', () => {
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
});*/

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://wkywenoxjvgjxaociect.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndreXdlbm94anZnanhhb2NpZWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTcxMjMsImV4cCI6MjA1OTk3MzEyM30.t_4qJwwp9MClViTGjmc4WR2yfBCvRjKnoTVclHVvhtY'
);

document.addEventListener('DOMContentLoaded', async () => {
    const socket = io('wss://ping-pop.com', {
        path: '/socket.io',
    });

    const activity = document.querySelector('.activity');
    const msgInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');

    console.log(activity, msgInput, sendButton, chatMessages);

    let activityTimer;
    let activityMessage;

    if (!msgInput || !sendButton || !chatMessages) return;

    // Fetch the logged-in user's username from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
        console.warn("No session or user found.");
        window.location.href = 'login.html';
        return;
    }

    const userId = session.user.id;
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', userId)
        .single();

    if (profileError || !profile) {
        console.warn("Profile not found:", profileError);
        return;
    }

    const username = profile.username;

    function sendMessage(e) {
        e.preventDefault();
        if (msgInput.value.trim()) {
            if (activityMessage) {
                activityMessage.remove();
                activityMessage = null;
            }

            // Send message and username to the server
            socket.emit('message', { username, message: msgInput.value });
            msgInput.value = "";
        }
        msgInput.focus();
    }

    msgInput.addEventListener('keypress', () => {
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
        li.textContent = `${data.username}: ${data.message}`; // Display the username with the message
        li.classList.add('bubble');

        // Add classes based on whether the message is sent or received
        if (data.username === username) {
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
});
