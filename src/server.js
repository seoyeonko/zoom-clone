import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // http server 위에 web socket server
// 동일한 port에서 http, ws req 처리 가능

function onSocketClose() {
  console.log('Disconnected from the Browser! ❌');
}

const sockets = []; // 접속자

wss.on('connection', (socket) => {
  sockets.push(socket);
  socket['nickname'] = 'Anon'; // default nickname
  console.log('Connected to Browser! ✅');
  socket.on('close', onSocketClose);
  socket.on('message', (msg) => {
    // user가 보낸 msg; user에게 보여주기

    // JSON.parse(): string -> javascript Object
    const message = JSON.parse(msg.toString());

    switch (message.type) {
      case 'new_message':
        sockets.forEach((aSocket) => {
          aSocket.send(`${socket.nickname} : ${message.payload}`);
        });

      case 'nickname':
        socket['nickname'] = message.payload; // socket은 object이므로 new 정보 저장 가능
    }
  });
});

server.listen(3000, handleListen);
