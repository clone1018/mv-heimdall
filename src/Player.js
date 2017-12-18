import Types from "./types";
import Map from "./Map";

export default class Player {
  constructor(client, realm) {
    this.client = client;
    this.realm = realm;

    this.id = 1;
    this.map_id = 4; // temp
    this.x = null;
    this.y = null;
    this.characterIndex = null;
    this.characterName = null;
    this.direction = null;
    this.moveSpeed = null;
    this.moveFrequency = null;
  }

  listen() {
    let player = this;

    this.client.on('message', function (json) {
      console.log('received json: %s', json);
      const message = JSON.parse(json);

      let action = parseInt(message[0]);
      let sendBack = false;

      if (action === Types.Messages.CONNECT) {
        sendBack = true;

        player.id = message[1];

        player.realm.addPlayer(player);
      } else if(action === Types.Messages.SPAWN) {
        sendBack = true;

        if(player.map_id !== null) {

          player.realm.maps[player.map_id].broadcast(JSON.stringify([
            Types.Messages.DESPAWN,
            player.id
          ]));
        }
        player.setMap(message[1]);
        //
        // player.setPosition({
        //   x: message[2],
        //   y: message[3],
        //   characterIndex: message[4],
        //   characterName: message[5],
        //   direction: message[6],
        //   moveSpeed: message[7],
        //   moveFrequency: message[8],
        // });

      } else if (action === Types.Messages.MOVE) {
        sendBack = true;

        player.setPosition({
          x: message[1],
          y: message[2],
          characterIndex: message[3],
          characterName: message[4],
          direction: message[5],
          moveSpeed: message[6],
          moveFrequency: message[7],
        });
      }


      if(sendBack) {
        let toPlayers = message;
        toPlayers.splice(1, 0, player.id);
        player.realm.maps[player.map_id].broadcast(JSON.stringify(toPlayers));
      }
    });
  }

  setMap(map_id) {
    this.realm.maps[this.map_id].removePlayer(this);
    this.map_id = map_id;
    this.realm.maps[map_id].addPlayer(this);

    this.realm.updatePlayer(this);
  }

  setPosition(moveDetail) {
    this.x = moveDetail.x;
    this.y = moveDetail.y;
    this.characterIndex = moveDetail.characterIndex;
    this.characterName = moveDetail.characterName;
    this.direction = moveDetail.direction;
    this.moveSpeed = moveDetail.moveSpeed;
    this.moveFrequency = moveDetail.moveFrequency;

    this.realm.updatePlayer(this);
  }
}