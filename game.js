'use strict'

class Game {

  constructor(createGameCommand) {
    this._events = [];
    this.handleCreateGame(createGameCommand);
  }

  registerEvent(e) {
    this['apply' + e.constructor.name](e);
    this._events.push(e);
  }

  // Command Handlers
  handleCreateGame(createGameCommand) {
    var gameCreated = new GameCreated(createGameCommand.id,
                                      createGameCommand.xplayer,
                                      createGameCommand.oplayer);
    this.registerEvent(gameCreated);
  }

  // Event Handlers
  // Note these methods will be called for rehydration as well
  //  internally (see registerEvent(e)) to set state.
  applyGameCreated(gameCreated) {
    this._game_board = [ [], [], [] ];
    this._xplayer = gameCreated.xplayer;
    this._oplayer = gameCreated.oplayer;
    // x goes first
    this._next_player = gameCreated.xplayer;
  }
    
  // helper to see events, todo: remove
  getEvents() {
    return this._events;
  };
  
};

class GameCreated {
  constructor(id, xplayer, oplayer) {
    this.id = id;
    this.xplayer = xplayer;
    this.oplayer = oplayer;
  }
}

module.exports = Game;
