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

joinRoom = (socket, username, roomId, room) => {
  socket.data = {
    username: username,
    roomId: roomId
  }
  socket.join(roomId)

  room.data.members[socket.id] = username

  const users = generateUsersData(room.data)
  socket.broadcast.to(roomId).emit('room.newUser', users)
  return {
    users: users,
    isHost: false,
    roomId: roomId,
    game: room.data.game
  }
}

canConnectToRoom = (socket, roomId, room) => {
  if (!isValidRoomCode(roomId)) {
    socket.emit('room.unavailable', 'Invalid room name!')
    return false
  } else if (room == null) {
    socket.emit('room.unavailable', 'This room does not exist!')
    return false
  } else {
    return true
  }
}

// ### SOCKET IO ###
var connectionsCount = 0
io.on('connection', (socket) => {
  connectionsCount += 1
  console.log(`[C](${connectionsCount} connection(s)) socket [${socket.id}] connected`)

  socket.on('room.create', (data) => {
    const username = data.username
    const game = data.game
    socket.emit('room.created', createRoom(socket, username, game))
  })

  socket.on('room.availability', (roomId) => {
    const room = getRoom(roomId)
    if (canConnectToRoom(socket, roomId, room)) {
      socket.emit('room.available', {
        game: room.data.game,
        isHost: false,
        users: generateUsersData(room.data),
        roomId: roomId
      })
    }
  })

  socket.on('room.join', (data) => {
    const roomId = data.roomId
    const username = data.username
    const room = getRoom(roomId)
    if (canConnectToRoom(socket, roomId, room)) {
      socket.emit('room.joined', joinRoom(socket, username, roomId, room))
    }
  })

  socket.on('disconnect', () => { 
    connectionsCount -= 1
    console.log(`[D](${connectionsCount} connection(s)) socket [${socket.id}] disconnected`)
    if (typeof socket.data !== 'undefined') {
      const roomId = socket.data.roomId
      const room = getRoom(roomId)
      if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
        if (room.data.host === socket.id) {
          io.to(roomId).emit('room.hostDisconnected', socket.data.username)
          io.in(roomId).clients((error, socketIds) => {
            if (error) throw error
            socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(roomId))
          })
        } else {
          delete room.data.members[socket.id]
          const users = generateUsersData(room.data)
          io.to(roomId).emit('room.userDisconnected', users)
        }
      }
    }
  })

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

function isValidRoomCode(roomId) {
  return roomId.match(/^[0-9]{6}$/) != null
}

// ### SERVER ###

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log(`Listening on port ${ port }`)
});