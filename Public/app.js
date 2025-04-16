document.addEventListener('DOMContentLoaded', () => {
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
});
