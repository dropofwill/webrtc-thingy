import Peer from 'peerjs';
import { v4 } from 'uuid';

const peer = new Peer(v4());

if (window.location.hash != '') {
  console.log(window.location.hash);
  const url = '/rooms/' + 
    window.location.hash.replace('#', '') + 
    '/peers/' + peer.id;
  console.log(url);

  fetch(url, { method: 'POST' })
}

peer.on('connection', (conn) => {

  conn.on('data', (data) => {
    console.log(data);
    document.querySelector('body').innerHTML = data
  });

  conn.on('open', () => {
    conn.send('hello!');
  });
});
