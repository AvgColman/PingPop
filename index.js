import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt';

// Temporary user store
const users = {};

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5501

const app = express()
app.use(express.json());

app.use(express.static('./Public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Public', 'register.html'));
  });


const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5501","http://127.0.0.1:5501"]
    }
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    //send connection message to user
    socket.emit('message', "Welcome to PingPop Chat!")
    //send connection message to all users
    socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} connected`)

    socket.on('message', data => {
        console.log(data)
        io.emit('message', `${socket.id.substring(0,5)}: ${data}`)
    })

    //disconnection messages
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} disconnected`)
    })

    //user is typing message
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  
    if (users[username]) return res.status(409).json({ error: 'User already exists' });
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      users[username] = hashedPassword;
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userPassword = users[username];

    if (!userPassword) return res.status(400).json({ error: 'Invalid username or password' });

    try {
        const match = await bcrypt.compare(password, userPassword);
        if (match) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
