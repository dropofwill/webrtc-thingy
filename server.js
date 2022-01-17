const express = require('express')
const process = require('process')
const cors = require('cors');
const { WebSocketServer, WebSocket } = require('ws');
const port = 8080;

const app = express()
app.use(express.static('client/dist'));
app.use(cors())

const alphabet = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
const roomRegistry = {}

new WebSocketServer({ port: 8888 })
  .on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      let d = JSON.parse(data);
      let roomId = d["roomId"]
      console.log('received: %s', d);

      if (d["type"] == "join") {
        addPeerToRoom(roomId, ws);
      } else if (d["type"] == "event") {
        broadcastToRoom(roomId, ws, data);
      } else {
        console.error("invalid event type " + d["type"]);
      }
    });
  });


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
    () => alphabet[getRandomArbitrary(0, alphabet.length - 1)])
    .reduce((a, b) => a + b);
}

function broadcastToRoom(roomId, self, data) {
  if (roomRegistry[roomId] != null &&
    roomRegistry[roomId].peers != null) {

    roomRegistry[roomId].peers.forEach((peer) => {
      if (peer.readyState === WebSocket.OPEN && peer !== self) {
        peer.send(data);
      } else if (peer === self) {
        console.log("skipping for self");
      }
    });
  } else {
    console.error("no room with id " + roomId);
  }
}

function addPeerToRoom(roomId, wsConnection) {
  if (roomRegistry[roomId] != null &&
    roomRegistry[roomId].peers != null) {
    roomRegistry[roomId].peers.add(wsConnection)
  } else {
    console.error("no room with id " + roomId);
  }
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

app.post('/rooms/:roomId/peers/', express.json(), (req, res) => {
  const roomId = req.params['roomId'];
  console.log(req)
  console.log(req.body)

  if (roomRegistry[roomId] != null) {
    roomRegistry[roomId].peers.add(req.body)
    res.send(toJson(roomRegistry[roomId]));
  } else {
    res.send(404);
  }
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

