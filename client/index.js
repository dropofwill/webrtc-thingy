import Peer from 'peerjs';

console.log("hello");
const id1 = '1-will';
const id2 = '2-will';

const peer1 = new Peer(id1);
const peer2 = new Peer(id2);

const conn = peer1.connect(id2);
conn.on('open', () => {
  conn.send('hi!');
});

peer2.on('connection', (conn) => {
  conn.on('data', (data) => {
    // Will print 'hi!'
    console.log(data);
  });
  conn.on('open', () => {
    conn.send('hello!');
  });
});
