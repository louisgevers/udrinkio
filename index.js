const express = require('express')
const path = require('path')
const app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

app.use(express.static(path.join(__dirname, 'build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

io.on('connection', (socket) => {
  console.log('a user connected!')
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${ port }`)
});