const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
  <head>
    <title>Socket.io Chat with Timestamps</title>
    <style>
      body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
      #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
      #input:focus { outline: none; }
      #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; cursor: pointer; }

      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages > li { padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; }
      #messages > li:nth-child(odd) { background: #efefef; }
      
      /* Timestamp Styling */
      .time { font-size: 0.7rem; color: #888; margin-left: 10px; min-width: 60px; text-align: right; }
      .msg-content { word-break: break-all; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form id="form" action="">
      <input id="input" autocomplete="off" /><button>Send</button>
    </form>

    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io();
      var messages = document.getElementById('messages');
      var form = document.getElementById('form');
      var input = document.getElementById('input');

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
          socket.emit('chat message', input.value);
          input.value = '';
        }
      });

      socket.on('chat message', function(data) {
        var item = document.createElement('li');
        
        // 'data' is now an object containing 'text' and 'time'
        item.innerHTML = '<span class="msg-content">' + data.text + '</span>' + 
                         '<span class="time">' + data.time + '</span>';
        
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });
    </script>
  </body>
</html>
  `);
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    // We create the timestamp here on the server
    const messageObject = {
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    io.emit('chat message', messageObject);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});
