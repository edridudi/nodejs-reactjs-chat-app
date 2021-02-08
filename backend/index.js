const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const Pool = require('pg').Pool;
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const router = require('./router');

const pool = new Pool({
  user: 'lubwhxhleswmry',
  host: 'ec2-46-137-123-136.eu-west-1.compute.amazonaws.com',
  database: 'dd3hvikmldav4u',
  password: 'f3376b86309e4baba0218e40552afd486ea2927a31ef426457c41ba052c7be89',
  port: 5432,
})

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  let address =  socket.request.connection.remoteAddress;
  socket.on('join', ({ name, room }, callback) => {
    if (room === undefined || room == null || room === '') {
      room = 'public' //Default
    }
    if (name && room) {
      console.log('New Join from ' + address+' Socket Id: '+socket.id);
      const { error, user } = addUser({ id: socket.id, name, room, ip: address });
      if (error) return callback(error);
      if (user.room) {
        socket.join(user.room);
        socket.emit('message', { user: 'admin', text: `Hi ${user.name}, welcome to ${user.room} chat room`});
        pool.query('SELECT * FROM message,room WHERE room.name = $1 ORDER BY time DESC LIMIT 10',[user.room], (err, result) => {
          if (err) {
            console.log(err);
          } else {
            for (let i = result.rows.length-1 ; i >= 0 ; i--) {
              let row = result.rows[i];
              socket.emit('message', { user: row.username, text: row.message, time: row.time, old: true });
            }
          }
        })
        if (user) {
          socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });
          io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
      }
    }
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    if (user!==undefined) {
      pool.query('INSERT INTO message (roomid,message,time,username) VALUES ($1,$2,$3,$4)', [1,message.text,message.time,user.name], (err, res) => {
        // console.log(err, res)
      })
      io.to(user.room).emit('message', { user: user.name, text: message.text, time: message.time });
    }
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started`));