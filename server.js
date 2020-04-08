const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
var io = require('socket.io').listen(http)
const {v4: uuidv4 } = require('uuid')

const MineField = require('./game/MineField.js')
const KingCup = require('./game/KingCup.js')
const Pyramid = require('./game/Pyramid.js')
const FTheDealer = require('./game/FTheDealer.js')

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
    var username = data.username
    if (username.length > 20) {
      username = username.substring(0, 20)
    }
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
    session.userId = uuidv4()
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
    var username = data.username
    if (username.length > 20) {
      username = username.substring(0, 20)
    }
    const roomId = data.roomId
    if (isRoomAvailable(socket, roomId)) {
      // Join room
      socket.join(roomId)
      const room = getRoom(roomId)
      // Update socket information
      const session = socket.session
      session.username = username
      session.roomId = roomId
      session.userId = uuidv4()
      session.state = room.data.state
      // Update room information
      room.data.users.set(session.userId, session.username)
      room.data.sockets.set(session.userId, socket)
    // Inform user
      const lobbyData = getLobbyData(session)
      socket.emit('state.lobby', lobbyData)
      if (room.data.state === 'game' && typeof room.data.gameObject !== 'undefined') {
        const gameObject = room.data.gameObject
        gameObject.connect({userId: session.userId, username: session.username})
        const gameState = gameObject.generateState()
        socket.emit('game.started', gameState)
        socket.broadcast.to(roomId).emit('game.userJoined', gameState)
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
    var message = data.message
    if (message.length > 200) {
      message = message.substring(0, 200)
    }
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

  socket.on('game.start', (data) => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof data !== 'undefined') {
      const gameId = room.data.game.id
      if (gameId === 'minefield') {
        const gridSize = data.value
        if (typeof data.value === 'number') {
          const gameObject = new MineField(gridSize, room.data.users)
          room.data.gameObject = gameObject
          io.to(roomId).emit('game.started', gameObject.generateState())
          room.data.state = 'game'
          room.data.sockets.forEach((playingSocket) => {
            playingSocket.session.state = 'game'
          })
        }
      } else if (gameId === 'kingcup') {
        const cardsAmount = data.value
        if (typeof cardsAmount === 'number') {
          const gameObject = new KingCup(cardsAmount, room.data.users)
          room.data.gameObject = gameObject
          io.to(roomId).emit('game.started', gameObject.generateState())
          room.data.state = 'game'
          room.data.sockets.forEach((playingSocket) => {
            playingSocket.session.state = 'game'
          })
        }
      } else if (gameId === 'pyramid') {
        const pyramidSize = data.value
        if (typeof pyramidSize === 'number') {
          const gameObject = new Pyramid(pyramidSize, room.data.users)
          room.data.gameObject = gameObject
          io.to(roomId).emit('game.started', gameObject.generateState())
          room.data.state = 'game'
          room.data.sockets.forEach((playingSocket) => {
            playingSocket.session.state = 'game'
          })
        }
      } else if (gameId === 'fthedealer') { 
        const cardsAmount = data.value
        if (typeof cardsAmount === 'number') {
          const gameObject = new FTheDealer(cardsAmount, room.data.users)
          room.data.gameObject = gameObject
          io.to(roomId).emit('game.started', gameObject.generateState())
          room.data.state = 'game'
          room.data.sockets.forEach((playingSocket) => {
            playingSocket.session.state = 'game'
          })
        }
      } else {
        // TODO implement other games here
      }
    }
  })

  socket.on('game.playAgain', () => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      if (room.data.state === 'lobby') {
        const lobbyData = getLobbyData(socket.session)
        socket.emit('state.lobby', lobbyData)
      }
    }
  })

  socket.on('minefield.drawCard', (data) => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        const user = {userId: socket.session.userId, username: socket.session.username}
        if (gameObject.isTurn(user) && gameObject.drawCard(data.row, data.column)) {
          gameObject.nextTurn()
          io.to(roomId).emit('minefield.drawnCard', gameObject.generateState())
          if (gameObject.isOver()) {
            room.data.state = 'lobby'
            delete room.data.gameObject
            io.to(roomId).emit('game.isOver')
          }
        }
      }
    }
  })

  socket.on('kingcup.drawCard', (data) => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        const user = { userId: socket.session.userId, username: socket.session.username }
        if (gameObject.isTurn(user) && gameObject.drawCard(data.index)) {
          io.to(roomId).emit('kingcup.drawnCard', gameObject.generateState())
        }
      }
    }
  })

  socket.on('kingcup.stackCard', () => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        const user = { userId: socket.session.userId, username: socket.session.username }
        if (gameObject.isTurn(user)) {
          const towerFell = gameObject.addCardOnBottleStack()
          gameObject.nextTurn()
          if (towerFell) {
            io.to(roomId).emit('kingcup.towerFell', gameObject.generateState())
          } else {
            io.to(roomId).emit('kingcup.towerStands', gameObject.generateState())
          }
          if (gameObject.isOver()) {
            room.data.state = 'lobby'
            delete room.data.gameObject
            io.to(roomId).emit('game.isOver')
          }
        }
      }
    }
  })

  socket.on('pyramid.nextCard', () => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        if (room.data.host === socket.session.userId) {
          gameObject.nextPyramidCard()
          io.to(roomId).emit('pyramid.newCard', gameObject.generateState())
        }
      }
    }
  })

  socket.on('pyramid.undoCard', () => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        if (room.data.host === socket.session.userId) {
          gameObject.undoPyramidCard()
          io.to(roomId).emit('pyramid.newCard', gameObject.generateState())
        }
      }
    }
  })

  socket.on('pyramid.showCard', (index) => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        const userId = socket.session.userId
        if (typeof index === 'number') {
          gameObject.showCard(userId, index)
          io.to(roomId).emit('pyramid.playerCard', gameObject.generateState())
        }
      }
    }
  })

  socket.on('pyramid.hideCard', (index) => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        const userId = socket.session.userId
        if (typeof index === 'number') {
          gameObject.hideCard(userId, index)
          io.to(roomId).emit('pyramid.playerCard', gameObject.generateState())
        }
      }
    }
  })

  socket.on('pyramid.getCards', () => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        const hand = gameObject.hands.get(socket.session.userId)
        socket.emit('pyramid.assignedCards', hand)
      }
    }
  })

  socket.on('pyramid.end', () => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        room.data.state = 'lobby'
        delete room.data.gameObject
        io.to(roomId).emit('game.isOver')
      }
    }
  })

  socket.on('fthedealer.nextCard', () => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        const userId = socket.session.userId
        if (userId === gameObject.dealer) {
          gameObject.nextCard(userId)
          socket.emit('fthedealer.newCard', gameObject.currentCard)
        }
      }
    }
  })

  socket.on('fthedealer.showCard', () => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        const userId = socket.session.userId
        if (userId === gameObject.dealer) {
          gameObject.showCard(userId)
          if (gameObject.lastCard) {
            io.to(roomId).emit('fthedealer.lastCard')
          }
          socket.emit('fthedealer.newCard', gameObject.currentCard)
          io.to(roomId).emit('fthedealer.newTable', gameObject.table)
        }
      }
    }
  })

  socket.on('fthedealer.undoShowCard', () => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        const userId = socket.session.userId
        if (userId === gameObject.dealer) {
          gameObject.undoShowCard(userId)
          socket.emit('fthedealer.newCard', gameObject.currentCard)
          io.to(roomId).emit('fthedealer.newTable', gameObject.table)
        }
      }
    }
  })

  socket.on('fthedealer.assignDealer', (newDealerId) => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        const userId = socket.session.userId
        if (userId === gameObject.dealer) {
          gameObject.assignDealer(userId, newDealerId)
          const dealerSocket = room.data.sockets.get(newDealerId)
          dealerSocket.emit('fthedealer.newCard', gameObject.currentCard)
          io.to(roomId).emit('fthedealer.newDealer', gameObject.dealer)
        }
      }
    }
  })

  socket.on('fthedealer.end', () => {
    const roomId = socket.session.roomId
    const room = getRoom(roomId)
    if (typeof room !== 'undefined' && typeof room.data !== 'undefined') {
      const gameObject = room.data.gameObject
      if (typeof gameObject !== 'undefined') {
        room.data.state = 'lobby'
        delete room.data.gameObject
        io.to(roomId).emit('game.isOver')
      }
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
    username: session.username,
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
        if (room.data.users.size > 1) {
          const userIds = room.data.users.keys()
          for (var otherId of userIds) {
            if (otherId !== room.data.host) {
              room.data.host = otherId
              break
            }
          }
        } else {
          roomIdsSet.delete(roomId)
        }
        // ### CODE TO DISCONNECT USERS IF HOST DISCONNECTS
        // // Notify users
        // const hostName = room.data.users.get(room.data.host)
        // socket.broadcast.to(roomId).emit('room.hostDisconnected', hostName)
        // // Remove listeners to room
        // io.in(roomId).clients((err, socketIds) => {
        //   if (err) throw err
        //   socketIds.forEach((socketId) => {
        //     const socket = io.sockets.sockets[socketId]
        //     socket.leave(roomId)
        //     delete socket.session.username
        //     delete socket.session.roomId
        //     delete socket.session.userId
        //     socket.session.state = 'none'
        //   })
        // })
        // // Remove room id
        // roomIdsSet.delete(roomId)
      }
        // Remove user from room data and notify users
        room.data.users.delete(userId)
        room.data.sockets.delete(userId)
        if (room.data.state === 'game' && typeof room.data.gameObject !== 'undefined') {
          const gameObject = room.data.gameObject
          gameObject.disconnect(userId)
          socket.broadcast.to(roomId).emit('game.userDisconnected', gameObject.generateState())
        }
        const data = {
          users: createUsersJson(room.data.users),
          host: room.data.host
        }
        socket.broadcast.to(roomId).emit('room.userDisconnected', data)
      
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

const roomIdsSet = new Set()
function generateRoomId() {
  const min = 100000
  const max = 999999
  var roomId = 0
  do {
    roomId = Math.floor(Math.random() * (max - min + 1)) + min
  } while (roomIdsSet.has(roomId))
  roomIdsSet.add(roomId) 
  return roomId
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