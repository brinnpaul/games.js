'use strict'
let Entity = require('./entity')

function Player(object) {
  Entity.call(this, object.socket.id)
  this.name = object.name
  this.number = "" + Math.floor(100 * Math.random())
  this.right = false
  this.left = false
  this.up = false
  this.down = false
  this.attack = false
  this.mouseAngle = 0
  this.maxSpeed = 10
  this.health = 100
  this.maxHealth = 100
  this.currentWeapon = Player._weapons.bullet
}

Player.prototype = Object.create(Entity.prototype)
Object.assign(Player, Entity)

Player.prototype.showHealth = function() {
  return this.health
}

Player.prototype.heal = function(hp) {
  if (this.health < this.maxHealth) this.health += hp
}

Player.prototype.takeDamage = function(hp) {
  if (this.health > 0) this.health -= hp
}

Player.prototype.updateSpeed = function() {
  if (this.right) this.speedx = this.maxSpeed
  else if (this.left) this.speedx = -this.maxSpeed
  else this.speedx = 0

  if (this.up) this.speedy = this.maxSpeed
  else if (this.down) this.speedy = -this.maxSpeed
  else this.speedy = 0
}

Player.prototype.shootWeapon = function() {
  if (this.attack) {
    let Weapon = this.currentWeapon
    let shot = new Weapon(this.id, this.mouseAngle)
    shot.x = this.x
    shot.y = this.y
    Weapon.add(shot)
  }
}

Player.prototype.update = function() {
  this.updatePosition()
  this.updateSpeed()
  this.shootWeapon('bomb')
}

Player.prototype.setCurrentWeapon = function(type) {
  console.log(type, 'hitting here')
  this.currentWeapon = Player._weapons[type]
}

Player.onConnect = function(socket, name) {
    let player = new Player({socket:socket, name:name})
    Player.add(player)

    // movement & firing
    socket.on('keyPress', (data) => {
      switch(data.input) {
        case 'right':
          player.right = data.state
          break
        case 'left':
          player.left = data.state
          break
        case 'up':
          player.up = data.state
          break
        case 'down':
          player.down = data.state
          break
        case 'attack':
          player.attack = data.state
          break
        case 'mouseAngle':
          player.mouseAngle = data.state
          break
      }
    })

    socket.on('changeWeapon', (data) => {
      console.log(data)
      player.setCurrentWeapon(data.type)
    })

}

Player.onDisconnect = function(socket) {
  Player.remove(socket)
}

Player.package = function() {
  let client_package = [];
  let playerList = Player.list()
  for (let k in playerList) {
    let player = playerList[k]
    player.update()
    client_package.push({
      x: player.x,
      y: player.y,
      name: player.name,
      health: player.health
    });
  }
  return client_package
}

module.exports = Player
