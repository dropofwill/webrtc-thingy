import { v4 } from 'uuid';

const peerId = v4();

if (window.location.hash != '') {
  console.log(window.location.hash);
  const roomId = window.location.hash.replace('#', '');
  const ws = new WebSocket('wss://' + window.location.host);

  ws.addEventListener('open', function open() {
    ws.send(JSON.stringify({
      "type": "join",
      "roomId": roomId,
      "peerId": peerId,
      "message": "connect from client"
    }));

    document.addEventListener("click", () => {
      ws.send(JSON.stringify({
        "type": "event",
        "roomId": roomId,
        "message": "button clicked"
      }));
    });
  });

  ws.addEventListener('message', function message(e) {
    console.log('received: %s', e.data);
    let d = e.data
    document.querySelector('#responses').innerHTML =
      d["roomId"] + " ∆ " + d["message"]
  });
} else {
  document.querySelector('#responses').innerHTML =
    "add a room code hash to the url and refresh, e.g. #GHF"
}

// peer.on('connection', (conn) => {
//
//   conn.on('data', (data) => {
//     console.log(data);
//     document.querySelector('body').innerHTML = data
//   });
//
//   conn.on('open', () => {
//     conn.send('hello!');
//   });
// });
