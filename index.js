const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('A user joined');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Sends message to everyone
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});