const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, { maxHttpBufferSize: 1e7 });
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  // When a message is sent
  socket.on('chat message', (data) => {
    data.id = Date.now() + Math.random(); // Unique ID for each message
    data.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    data.readBy = []; // List of people who saw it
    io.emit('chat message', data);
  });

  // When a user "reads" a message
  socket.on('message read', (readData) => {
    io.emit('update read status', readData);
  });
});

http.listen(PORT, () => {
  console.log('Server running with Read Receipts on port ' + PORT);
});
