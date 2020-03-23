const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
var io = require('socket.io').listen(http)


app.use(express.static(path.join(__dirname, 'build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// ### SOCKET IO ###

io.on('connection', (socket) => {
  console.log('a user connected!')

  socket.on('create-party', (data) => {    
    const roomId = generateRoomId()
    socket.data = {
      username: data.username,
      roomId: roomId
    }

    socket.join(roomId)

    const room = getRoom(roomId)
    room.data = {
      gameId: data.gameId,
      host: socket.id,
      members: {}
    }
    room.data.members[socket.id] = data.username

    socket.emit('assign-room', roomId)
  })

})

function generateRoomId() {
  const min = 100000
  const max = 999999
  // TODO conflicitng room ids
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRoom(id) {
  return io.sockets.adapter.rooms[id]
}

// ### SERVER ###

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log(`Listening on port ${ port }`)
});