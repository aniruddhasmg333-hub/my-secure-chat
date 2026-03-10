const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('chat message', (data) => {
    // This now sends the name and the message together
    io.emit('chat message', data);
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
