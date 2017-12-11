'use strict'
let { RequiredFieldError } = require('./errors');

class Game {

  constructor() {
    this.events = [];
  }

  registerEvent(e) {
    // Call local 'apply' event method
    this['apply' + e.constructor.name](e);
    // Push the event to list of events created for this command
    this.events.push(e);
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

  handleClaimSquare(claimSquare) {
    this.checkRequired([['player', claimSquare.player],
                        ['square', claimSquare.square]]);
    var squareClaimed = new SquareClaimed(claimSquare.player, claimSquare.square);
    this.registerEvent(squareClaimed);
    return this;
  }
  // End Command Handlers --------------

  // Event Handlers --------------------
  // Note these methods will be called for rehydration as well
  //  internally (see registerEvent(e)) to set state.
  applyGameCreated(gameCreated) {
    this.gameBoard = [ [], [], [] ];
    this.xplayer = gameCreated.xplayer;
    this.oplayer = gameCreated.oplayer;
    // x goes first
    this.nextPlayer = gameCreated.xplayer;
  }

  applySquareClaimed(squareClaimed) {
    var char;
    if (squareClaimed.player = this.xplayer) {
      char = 'X';   
      this.nextPlayer = this.oplayer;
    } else {
      char = 'O';
      this.nextPlayer = this.xplayer;
    }
    this.gameBoard[squareClaimed.square[0], squareClaimed.square[1]] = char;
  }
  // End Event Handlers ==================
    
  getUncommittedEvents() {
    return this.events;
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

class SquareClaimed {
  constructor(player, square) {
    this.player = player;
    this.square = square;
  }
}

module.exports = Game;
