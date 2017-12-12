'use strict'
let { RequiredFieldError, NotPlayersTurnError, SquareAlreadyClaimedError, InvalidSquareError } = require('./errors');

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
    // assure this is the correct next  player
    if (claimSquare.player != this.nextPlayer) {
      throw new NotPlayersTurnError(claimSquare.player);
    }
    // check that input square values are valid
    if (!(this.isValidSquare(claimSquare.square[0]) && this.isValidSquare(claimSquare.square[1]))) {
      throw new InvalidSquareError(claimSquare.square); 
    }
    // assure square is a valid square on the game board
    let claimedSquare = this.gameBoard[claimSquare.square[0]][claimSquare.square[1]];
    // assure this square isn't already claimed
    if (!(claimedSquare === "Unclaimed")) {
      throw new SquareAlreadyClaimedError(claimSquare.square);
    }
    var squareClaimed = new SquareClaimed(claimSquare.player, claimSquare.square);
    this.registerEvent(squareClaimed);
    return this;
  }
  // End Command Handlers --------------

  // Event Handlers --------------------
  // Note these methods will be called for rehydration as well
  //  internally (see registerEvent(e)) to set state.
  applyGameCreated(gameCreated) {
    this.gameBoard = [ ["Unclaimed", "Unclaimed", "Unclaimed"],
                       ["Unclaimed", "Unclaimed", "Unclaimed"],
                       ["Unclaimed", "Unclaimed", "Unclaimed"] ];
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
  isValidSquare(index) {
    return Number.isInteger(index) && index >= 0 && index < 3;
  }

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
