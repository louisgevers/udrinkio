const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
var io = require('socket.io').listen(http)
const {v4: uuidv4 } = require('uuid')
const MineField = require('./game/MineField.js')


app.use(express.static(path.join(__dirname, 'build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// ### SOCKET ABSTRACTED METHODS ###

createRoom = (socket, username, game) => {
  const roomId = generateRoomId()
  socket.data.username = username
  socket.data.roomId = roomId

  socket.join(roomId)

  const room = getRoom(roomId)
  room.data = {
    game: game,
    host: socket.id,
    started: false,
    members: new Map()
  }

  memberData = {
    username: username,
    userId: 0
  }
  room.data.members.set(socket.id, memberData)

  return {
    users: generateUsersData(room.data),
    isHost: true,
    roomId: roomId
  }
}

joinRoom = (socket, username, roomId, room) => {
  socket.data.username = username
  socket.data.roomId = roomId
  socket.join(roomId)
  
  memberData = {
    username: username,
    userId: room.data.members.size
  }

  room.data.members.set(socket.id, memberData)

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
    socket.emit('room.unavailable', 'Invalid room code')
    return false
  } else if (room == null) {
    socket.emit('room.unavailable', 'This room does not exist')
    return false
  } else if (room.data.started) {
    socket.emit('room.unavailable', 'Game for this room already started')
  } else if (room.data.members.size >= room.data.game.maxPlayers) {
    socket.emit('room.unavailable', 'Room is full')
  } else {
    return true
  }
}

disconnectUser = (socket, room) => {
  if (room.data.host === socket.id) {
    socket.broadcast.to(socket.data.roomId).emit('room.hostDisconnected', socket.data.username)
    io.in(socket.data.roomId).clients((error, socketIds) => {
      if (error) throw error
      socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(socket.data.roomId))
    })
  } else {
    delete room.data.members.delete(socket.id)
    const users = generateUsersData(room.data)
    socket.broadcast.to(socket.data.roomId).emit('room.userDisconnected', users)
  }
  socket.leave(socket.data.roomId)
  delete socket.data.roomId
}

// ### SOCKET IO ###
var connectionsCount = 0
io.on('connection', (socket) => {
  connectionsCount += 1
  console.log(`[C](${connectionsCount} connection(s)) socket [${socket.id}] connected`)

  socket.on('app.addUser', () => {
    // TODO persist ID or reconnect socket
    const id = uuidv4()
    socket.data = {
      userId: id
    }
    socket.emit('app.userAdded', (id))
  })

  socket.on('room.create', (data) => {
    const username = data.username
    const game = data.game
    socket.emit('room.created', createRoom(socket, username, game))
    socket.emit('chat.userJoined', username)
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
      io.to(roomId).emit('chat.userJoined', username)
    }
  })

  socket.on('room.quit', () => {
    console.log('attempting to quit ' + socket.data.roomId)
    const roomId = socket.data.roomId
    if (typeof roomId !== 'undefined') {
      const room = getRoom(roomId)
      if (typeof room !== 'undefined') {
        disconnectUser(socket, room)
        io.to(roomId).emit('chat.userDisconnected', (socket.data.username))
      }
    }
  })

  socket.on('room.removeUser', (userId) => {
    const room = getRoom(socket.data.roomId)
    if (socket.id === room.data.host) {
      var userSocketId = -1
      room.data.members.forEach((member, socketId) => {
        if (member.userId === userId) {
          userSocketId = socketId
        }
      })
      if (userSocketId !== -1) {
        const userSocket = io.sockets.sockets[userSocketId]
        disconnectUser(userSocket, room)
        userSocket.emit('room.userRemoved', socket.data.username)
        io.to(socket.data.roomId).emit('chat.userRemoved', {
          host: socket.data.username,
          username: userSocket.data.username
        })
      }
    }
  })

  socket.on('chat.sendMessage', (message) => {
    const data = {
      username: socket.data.username,
      message: message,
      isSender: false
    }
    socket.broadcast.to(socket.data.roomId).emit('chat.receivedMessage', data)
    data.isSender = true
    socket.emit('chat.receivedMessage', data)
  })

  socket.on('game.start', (data) => {
    const roomId = socket.data.roomId
    const room = getRoom(roomId)
    room.data.started = true
    if (room.data.game.id === 'minefield') {
      const game = new MineField(data.value)
      const room = getRoom(socket.data.roomId)
      room.data.gameObject = game
      io.to(roomId).emit('game.started', game.state)
    } else {
      // TODO implement other games
    }
  })

  socket.on('minefield.drawCard', (data) => {
    const room = getRoom(socket.data.roomId)
    const game = room.data.gameObject
    game.drawCard(data.row, data.column)
    io.to(socket.data.roomId).emit('minefield.drawnCard', game.state)
  })

  socket.on('disconnect', () => { 
    connectionsCount -= 1
    console.log(`[D](${connectionsCount} connection(s)) socket [${socket.id}] disconnected`)
    if (typeof socket.data !== 'undefined') {
      const roomId = socket.data.roomId
      const room = getRoom(roomId)
      if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
        disconnectUser(socket, room)
        io.to(roomId).emit('chat.userDisconnected', socket.data.username)
      }
    }
  })

})

// ### HELPER METHODS ###

function generateRoomId() {
  const min = 100000
  const max = 999999
  // TODO conflicitng room ids
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRoom(id) {
  return io.sockets.adapter.rooms[id]
}

function generateUsersData(roomData) {
  const host = roomData.host
  const members = roomData.members
  const users = []
  var hostIndex = 0
  index = 0
  members.forEach((member, socketId) => {
    if (socketId === host) {
     hostIndex = index
    }
    users.push(member)
  })
  return {
    host: hostIndex,
    users: users
  }
}

function isValidRoomCode(roomId) {
  return roomId.match(/^[0-9]{6}$/) != null
}

// ### GAME ###

function createMineFieldGame(data) {
  const n = data.value
  const grid = []
  for (var i = 0; i < n; i++) {
    const row = []
    for (var j = 0; j < n; j++) {
      row.push('b')
    }
    grid.push(row)
  }
  const state = {
    table: grid
  }
  return state
}

// ### SERVER ###

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log(`Listening on port ${ port }`)
});