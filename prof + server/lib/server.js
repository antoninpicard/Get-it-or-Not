const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '..')));

// Route principale pour la page professeur
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'prof.html'));
});

// Route pour la page professeur
app.get('/prof', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'prof.html'));
});

exports.server = {
  run(port) {
    server.listen(port, () => {
      console.log('Server listening at port %d', port);
      console.log(`Professor interface: http://localhost:${port}/prof`);
    });
  },
};

const users = new Set();
const understoodCount = { count: 0 };
const notUnderstoodCount = { count: 0 };

io.on('connection', function onConnection(socket) {
  let username;

  console.log('New client connected');

  socket.on('message', function onMessage(data) {
    const text = data.text;
    console.log(`Message from ${username}: ${text}`);
    
    // Comptabiliser les messages "Compris" et "Pas compris"
    if (text === 'Compris') {
      understoodCount.count++;
    } else if (text === 'Pas compris') {
      notUnderstoodCount.count++;
    }
    
    io.sockets.emit('message', { username, text });
  });

  socket.on('login', function onLogin(data) {
    username = data.username;
    console.log(`User logged in: ${username}`);
    users.add(username);
    io.sockets.emit('login', { 
      username, 
      users: Array.from(users),
      understoodCount: understoodCount.count,
      notUnderstoodCount: notUnderstoodCount.count
    });
  });

  socket.on('typing', function onTyping() {
    socket.broadcast.emit('typing', { username });
  });

  socket.on('stop-typing', function onStopTyping() {
    socket.broadcast.emit('stop-typing', { username });
  });

  socket.on('disconnect', function onDisconnect() {
    if (username) {
      console.log(`User disconnected: ${username}`);
      users.delete(username);
      socket.broadcast.emit('logout', { username, users: Array.from(users) });
    }
  });
});
