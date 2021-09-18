import Peer from 'peerjs';
import { v4 } from 'uuid';

const peerHost = new Peer(v4());

function connect(hostPeer, clientPeerId) {
  const conn = hostPeer.connect(clientPeerId);
  conn.on('open', () => {
    conn.send('hi!');
  });
}

fetch('/rooms', { 
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({'hostPeerId': peerHost.id })
})
  .then(response => response.json())
  .then((v) => {
    const roomId = v["roomId"]
    document.querySelector("#roomId").innerHTML = roomId

    window.setInterval(() =>
      fetch('/rooms/' + roomId)
      .then(response => response.json())
      .then((v) => { 
        console.log(v);
        v['peers'].forEach((p) => connect(peerHost, p));
      }), 1000);
  })

