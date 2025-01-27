// ~ const http = require("http");

const seedrandom = require('seedrandom')

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8082 })

const rooms = {}

class Mob {
  constructor (rand, level) {
	if (level === 1) {
		this.x = Math.floor(rand() * 4000 + 2000)
		this.y = Math.floor(rand() * 4000 + 2000)
		while (this.x > 4450 && this.x < 5550 && this.y > 4450 && this.y < 5550) {
		  this.x = Math.floor(rand() * 2000 + 4000)
		  this.y = Math.floor(rand() * 2000 + 4000)
		}
	} else {
		const r = rand()
		if (r < 0.25) {
			this.x = Math.floor(rand() * (level * 2500 + 500 * (level - 1))) + 1500 * (4 - level)
			this.y = Math.floor(rand() * 1500) + 1500 * (3 - level)
		} else if (r < 0.5) {
			this.x = Math.floor(rand() * 1500) + level * 2500 + 500 * (level - 1)
			this.y = Math.floor(rand() * (level * 2500 + 500 * (level - 1))) + (4 - level) * 1500
		} else if (r < 0.75) {
			this.x = Math.floor(rand() * (level * 2500 + 500 * (level - 1))) + 1500 * (3 - level)
			this.y = Math.floor(rand() * 1500) + level * 2500 + 500 * (level - 1) + 1500 * (3 - level)
		} else {
			this.x = Math.floor(rand() * 1500) + 1500 * (3 - level)
			this.y = Math.floor(rand() * (level * 2500 + 500 * (level - 1))) + 1500 * (3 - level)
		}
	  }
	  this.health = 50 * level ** 2
	}
}

class Coin {
  constructor (rand) {
    this.x = Math.floor(rand() * 10000)
    this.y = Math.floor(rand() * 10000)
  }
}

class Map {
  constructor (seed) {
    this.coins = []
    this.mobs = []
    this.seed = seed
    this.rand = seedrandom(seed)
    for (let i = 0; i < 200; i++) {
      this.mobs.push(new Mob(this.rand, 1))
    }
    for (let i = 0; i < 400; i++) {
      this.mobs.push(new Mob(this.rand, 2))
    }
    for (let i = 0; i < 600; i++) {
      this.mobs.push(new Mob(this.rand, 3))
    }

    for (let i = 0; i < 2000; i++) {
      this.coins.push(new Coin(this.rand))
    }
  }
}

wss.on('connection', (ws) => {
  console.log('New client connected')
  ws.send('0' + JSON.stringify(rooms))

  ws.on('message', (data) => {
    const type = data.toString()[0]
    data = JSON.parse(data.toString().substring(1))
    if (type === '0') {
      if (!(data.room in rooms)) {
        console.log('new room')
        rooms[data.room] = { seed: data.seed, clients: {}, players: {}, map: new Map(data.seed) }
      }
      rooms[data.room].clients[data.nickname] = ws
    } else if (type === '1') {
      rooms[data.room].players[data.player.nickname] = data.player
      ws.send('1' + JSON.stringify({ players: rooms[data.room].players, map: rooms[data.room].map }))
    } else if (type === '2') {
      delete rooms[data.room].players[data.nickname]
      delete rooms[data.room].clients[data.nickname]
      if (data.enemy && data.enemy in Object.keys(rooms[data.room].players)) rooms[data.room].clients[data.enemy].send('2' + JSON.stringify({ bal: data.bal }))
    } else if (type === '3') {
      rooms[data.room].map.coins[data.index] = new Coin(rooms[data.room].map.rand)
    } else if (type === '4') {
      if (data.mob) {
        rooms[data.room].map.mobs[data.index].x = data.mob.x
        rooms[data.room].map.mobs[data.index].y = data.mob.y
        rooms[data.room].map.mobs[data.index].health = data.mob.health
      } else rooms[data.room].map.mobs[data.index] = new Mob(rooms[data.room].map.rand, data.level)
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
    for (const l of Object.values(rooms)) {
      for (const [nickname, client] of Object.entries(l.clients)) {
        if (client._socket === ws._socket) {
          delete l.players[nickname]
          delete l.clients[nickname]
          console.log('deleted player')
        }
      }
    }
  })
})

// Supprimer les salons vident toutes les 5 min
//~ function running () {
  //~ for (const [n, r] of Object.entries(rooms)) {
    //~ if (!Object.keys(r.players).length) {
      //~ delete rooms[n]
    //~ }
  //~ }
  //~ for (const room in rooms) {
	//~ for (ws of Object.values(rooms[room].clients)) ws.send('0' + JSON.stringify(rooms))  
  //~ }
//~ }

//~ const server = setInterval(running, 300000)
