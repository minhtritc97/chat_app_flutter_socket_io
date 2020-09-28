var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.send('Server started success');
});

io.on('connection', (socket) => {
  console.log(`a user connected with id: ${socket.id}`);
  io.emit('newconnection', `New connection with id: ${socket.id}`);

  socket.on('chat message', (msg) => {
    //send all client
    if (msg.to === 'all')
    {   
    socket.broadcast.emit('chat message', msg);
    console.log(`Client : ${msg.from}`);
    console.log(`Server forward: all`);
    } else //send to client with socketID
    {
    io.to(`${msg.to}`).emit('chat message',msg);
    console.log(`Client : ${msg.from}`);
    console.log(`Server forward:${msg.to} `);
    }
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});