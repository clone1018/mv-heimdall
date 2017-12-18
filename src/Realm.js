export default class Realm {

  constructor(name, wss) {
    this.name = name;
    this.wss = wss;

    this.maps = {};
    this.players = {};
    this.countPlayers = 0;
  }

  run() {

  }

  broadcast(data) {
    console.log('broadcast json: %s', data);
    this.wss.broadcast(data);
  }

  addMap(map) {
    this.maps[map.id] = map;
  }

  addPlayer(player) {
    this.players[player.id] = player;
    this.maps[player.map_id].players[player.id] = player;
    this.countPlayers++;
  }

  removePlayer(player) {
    this.countPlayers--;
    delete this.players[player.id];
    delete this.maps[player.map_id].players[player.id];
  }

  updatePlayer(player) {
    this.players[player.id] = player;

    // Update map
    this.maps[player.map_id].players[player.id] = player;
  }

}