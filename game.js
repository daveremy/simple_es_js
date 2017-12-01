'use strict'

class Game {

  constructor(createGameCommand) {
    this._events = [];
    var gameCreated = new GameCreated(createGameCommand.id,
                                      createGameCommand.xplayer,
                                      createGameCommand.yplayer);
    this._events.push(gameCreated);
  }

  getEvents() {
    return this._events;
  };
  
};

class GameCreated {
  constructor(id, xplayer, yplayer) {
    this.id = id;
    this.xplayer = xplayer;
    this.yplayer = yplayer;
  }
}

module.exports = Game;
