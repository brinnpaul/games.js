function Entity(id) {
  this.id = id
  this.x = 250
  this.y = 250
  this.speedx = 0
  this.speedy = 0
}

Entity.prototype.updatePosition = function() {
  this.x += this.speedx
  this.y += this.speedy
}

Entity.prototype.update = function() {
  this.updatePosition()
}

Entity.prototype.getDistance = function(point) {
  return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y -point.y, 2))
}

Entity.initialize = function(object) {
  this._list = object.list || {}
  this._weapons = {}
  this._weapons.bullet = object.bullet
  this._weapons.bomb = object.bomb
  this._player = object.player || {}
}

Entity.list = function() {
  return this._list
}

Entity.add = function(obj) {
  this._list[obj.id] = obj
}

Entity.remove = function(obj) {
  delete this._list[obj.id]
}

Entity.package = function() {
  let client_package = [];
  let entityList = Entity.list()
  for (let k in entityList) {
    let entity = entityList[k]
    entity.update()
    client_package.push({
      x: entity.x,
      y: entity.y,
      number: entity.number ? entity.number : null
    });
  }
  return client_package
}

module.exports = Entity