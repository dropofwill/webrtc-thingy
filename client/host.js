import { v4 } from 'uuid';

const id = v4()

fetch('/rooms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 'hostPeerId': id })
})
  .then(response => response.json())
  .then((v) => {
    const roomId = v["roomId"]
    document.querySelector("#roomId").innerHTML = roomId

    // window.setInterval(() =>
    //   fetch('/rooms/' + roomId)
    //   .then(response => response.json())
    //   .then((v) => {
    //     console.log(v);
    //     v['peers'].forEach((p) => connect(peerHost, p));
    //   }), 1000);
  })

