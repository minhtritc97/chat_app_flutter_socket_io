var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.send('Server started success');
});

io.on('connection', (socket) => {
  console.log(`a user connected with id: ${socket.id}`);
  io.emit('new_connection', `New connection with id: ${socket.id}`);
  

  // join in room with id = phone
  socket.on('signin', (id) => {
    console.log(`user connected with phone ${id}`);
    socket.join(id);
  });

  // join in room with id
  socket.on('join', (id) => {
    console.log(`join room ${id}`);
    socket.join(id);
  });

  // when user create group then server emit event join to other users in group
  socket.on('create_group', (group) => {
    console.log(`join group ${group.conversation_id}`);
    socket.join(group.conversation_id);
    for (let index = 0; index < group.members.length; index++) {
      const element = group.members[index];
      if (socket){ 
        io.to(element.phone).emit('join',group);
      }
    }
  });

  socket.on('new_message', (msg) => {
    //send all client
    if (msg.receiver_id === 'all')
    {   
    socket.broadcast.emit('general_message', msg);
    console.log(`Client : ${msg.sender_id}`);
    console.log(`Server forward: all`);
    } else //send to particular client
    {
    let receiverId = msg.receiver_id; 
    if (socket){
      io.to(receiverId).emit('new_message',msg);
      console.log(`Client : ${msg.sender_id}`);
      console.log(`Server forward:${msg.receiver_id} `);
      console.log(`Content : ${msg.content}`);
    }
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`a user disconnected : ${reason}`);
  });
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});
