let Entity = require('../entity')

function Bullet(parent, angle) {
  Entity.call(this, Math.random())
  this.parent = parent
  this.speedx = Math.cos(angle/180*Math.PI) * 10
  this.speedy = Math.sin(angle/180*Math.PI) * 10
  this.timer = 0
  this.toRemove = false
  this.damage = 0.1
}

Bullet.prototype = Object.create(Entity.prototype)
Object.assign(Bullet, Entity)

Bullet.prototype.update = function() {
  if(this.timer++ > 30) this.toRemove = true
  if(this.toRemove) Bullet.remove(this)
  this.updatePosition()
  this.calculateDamage()
}

Bullet.prototype.calculateDamage = function() {
  let Player = Bullet._player
  let PlayerList = Player.list()
  for (let k in PlayerList) {
    let player = PlayerList[k]
    if (this.getDistance(player) < 32 && this.parent !== player.id) {
      // handle hp event later on
      player.takeDamage(this.damage)
      this.toRemove = true
    }
  }
}

Bullet.package = function() {
  let client_package = [];
  let bulletList = Bullet.list()
  for (let k in bulletList) {
    let bullet = bulletList[k]
    bullet.update()
    client_package.push({
      x: bullet.x,
      y: bullet.y
    });
  }
  return client_package
}

module.exports = Bullet