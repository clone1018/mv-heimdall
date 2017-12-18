import Map from "./Map";

console.log("Welcome to Heimdall");

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8101 });

console.log("Spawned Web Socket Server");

import Realm from "./Realm";
import Player from "./Player";

let realm = new Realm('Development Server', wss);
realm.run();

console.log("Spawned Realm: " + realm.name);

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

// This is temporary login until database
let createMaps = [1,2,3,4];
createMaps.forEach(function each(map_id) {
  let map = new Map(map_id);
  console.log("Adding map: " + map_id);
  realm.addMap(map);
});

wss.on('connection', function connection(ws, req) {
  console.log("New connection from " + req.connection.remoteAddress);

  let player = new Player(ws, realm);
  player.listen();
});