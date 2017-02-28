let Bullet = require('./bullet')
let Entity = require('../entity')

function Bomb(parent, angle) {
  Bullet.call(this, parent, angle)
  this.speedx = this.speedx *0.2
  this.speedy = this.speedy *0.2
  this.damage = 0
  this.angle = angle
}

Bomb.prototype = Object.create(Bullet.prototype)
Object.assign(Bomb, Entity)


Bomb.prototype.update = function() {
  this.updatePosition()
  if(this.timer++ > 10) {
    this.explode()
    Bomb.remove(this)
  }
}


Bomb.prototype.explode = function() {
  let angles = []
  for (let k=0; k <10; k++) {
    let sign = 1;
    if (Math.random() < 0.5) sign *= -1
    angles.push(this.angle += Math.random() * sign * 10)
  }
  angles.forEach((angle) => {
    let Bullet = Bomb._weapons.bullet
    let bullet = new Bullet(this.parent, angle)
    bullet.x = this.x
    bullet.y = this.y
    Bullet.add(bullet)
  }, this)
}

Bomb.package = function() {
  let client_package = [];
  let bombList = Bomb.list()
  for (let k in bombList) {
    let bomb = bombList[k]
    bomb.update()
    client_package.push({
      x: bomb.x,
      y: bomb.y
    });
  }
  return client_package
}

module.exports = Bomb