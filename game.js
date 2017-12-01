'use strict'

class Game {

  constructor(createGameCommand) {
    this._events = [];
    var gameCreated = new GameCreated(createGameCommand.xplayer, createGameCommand.yplayer);
    this._events.push(gameCreated);
  }

  getEvents() {
    return this._events;
  };
  
};

class GameCreated {
  constructor(xplayer, yplayer) {
    this.xplayer = xplayer;
    this.yplayer = yplayer;
  }
}

module.exports = Game;
