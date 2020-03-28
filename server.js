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
  
  socket.on('app.connect', () => {
    socket.session = {}
    socket.emit('app.connected')
  })

  socket.on('state.get', () => {
    const session = socket.session
    // Check if state is defined
    if (typeof session.state === 'undefined') {
      session.state = 'none'
    }
    if (session.state === 'lobby') {
      // Return lobby info if user is in lobby
      const lobbyData = getLobbyData(session)
      socket.emit('state.lobby', lobbyData)
    } else if (session.state === 'game') {
      // Return game info if user is in game
      const gameData = {
        // TODO
      }
      socket.emit('state.game')
    } else {
      // Return no state if not matching
      socket.emit('state.none')
    }

  })

  socket.on('room.create', (data) => {
    // Data variables
    const game = data.game
    const username = data.username
    // Create room
    const roomId = generateRoomId()
    socket.join(roomId)
    // Update socket information
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
      users: new Map()
    }
    roomData.users.set(session.userId, session.username)
    room.data = roomData
    // Inform user
    const lobbyData = getLobbyData(session)
    socket.emit('state.lobby', lobbyData)
  })

  socket.on('disconnect', () => { 
    connectionsCount -= 1
    console.log(`[D](${connectionsCount} connection(s)) socket [${socket.id}] disconnected`)  
  })
})

// ### ABSTRACT SOCKET METHODS ###

function getLobbyData(session) {
  const room = getRoom(session.roomId)
  const users = JSON.stringify(Array.from(room.data.users))
  return {
    userId: session.userId,
    roomId: session.roomId,
    game: room.data.game,
    users: users,
    host: room.data.host
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

// ### SERVER ###

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log(`Listening on port ${ port }`)
});