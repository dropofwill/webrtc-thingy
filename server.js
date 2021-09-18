const express = require('express')
const process = require('process')
const port = 8080;

const app = express()
app.use(express.static('client/dist'));

const alphabet = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789∆Λ';
const roomRegistry = {}

function toJson(room) {
  return JSON.stringify({
    roomId: room.roomId,
    hostPeerId: room['hostPeerId'],
    peers: Array.from(room['peers']),
  });
}

function getRandomArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function createRoomId() {
  return Array.from({ length: 3 },
    (x, i) => alphabet[getRandomArbitrary(0, alphabet.length - 1)])
    .reduce((a, b) => a + b);
}

app.post('/rooms', express.json(), (req, res) => {
  const hostPeerId = req.body['hostPeerId'];
  const newRoomId = createRoomId();

  roomRegistry[newRoomId] = {
    roomId: newRoomId,
    hostPeerId: hostPeerId,
    peers: new Set()
  };

  res.send(toJson(roomRegistry[newRoomId]));
});

app.post('/rooms/:roomId/peers/:peerId', (req, res) => {
  const roomId = req.params['roomId'];
  const peerId = req.params['peerId'];

  if (roomRegistry[roomId] != null) {
    roomRegistry[roomId].peers.add(peerId)
    res.send(toJson(roomRegistry[roomId]));
  } else {
    res.send(404);
  }
});

app.get('/rooms/:roomId', (req, res) => {
  const roomId = req.params['roomId'];

  if (roomRegistry[roomId] != null) {
    res.send(toJson(roomRegistry[roomId]));
  } else {
    res.send(404);
  }
});

app.get('/rooms', (req, res) => {
  res.send(Object.values(roomRegistry).map(toJson));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
})

