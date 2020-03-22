const express = require('express')
const path = require('path')
const app = express()
// var server = require('http').createServer(app)


app.use(express.static(path.join(__dirname, 'build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const port = process.env.PORT || 8080;
server = app.listen(port, () => {
  console.log(`Listening on port ${ port }`)
});

var io = require('socket.io').listen(server)

io.set('origins', 'http://localhost.com:8080');

io.on('connection', (socket) => {
  console.log('a user connected!')
})