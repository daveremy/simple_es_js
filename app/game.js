'use strict'
let { RequiredFieldError } = require('./errors');

class Game {

  constructor() {
    this._events = [];
  }

  registerEvent(e) {
    // Call local 'apply' event method
    this['apply' + e.constructor.name](e);
    // Push the event to list of events created for this command
    this._events.push(e);
  }

  // Command Handlers -------------------
  handleCreateGame(createGame) {
    this.checkRequired([['id', createGame.id],
                        ['xplayer', createGame.xplayer],
                        ['oplayer', createGame.oplayer]]);
    var gameCreated = new GameCreated(createGame.id,
                                      createGame.xplayer,
                                      createGame.oplayer);
    this.registerEvent(gameCreated);
    return this;
  }

  placeXorO(placeXorOCommand) {
    //
  }
  // End Command Handlers --------------

  // Event Handlers --------------------
  // Note these methods will be called for rehydration as well
  //  internally (see registerEvent(e)) to set state.
  applyGameCreated(gameCreated) {
    this._game_board = [ [], [], [] ];
    this._xplayer = gameCreated.xplayer;
    this._oplayer = gameCreated.oplayer;
    // x goes first
    this._next_player = gameCreated.xplayer;
  }
  // End Event Handlers ==================
    
  // helper to see events, todo: remove
  getEvents() {
    return this._events;
  };
  
  checkRequired(fields) {
    for (var field of fields) {
      if (field[1] == null || field[1] == '') {
        throw new RequiredFieldError(field[0]);
      }
    }
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
