const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8101 });

const players = {
  1: {
    id: 1,
    x: 10,
    y: 10
  }
};


wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

wss.on('connection', function connection(ws, req) {
  console.log("New connection from " + req.connection.remoteAddress);

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    let msg = JSON.parse(message);
    let event = msg.event;
    let data = msg.data;

    if(event == "CONNECT") {
      players[data.game_id] = {
        id: data.game_id,
        x: null,
        y: null,
        characterIndex: null,
        characterName: null,
        direction: null,
        moveSpeed: null,
        moveFrequency: null
      };
    }

    if(event == "PLAYER_MOVE") {
      players[data.id].x = data.x;
      players[data.id].y = data.y;
      players[data.id].characterIndex = data.characterIndex;
      players[data.id].characterName = data.characterName;
      players[data.id].direction = data.direction;
      players[data.id].moveSpeed = data.moveSpeed;
      players[data.id].moveFrequency = data.moveFrequency;

      // Send to all clients
      wss.broadcast(JSON.stringify({event: "PLAYER_MOVE", data: players[data.id]}));
    }

    //ws.send(JSON.stringify({event: "PLAYER_MOVE", data: players[1]}));

    //console.log(players);

  });
});