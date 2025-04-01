/*const socket = io('ws://localhost:3500')

const activity = document.querySelector('.activity')
const msgInput = document.querySelector('input')

function sendMessage(e){
    e.preventDefault()
    if(msgInput.value){
        socket.emit('message', msgInput.value)
        msgInput.value = ""
    }
    msgInput.focus()
}

document.querySelector('form')
    .addEventListener('submit', sendMessage)

// Listen for messages

socket.on("message", (data) => {
    activity.textContent = ""
    const li = document.createElement('li')
    li.textContent = data
    document.querySelector('ul').appendChild(li)
})

msgInput.addEventListener('keypress', () => {
    socket.emit('activity', socket.id.substring(0, 5))
})

let activityTimer
socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`

    //timer
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 2000)
})

function goToProfile() {
    window.location.href = "profile.html";
}*/

const socket = io('ws://localhost:3500');

const activity = document.querySelector('.activity');
const msgInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.send-btn');
const chatMessages = document.querySelector('.chat-messages');

function sendMessage(e) {
    e.preventDefault();
    if (msgInput.value) {
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
    // Remove the typing message if it's still there
    if (activityMessage) {
        activityMessage.remove();
        activityMessage = null;
    }

    // Emit that the user is typing
    socket.emit('activity', socket.id.substring(0, 5));
});

sendButton.addEventListener('click', sendMessage);
msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && msgInput.value.trim()) {
        sendMessage(e);
    }
});

socket.on("message", (data) => {
    activity.textContent = "";
    const li = document.createElement('li');
    li.textContent = data;

    if (data.startsWith(socket.id.substring(0, 5))) {
        li.classList.add('sent');
    }

    chatMessages.appendChild(li);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll

    // clear the typing activity message after the message is sent
    setTimeout(() => {
        if (activityMessage) {
            activityMessage.remove();
            activityMessage = null;
        }
    });
});

let activityTimer;
let activityMessage;

socket.on("activity", (name) => {
    if (!activityMessage) {
        activityMessage = document.createElement('li');
        activityMessage.classList.add('activity-msg');
        chatMessages.appendChild(activityMessage);
    }
    activityMessage.textContent = `${name} is typing...`;

    // remove after 2 seconds
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        if (activityMessage) {
            activityMessage.remove();
            activityMessage = null;
        }
    }, 2000);
});
