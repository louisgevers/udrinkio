const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
var io = require('socket.io').listen(http)


app.use(express.static(path.join(__dirname, 'build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// ### SOCKET ABSTRACTED METHODS ###

createRoom = (socket, username, game) => {
  const roomId = generateRoomId()
  socket.data = {
    username: username,
    roomId: roomId
  }

  socket.join(roomId)

  const room = getRoom(roomId)
  room.data = {
    game: game,
    host: socket.id,
    members: {}
  }
  room.data.members[socket.id] = username

  return {
    users: generateUsersData(room.data),
    isHost: true,
    roomId: roomId
  }
}

// ### SOCKET IO ###

io.on('connection', (socket) => {
  console.log('a user connected!')

  socket.on('room.create', (data) => {
    const username = data.username
    const game = data.game
    socket.emit('room.created', createRoom(socket, username, game))
  })
  // socket.on('create-party', (data) => {    
  //   const roomId = generateRoomId()
  //   socket.data = {
  //     username: data.username,
  //     roomId: roomId
  //   }

  //   socket.join(roomId)

  //   const room = getRoom(roomId)
  //   room.data = {
  //     gameId: data.gameId,
  //     host: socket.id,
  //     members: {}
  //   }
  //   room.data.members[socket.id] = data.username
    
  //   socket.emit('assign-room', roomId)
  // })

  // socket.on('check-room', (roomId) => {
  //   const room = getRoom(roomId)
  //   if (room == null) {
  //     socket.emit('invalid-room')
  //   } else {
  //     socket.emit('room-available', room.data.gameId)
  //   }
  // })

  // socket.on('join-party', (data) => {
  //   const roomId = data.roomId
  //   const room = getRoom(roomId)
  //   if (room == null) {
  //     socket.emit('invalid-room')
  //   } else {
  //     socket.join(roomId)
  //     socket.broadcast.to(roomId).emit('user-joined', data.username)
  //     room.data.members[socket.id] = data.username
  //     socket.emit('assign-room', roomId)
  //   }
  // })

})

// ### HELPER METHODS ###

function generateRoomId() {
  const min = 100000
  const max = 999999
  // TODO conflicitng room ids
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRoom(id) {
  return io.sockets.adapter.rooms[id]
}

function generateUsersData(roomData) {
  const host = roomData.host
  const members = roomData.members
  const users = []
  var hostIndex = 0
  var index = 0
  for (member in members) {
    if (member === host) {
     hostIndex = index
    }
    users.push(members[member])
    index += 1
  }
  return {
    host: hostIndex,
    users: users
  }
}

// ### SERVER ###

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log(`Listening on port ${ port }`)
});