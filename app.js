'use strict'

let express = require('express')
let app = express()
let server = require('http').Server(app)
let io = require('socket.io')(server, {})

let Socket = require('./server/entity')
let Player = require('./server/player')
let Bullet = require('./server/weapons/bullet')
let Bomb = require('./server/weapons/bomb')

Socket.initialize({list: {}})
Player.initialize({list: {}, bomb:Bomb, bullet:Bullet})
Bullet.initialize({list: {}, player:Player})
Bomb.initialize({list:{}, bullet:Bullet})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
})

app.use('/client', express.static(__dirname + '/client'))

const PORT = 8080
server.listen(PORT, () => {
  console.log('Server started on port: ', PORT)
})

io.sockets.on('connection', (socket) => {
  socket.id = Math.random()
  Socket.add(socket)
  Player.onConnect(socket, Math.floor(Math.random()*10))

  socket.on('signIn', (data) => {
    if ((data.username !== '' || data.usernmae !== null) && data.password === '123') {
      socket.emit('signInResponse', {success:true, name: data.username})
    } else {
      socket.emit('signInResponse', {success:false})
    }
  })

  socket.on('signUp', (data) => {
    if (data.username !== null && data.password !== null) {
      Player.onConnect(socket, data.username)
      socket.emit('signUpResponse', {success:true})
    } else {
      socket.emit('signUpResponse', {success:false})
    }
  })

  socket.on('chatMessage', (message) => {
    let playerName = socket.id+""
    let socketList = Socket.list()
    for (let k in socketList) {
      socketList[k].emit('addToChat', playerName+': '+message)
    }
  })

  socket.on('disconnect', () => {
      Socket.remove(socket)
      Player.onDisconnect(socket)
  })

})

setInterval(() => {
  let client_package = {
    player: Player.package(),
    bullet: Bullet.package(),
    bomb: Bomb.package()
  }
  let socketList = Socket.list()
  for (let k in socketList) {
    let socket = socketList[k]
    socket.emit('newPosition', client_package)
  }
}, 1000/25)
