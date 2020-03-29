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

// ### SOCKET IO ###
var connectionsCount = 0

io.on('connection', (socket) => {
  connectionsCount += 1
  console.log(`[C](${connectionsCount} connection(s)) socket [${socket.id}] connected`)
  socket.session = {}

  socket.on('app.connect', () => {
    socket.session = {}
    socket.emit('app.connected')
  })

  socket.on('state.get', () => {
    const session = socket.session
    if (typeof session !== 'undefined') {
      // Check if state is defined
      if (typeof session.state === 'undefined') {
        session.state = 'none'
      }
      if (session.state === 'lobby') {
        // Return lobby info if user is in lobby
        const room = getRoom(session.roomId)
        if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
          const lobbyData = getLobbyData(session)
          socket.emit('state.lobby', lobbyData)
        }
      } else if (session.state === 'game') {
        // Return game info if user is in game
        const gameData = {
          // TODO
        }
        socket.emit('state.game', gameData)
      } else {
        // Return no state if not matching
        socket.emit('state.none')
      }
    }
  })

  socket.on('room.create', (data) => {
    // Data variables
    const game = data.game
    const username = data.username
    if (typeof game !== 'undefined' && typeof username !== 'undefined') {
      // Create room
    const roomId = generateRoomId()
    socket.join(roomId)
    // Update socket information
    if (typeof socket.session === 'undefined') {
      socket.session = {}
    }
    const session = socket.session
    session.username = username
    session.roomId = roomId
    session.userId = 0
    session.state = 'lobby'
    // Update room information
    const room = getRoom(roomId)
    const roomData = {
      game: game,
      host: session.userId,
      state: 'lobby',
      users: new Map(),
      sockets: new Map()
    }
    roomData.users.set(session.userId, session.username)
    roomData.sockets.set(session.userId, socket)
    room.data = roomData
    // Inform user
    const lobbyData = getLobbyData(session)
    socket.emit('state.lobby', lobbyData)
    }
  })

  socket.on('room.available', (data) => {
    const roomId = data.roomId
    if (isRoomAvailable(socket, roomId)) {
      const room = getRoom(roomId)
      const users = createUsersJson(room.data.users)
      const lobbyData = {
        roomId: roomId,
        game: room.data.game,
        users: users,
        host: room.data.host
      }
      socket.emit('room.isAvailable', lobbyData)
    }
  })

  socket.on('room.join', (data) => {
    // Retrieve data
    const username = data.username
    const roomId = data.roomId
    if (isRoomAvailable(socket, roomId)) {
      // Join room
      socket.join(roomId)
      const room = getRoom(roomId)
      // Update socket information
      const session = socket.session
      session.username = username
      session.roomId = roomId
      session.userId = room.data.users.size
      session.state = room.data.state
      // Update room information
      room.data.users.set(session.userId, session.username)
      room.data.sockets.set(session.userId, socket)
      // Inform user
      if (room.data.state === 'lobby') {
        const lobbyData = getLobbyData(session)
        socket.emit('state.lobby', lobbyData)
      } else if (room.data.state === 'game') {
        // TODO update gameobject info
        const gameData = {}
        socket.emit('state.game', gameData)
      }
      // Inform room
      const users = createUsersJson(room.data.users)
      socket.broadcast.to(roomId).emit('room.userJoined', users)
      const chatInfo = {
        type: 'info',
        message: `${username} joined the room`
      }
      io.to(roomId).emit('chat.info', chatInfo)
    }
  })

  socket.on('room.quit', () => {
    notifyUserDisconnected(socket)
    disconnectUser(socket)
    socket.emit('state.none')
  })

  socket.on('room.removeUser', (data) => {
    const userId = data.userId
    const room = getRoom(socket.session.roomId)
    // Check if room exists
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      // Check if host is trying to remove
      const isHost = (socket === room.data.sockets.get(room.data.host))
      if (isHost) {
        // Disconnect the user socket
        const toRemoveSocket = room.data.sockets.get(userId)
        if (typeof toRemoveSocket !== 'undefined') {
          // Collect info
          const hostName = room.data.users.get(room.data.host)
          const chatInfo = {
            type: 'info',
            message: `${hostName} has removed ${toRemoveSocket.session.username}`
          }
          // Disconnect
          disconnectUser(toRemoveSocket)
          // Notify user
          toRemoveSocket.emit('room.removed', hostName)
          // Notify room
          io.to(socket.session.roomId).emit('chat.info', chatInfo)
        }
      }
    }
  })

  socket.on('chat.sendMessage', (data) => {
    // Get message
    const message = data.message
    const roomId = socket.session.roomId
    if (typeof roomId !== 'undefined') {
      // Create chat message data
      const chatMessage = {
        type: 'chat',
        message: message,
        isSender: true,
        username: socket.session.username
      }
      // Emit to sender
      socket.emit('chat.receivedMessage', chatMessage)
      // Emit to rest of room
      chatMessage.isSender = false
      socket.broadcast.to(roomId).emit('chat.receivedMessage', chatMessage)
    }
  })

  socket.on('disconnect', () => { 
    connectionsCount -= 1
    console.log(`[D](${connectionsCount} connection(s)) socket [${socket.id}] disconnected`)
    notifyUserDisconnected(socket)
    disconnectUser(socket)
  })
})

// ### ABSTRACT SOCKET METHODS ###

function getLobbyData(session) {
  const room = getRoom(session.roomId)
  const users = createUsersJson(room.data.users)
  return {
    userId: session.userId,
    roomId: session.roomId,
    game: room.data.game,
    users: users,
    host: room.data.host
  }
}

function isRoomAvailable(socket, roomId) {
  if (typeof roomId !== 'undefined' && !isValidRoomCode(roomId)) {
    socket.emit('room.unavailable', 'Invalid room code')
    return false
  }
  const room = getRoom(roomId)
  if (typeof room === 'undefined' || typeof room.data === 'undefined') {
    socket.emit('room.unavailable', 'Room does not exist')
    return false
  } else if (room.data.users.size >= room.data.game.maxPlayers) {
    socket.emit('room.unavailable', `Room is full (${room.data.users.size}/${room.data.game.maxPlayers})`)
    return false
  } else {
    return true
  }
}

function notifyUserDisconnected(socket) {
  if (typeof socket.session !== 'undefined') {
    const roomId = socket.session.roomId
    if (typeof roomId !== 'undefined') {
      const chatInfo = {
        type: 'info',
        message: `${socket.session.username} disconnected`
      }
      io.to(roomId).emit('chat.info', chatInfo)
    }
  }
}

function disconnectUser(socket) {
  // Check if session is initialized
  if (typeof socket.session !== 'undefined') {
    // Check if room is initialized
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const userId = socket.session.userId
      // Check if host
      if (userId === room.data.host) {
        // Notify users
        const hostName = room.data.users.get(room.data.host)
        socket.broadcast.to(roomId).emit('room.hostDisconnected', hostName)
        // Remove listeners to room
        io.in(roomId).clients((err, socketIds) => {
          if (err) throw err
          socketIds.forEach((socketId) => {
            const socket = io.sockets.sockets[socketId]
            socket.leave(roomId)
            delete socket.session.username
            delete socket.session.roomId
            delete socket.session.userId
            socket.session.state = 'none'
          })
        })
      } else {
        // Remove user from room data and notify users
        room.data.users.delete(userId)
        room.data.sockets.delete(userId)
        const users = createUsersJson(room.data.users)
        socket.broadcast.to(roomId).emit('room.userDisconnected', users)
      }
      // Update socket info
      socket.leave(roomId)
      delete socket.session.username
      delete socket.session.roomId
      delete socket.session.userId
      socket.session.state = 'none'
    }
  }
}

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

function createUsersJson(users) {
  return JSON.stringify(Array.from(users))
}

function isValidRoomCode(roomId) {
  return roomId.match(/^[0-9]{6}$/) != null
}

// ### SERVER ###

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log(`Listening on port ${ port }`)
});