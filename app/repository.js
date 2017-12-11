let Game = require('../app/game.js');

class Repository {
  constructor() {
    this.repo = {};
  }

  pushEvents(id, events) {
    if (!id) throw new Error("required parameter id not provided");
    if (!events) throw new Error("required parameter events not provided");
    if (!(id in this.repo)) {
      this.repo[id] = []
    }; 

    for (let event of events) {
      this.repo[id].push(event);
    }
  }

  getEvents(id) {
    if (!id) throw new Error("required parameter id not provided");
    return this.repo[id];
  }
}

class GameRepository extends Repository {
  hydrate(id) {
    var game = new Game();
    // check whether there any events yet for this game
    //  if not then just return (game is being created)
    if (!(id in this.repo)) {
      return game;
    }
    for (var event of this.repo[id]) {
      // apply each event in history
      game['apply' + event.constructor.name](event);
    }
    return game;
  }
}

module.exports = GameRepository;
