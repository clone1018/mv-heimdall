export default class Map {
  /**
   * Gotta do crazy stuff in here like set server side collisions.
   * This should mostly load game json to set data.
   */

  constructor(id) {
    this.id = id;

    this.players = {};
    this.countPlayers = 0;
  }

  run() {

  }

  broadcast(data) {
    console.log('broadcast json to %s: %s', this.id, data);
    for(const i in this.players) {
      const player = this.players[i];
      try {
        player.client.send(data);
        console.log('broadcast sent to ' + player.id);
      } catch(e) {
        this.removePlayer(player)
      }
    }
  }

  addPlayer(player) {
    this.players[player.id] = player;
    this.countPlayers++;
  }

  removePlayer(player) {
    this.countPlayers--;
    delete this.players[player.id];
  }

  updatePlayer(player) {
    this.players[player.id] = player;
  }

}