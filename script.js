const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.x = canvas.getAttribute('width')
canvas.y = canvas.getAttribute('height')


//const ws = new WebSocket('ws://92.91.158.132:8082')
const ws = new WebSocket('ws://localhost:8082')

let players = {}; let rooms = {}; let player; let seed; let nickname; let room; let map

const speed = new Image()
speed.src = 'assets/speed.png'
const sugar = new Image()
sugar.src = 'assets/sugar.png'
const damage = new Image()
damage.src = 'assets/damage.png'
const fire = new Image()
fire.src = 'assets/fire.png'
const health = new Image()
health.src = 'assets/health.png'
const heart = new Image()
heart.src = 'assets/heart.png'
const sun1 = new Image()
sun1.src = 'assets/sun1.png'
const sun2 = new Image()
sun2.src = 'assets/sun2.png'
const sun3 = new Image()
sun3.src = 'assets/sun3.png'
const plant = new Image()
plant.src = 'assets/plant.png'
const mushroom = new Image()
mushroom.src = 'assets/mushroom.png'
const cactus = new Image()
cactus.src = 'assets/cactus.png'
const gold = new Image()
gold.src = 'assets/gold.png'
const ninja1 = new Image()
ninja1.src = 'assets/ninja1.png'
const ninja2 = new Image()
ninja2.src = 'assets/ninja2.png'
const tortue1 = new Image()
tortue1.src = 'assets/tortue1.png'
const shuriken1 = new Image()
shuriken1.src = 'assets/shuriken1.png'
const shuriken2 = new Image()
shuriken2.src = 'assets/shuriken2.png'

const shurikenSkins = [shuriken1, shuriken2]
const skins = [ninja1, ninja2, tortue1]
const suns = [sun1, sun2, sun3]

const keys = {
  37: false,
  38: false,
  39: false,
  40: false,
  81: false,
  90: false,
  68: false,
  83: false
}

function nextSkin () {
  const s = document.querySelector('img')
  s.setAttribute('id', (s.getAttribute('id') + 1 + skins.length) % skins.length)
  s.setAttribute('src', skins[s.getAttribute('id')].src)
}

function previousSkin () {
  const s = document.querySelector('img')
  s.setAttribute('id', (s.getAttribute('id') - 1 + skins.length) % skins.length)
  s.setAttribute('src', skins[s.getAttribute('id')].src)
}

class PnjHealth {
  constructor (rand) {
    this.x = Math.floor(rand() * 200 + 5200)
    this.y = Math.floor(rand() * 200 + 4600)
    this.width = 50
    this.height = 100
    this.skin = plant
    this.price = 1
  }

  draw () {
    if (touch(this, player, 40) && player.items.health >= this.price) {
      ctx.textAlign = 'center'
      ctx.font = '22px Arial'
      ctx.fillStyle = 'black'
      if (this.price < 10) {
        ctx.fillText(this.price + '    = 1  ', 540, 60)
        ctx.fillText('Press E', 540, 87)
        ctx.drawImage(heart, 512, 38)
        ctx.drawImage(health, 572, 38)
      } else if (this.price < 100) {
        ctx.fillText(this.price + '     = 1   ', 540, 60)
        ctx.fillText('Press E', 540, 87)
        ctx.drawImage(heart, 512, 38)
        ctx.drawImage(health, 580, 38)
      }
    }
    draw(this)
  }

  update () {
    if (touch(this, player, 40) && player.items.health >= this.price && this.price < 100) {
      player.items.health -= this.price
      this.price++
      player.maxHealth += 25
      player.health = player.maxHealth
    }
  }
}

class PnjSpeed {
  constructor (rand) {
    this.x = Math.floor(rand() * 200 + 4600)
    this.y = Math.floor(rand() * 200 + 4600)
    this.width = 32
    this.height = 48
    this.skin = cactus
    this.price = 1
  }

  draw () {
	console.log(touch(this, player, 40), player.items.speed) 
    if (touch(this, player, 40) && player.items.speed >= this.price) {
      ctx.textAlign = 'center'
      ctx.font = '22px Arial'
      ctx.fillStyle = 'black'
      if (this.price < 10) {
        ctx.fillText(this.price + '    = 1  ', 540, 60)
        ctx.fillText('Press E', 540, 87)
        ctx.drawImage(speed, 512, 38)
        ctx.drawImage(sugar, 572, 38)
      } else if (this.price < 100) {
        ctx.fillText(this.price + '     = 1   ', 540, 60)
        ctx.fillText('Press E', 540, 87)
        ctx.drawImage(speed, 512, 38)
        ctx.drawImage(sugar, 580, 38)
      }
    }
    draw(this)
  }

  update () {
    if (touch(this, player, 40) && player.items.speed >= this.price && this.price < 100) {
      player.items.speed -= this.price
      this.price++
      player.items.sugar += 1
    }
  }
}

class PnjDamage {
  constructor (rand) {
    this.x = Math.floor(rand() * 200 + 5000)
    this.y = Math.floor(rand() * 200 + 5000)
    this.width = 60
    this.height = 80
    this.skin = mushroom
    this.price = 1
  }

  draw () {
    if (touch(this, player, 40) && player.items.damage >= this.price) {
      ctx.textAlign = 'center'
      ctx.font = '22px Arial'
      ctx.fillStyle = 'black'
      if (this.price < 10) {
        ctx.fillText(this.price + '    = 1  ', 540, 60)
        ctx.fillText('Press E', 540, 87)
        ctx.drawImage(damage, 512, 38)
        ctx.drawImage(fire, 572, 38)
      } else if (this.price < 100) {
        ctx.fillText(this.price + '     = 1   ', 540, 60)
        ctx.fillText('Press E', 540, 87)
        ctx.drawImage(damage, 512, 38)
        ctx.drawImage(fire, 580, 38)
      }
    }
    draw(this)
  }

  update () {
    if (touch(this, player, 40) && player.items.damage >= this.price && this.price < 100) {
      player.items.damage -= this.price
      this.price++
      player.items.fire += 1
    }
  }
}

class Mob {
  constructor (level) {
		this.x = 0
		this.y = 0
	    this.health = 50 * level
		this.width = 50
		this.height = 50
		this.skin = suns[level - 1]
		this.level = level
		if (level < 3) this.velocity = 3 * level
		else this.velocity = 5 * level
		this.health = 50 * level ** 2
		this.damage = 25 * level ** 2
	}

  update () {
    const d = {}
    for (const p of Object.values(players)) {
      d[Math.sqrt((p.x - this.x) ** 2 + (p.y - this.y) ** 2)] = { x: p.x, y: p.y, nickname: p.nickname }
    }
    d[Math.sqrt((player.x - this.x) ** 2 + (player.y - this.y) ** 2)] = { x: player.x, y: player.y, nickname: player.nickname }
    const closest = Math.min(...Object.keys(d))
    if (closest < 540 && !safe(d[closest])) {
	  const dx = Math.floor((d[closest].x - this.x) / closest * this.velocity)
	  const dy = Math.floor((d[closest].y - this.y) / closest * this.velocity)
	  if (!(4500 - this.width/2 < this.x + dx && this.x + dx < 5500 + this.width/2 && 4500 - this.height/2 < this.y && this.y < 5500 + this.height/2)) this.x += dx
      if (!(4500 - this.height/2 < this.y + dy && this.y + dy < 5500 + this.height/2 && 4500 - this.width/2 < this.x && this.x < 5500 + this.width/2)) this.y += dy
      if (d[closest].nickname === player.nickname) ws.send('4' + JSON.stringify({ room, index: map.mobs.indexOf(this), mob: this }))
    }
  }

  sychronize (m) {
    this.x = m.x
    this.y = m.y
    this.health = m.health
  }
}

class Coin {
  constructor () {
    this.x = 0
    this.y = 0
    this.width = 24
    this.height = 24
    this.skin = gold
  }

  sychronize (c) {
    this.x = c.x
    this.y = c.y
  }
}

class Map {
  constructor (seed) {
    this.x = 10000
    this.y = 10000
    this.coins = []
    this.mobs = []
    this.rand = new Math.seedrandom(seed)
    this.pnjDamage = new PnjDamage(this.rand)
    this.pnjSpeed = new PnjSpeed(this.rand)
    this.pnjHealth = new PnjHealth(this.rand)

    for (let i = 0; i < 200; i++) {
      this.mobs.push(new Mob(1))
    }
    for (let i = 0; i < 400; i++) {
      this.mobs.push(new Mob(2))
    }
    for (let i = 0; i < 600; i++) {
      this.mobs.push(new Mob(3))
    }
    for (let i = 0; i < 2000; i++) {
      this.coins.push(new Coin())
    }
  }

  draw () {
    ctx.fillStyle = 'grey'
    ctx.fillRect(0, 0, canvas.x, canvas.y)
    ctx.fillStyle = 'white'
    ctx.fillRect(5040 - player.x, 4860 - player.y, 1000, 1000)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, 540 - player.x, 720)
    ctx.fillRect(10540 - player.x, 0, 1080, 720)
    ctx.fillRect(0, 0, 1080, 360 - player.y)
    ctx.fillRect(0, 10360 - player.y, 1080, 360)
    for (const coin of this.coins) draw(coin)
    for (const mob of this.mobs) draw(mob)
    let d = { [player.nickname]: player.bal }
    for (const [n, p] of Object.entries(players)) {
	  d[n] = p.bal
	  draw(p, skins[p.skin])
      for (const s of Object.values(p.shurikens)) {
        draw(s, shurikenSkins[s.count%2])
      }
    }
    this.pnjDamage.draw()
    this.pnjSpeed.draw()
    this.pnjHealth.draw()
    ctx.globalAlpha = 0.5
    ctx.fillStyle = 'black'
    if (Object.keys(d).length < 10) ctx.fillRect(950, 220, 130, Object.keys(d).length * 25 + 10)
    else ctx.fillRect(950, 220, 130, 260)
    ctx.globalAlpha = 1
    let y = 245
    ctx.font = '20px Arial'
    ctx.fillStyle = 'white'
    d = sortedObj(d)
    for (const [n, b] of Object.entries(d)) {
      ctx.textAlign = 'left'
      ctx.fillText((y - 220) / 25 + '. ' + n, 955, y)
      ctx.textAlign = 'right'
      ctx.fillText(b, 1075, y)
      y += 25
    }
    ctx.textAlign = 'left'
  }

  update () {
    for (let i = 0; i < this.mobs.length; i++) {
      this.mobs[i].update()
      if (this.mobs[i].health < 1) {
        player.items.damage += 1 + Math.floor(Math.random() * (this.mobs[i].level - 1))
        if (this.mobs[i].level > 1) player.items.speed += 1 + Math.floor(Math.random() * (this.mobs[i].level - 2))
        if (this.mobs[i].level > 2) player.items.health += 1
        player.bal += 4 * 2 ** this.mobs[i].level
        ws.send('4' + JSON.stringify({ room, index: i, mob: undefined, level: this.mobs[i].level }))
      } else if (touch(this.mobs[i], player)) {
        player.health -= this.mobs[i].damage
        ws.send('4' + JSON.stringify({ room, index: i, mob: undefined, level: this.mobs[i].level }))
      }
    }
  }

  sychronize (m) {
    for (let k = 0; k < m.coins.length; k++) {
      this.coins[k].sychronize(m.coins[k])
    }
    for (let k = 0; k < m.mobs.length; k++) {
      this.mobs[k].sychronize(m.mobs[k])
    }
  }
}

class Shuriken {
  constructor (x, y, vec, size) {
    this.x = x
    this.y = y
    this.width = size
    this.height = size
    this.vec = vec
    this.velocity = 20
    this.count = 0
  }

  draw () {
    draw(this, shurikenSkins[this.count%2])
  }

  update () {
    this.x += this.vec[0] * this.velocity
    this.y += this.vec[1] * this.velocity
    this.r += Math.PI / 5
    this.count += 1
  }
}

class Player {
  constructor (nickname, room) {
    this.nickname = nickname
    this.room = room
    this.bal = 0
    this.velocity = 15
    this.maxHealth = 100
    this.health = this.maxHealth
    this.damage = 10
    this.width = 40
    this.height = 60
    this.shurikenWidth = 17
    this.x = Math.floor(Math.random() * 1000 + 4500)
    this.y = Math.floor(Math.random() * 1000 + 4500)
    this.shurikens = []
    this.enemy = undefined
    this.skin = document.querySelector('img').getAttribute('id')
    this.items = { damage: 0, speed: 0, health: 0, sugar: 0, fire: 0, heart: 0 }
  }

  draw () {
    ctx.font = '20px Arial'
    ctx.fillStyle = 'red'
    ctx.fillRect(5, 30, this.health / this.maxHealth * 100, 20)
    ctx.fillStyle = 'purple'
    ctx.fillText(this.nickname, 5, 25)
    ctx.fillStyle = 'black'
    ctx.fillText(this.bal, 5, 75)
    ctx.fillStyle = 'black'
    ctx.drawImage(damage, 5, 85)
    ctx.fillText(this.items.damage, 39, 105)
    ctx.drawImage(speed, 5, 115)
    ctx.fillText(this.items.speed, 39, 135)
    ctx.drawImage(health, 5, 145)
    ctx.fillText(this.items.health, 39, 165)
    ctx.drawImage(fire, 5, 175)
    ctx.fillText(this.items.fire, 39, 195)
    ctx.drawImage(sugar, 5, 205)
    ctx.fillText(this.items.sugar, 39, 225)
    ctx.drawImage(heart, 5, 235)
    ctx.fillText(this.items.heart, 39, 255)
    draw(this, skins[this.skin])
    for (const s of this.shurikens) s.draw()
  }

  move (direction) {
    switch (direction) {
      case 'left':
        if (this.x - this.velocity > 0) this.x -= this.velocity + this.items.sugar * 2
        break
      case 'right':
        if (this.x + this.velocity < 10000) this.x += this.velocity + this.items.sugar * 2
        break
      case 'up':
        if (this.y - this.velocity > 0) this.y -= this.velocity + this.items.sugar * 2
        break
      case 'down':
        if (this.y + this.velocity < 10000) this.y += this.velocity + this.items.sugar * 2
        break
    }
  }

  shoot (vec) {
    this.shurikens.push(new Shuriken(this.x, this.y, vec, this.shurikenWidth))
  }

  update () {
    this.shurikens.forEach(s => {
      if (s.count > 30) delete this.shurikens[this.shurikens.indexOf(s)]
      else {
        for (let j = 0; j < map.coins.length; j++) {
          if (map.coins[j] && touch(map.coins[j], s)) {
            this.bal += 1
            ws.send('3' + JSON.stringify({ index: j, room }))
          }
        }
        for (let j = 0; j < map.mobs.length; j++) {
          if (touch(map.mobs[j], s) && !safe(player)) {
            map.mobs[j].health -= this.damage + this.items.fire * 5
            delete this.shurikens[this.shurikens.indexOf(s)]
          }
        }
        for (const p of Object.values(players)) {
          if (touch(s, p)) {
            delete this.shurikens[this.shurikens.indexOf(s)]
          }
        }
      }
    })
    this.shurikens = this.shurikens.filter(function (n) { return n !== undefined })
    if (!safe(this)) {
      for (const p of Object.keys(players)) {
        for (const s of players[p].shurikens) {
          if (touch(this, s) && !safe(players[p])) {
            player.health -= players[p].damage
            player.enemy = p
          }
        }
      }
    }
    this.shurikens.forEach(s => s.update())
  }
}

function safe (p) {
  return p.x > 4500 && p.x < 5500 && p.y > 4500 && p.y < 5500
}

function down (event) {
  if (event.keyCode in keys) keys[event.keyCode] = true
  else if (event.keyCode === 69) {map.pnjDamage.update(), map.pnjSpeed.update(), map.pnjHealth.update()}
}

function up (event) {
  if (event.keyCode in keys) keys[event.keyCode] = false
}

function click (event) {
  // produit en croix pour calculer les coordonnées du vecteurs sur la fenetre
  const x = 1080 * event.x / window.innerWidth - 540
  const y = 720 * event.y / window.innerHeight - 360
  
  // division par la norme du vecteur pour avoir un vecteur unitaire
  const d = Math.sqrt(x ** 2 + y ** 2)
  player.shoot([x / d, y / d])
}

function playing () {
  if (keys[38] === true || keys[90] === true) player.move('up')
  if (keys[39] === true || keys[68] === true) player.move('right')
  if (keys[40] === true || keys[83] === true) player.move('down')
  if (keys[81] === true || keys[37] === true) player.move('left')

  player.update()
  map.update()

  map.draw()
  player.draw()

  ws.send('1' + JSON.stringify({ room: player.room, player: { nickname: player.nickname, skin: player.skin, height: player.height, width: player.width, damage: player.damage, bal: player.bal, x: player.x, y: player.y, shurikens: player.shurikens.map(s => { return { x: s.x, y: s.y, width: s.width, height: s.height, skin: s.skin, count: s.count } }) } }))
  if (player.health < 1) {
    ws.send('2' + JSON.stringify({ room: player.room, nickname: player.nickname, enemy: player.enemy, bal: player.bal }))
    console.log('dead')
    location.reload()
  }
}

function start (name) {
  document.getElementById('canvas').style.display = 'block'
  document.getElementById('footer').style.display = 'none'
  document.getElementById('room').style.display = 'none'

  if (name) {
    room = name
    map = new Map(rooms[room].map.seed)
    map.sychronize(rooms[room].map)
    ws.send('0' + JSON.stringify({ room, nickname }))
  } else {
    seed = Math.floor(Math.random() * 10000)
    map = new Map(seed)
    room = nickname
    ws.send('0' + JSON.stringify({ room, seed, nickname }))
  }

  player = new Player(nickname, room)

  document.addEventListener('keydown', down)
  document.addEventListener('keyup', up)
  canvas.addEventListener('click', click)

  const game = setInterval(() => { playing(map, player) }, 60)
}

function touch (a, b, d) {
  d = d || 0
  return a.x - a.width / 2 - b.width / 2 - d < b.x && b.x < a.x + a.width / 2 + b.width / 2 + d && a.y - a.height / 2 - b.height / 2 - d < b.y && b.y < a.y + a.height / 2 + b.height / 2 + d
}

function sortedObj (obj) {
  items = Object.entries(obj)

  items.sort(function (first, second) {
    return second[1] - first[1]
  })
  const sorted_obj = {}
  items.forEach(function (v) {
    sorted_obj[v[0]] = v[1]
  })
  return (sorted_obj)
}

function draw(element, img) {
  img = img || element.skin
  // calcul de la position relative au joueur puis dessin
  ctx.drawImage(img, element.x - player.x + canvas.x/2 - element.width / 2, element.y + canvas.y/2 - player.y - element.height / 2, element.width, element.height)
}

function play () {
  if (document.getElementById('nickname').style.backgroundColor === 'lightsalmon') return
  document.getElementById('home').style.display = 'none'
  document.getElementById('room').style.display = 'block'
  nickname = document.getElementById('nickname').value
  for (const name of Object.keys(rooms)) {
    document.getElementById('room').innerHTML += "<button type='button' onclick=\"start('" + name + "')\" id='start'>JOIN " + name + '</button>'
  }
}

ws.addEventListener('open', () => {
  console.log('connected to server')
})

ws.addEventListener('message', ({ data }) => {
  const type = data[0]
  data = JSON.parse(data.substring(1))
  if (type === '0') {
    rooms = data
  } else if (type === '1') {
    map.sychronize(data.map)
    delete data.players[player.nickname]
    players = data.players
  } else if (type === '2') {
    player.bal += Math.floor(data.bal / 4)
  }
})

document.addEventListener('keydown', () => setTimeout(check, 100))

function check () {
  const n = document.getElementById('nickname')
  n.style.backgroundColor = '#75ff33'
  if (!n.value) n.style.backgroundColor = 'lightsalmon'
  else if (n.value.length > 12) n.style.backgroundColor = 'lightsalmon'
  else {
    for (const [name, room] of Object.entries(rooms)) {
      if (n.value === name) n.style.backgroundColor = 'lightsalmon'
      for (p of Object.keys(room.players)) {
        if (n.value === p) {
          n.style.backgroundColor = 'lightsalmon'
        }
      }
    }
  }
}
