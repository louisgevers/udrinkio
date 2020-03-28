const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
var io = require('socket.io').listen(http)
const {v4: uuidv4 } = require('uuid')
const MineField = require('./game/MineField.js')

var session = require('express-session')({
  secret: '5728239597198',
  resave: true,
  saveUninitialized: true
})

var sharedSession = require('express-socket.io-session')

app.use(express.static(path.join(__dirname, 'build')))
app.use(session)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// ### SOCKET IO ###
var connectionsCount = 0

io.use(sharedSession(session, {autoSave: true}))

io.on('connection', (socket) => {
  connectionsCount += 1
  console.log(`[C](${connectionsCount} connection(s)) socket [${socket.id}] connected`)
  
  socket.on('disconnect', () => { 
    connectionsCount -= 1
    console.log(`[D](${connectionsCount} connection(s)) socket [${socket.id}] disconnected`)  
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

// ### SERVER ###

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log(`Listening on port ${ port }`)
});