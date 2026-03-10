const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, { maxHttpBufferSize: 1e7 });
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  socket.on('chat message', (data) => {
    // Exact timestamp logic
    const now = new Date();
    data.time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    data.id = Date.now() + Math.random(); 
    
    // Secret command to clear chat for everyone
    if (data.msg === "/clear") {
        io.emit('clear chat');
    } else {
        io.emit('chat message', data);
    }
  });

  socket.on('message read', (readData) => {
    io.emit('update read status', readData);
  });
});

http.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
