'use strict'
let {RequiredFieldError, InvalidPlayerError, NotPlayersTurnError, SquareAlreadyClaimedError, InvalidSquareError} = require('./errors');

class Game {

  constructor() {
    this.events = [];
  }

  // Command Handlers -------------------
  // Command Handler methods start with "handle"
  handleCreateGame(createGameCommand) {
    this.checkRequired([
      ['id', createGameCommand.id],
      ['xplayer', createGameCommand.xplayer],
      ['oplayer', createGameCommand.oplayer]
    ]);
    var gameCreatedEvent = new GameCreated(createGameCommand.id, createGameCommand.xplayer, createGameCommand.oplayer);
    this.registerEvent(gameCreatedEvent);
    return this;
  }

  handleClaimSquare(claimSquareCommand) {
    this.checkRequired([
      ['player', claimSquareCommand.player],
      ['square', claimSquareCommand.square]
    ]);
    this.validateSquare(claimSquareCommand);
    var squareClaimedEvent = new SquareClaimed(claimSquareCommand.player, claimSquareCommand.square);
    this.registerEvent(squareClaimedEvent);
    return this;
  }

  validateSquare(claimSquareCommand) {
    // assure there is player and it is one of the two original
    if (!(claimSquareCommand.player && [this.xplayer, this.oplayer].indexOf(claimSquareCommand.player) >= 0)) {
      throw new InvalidPlayerError(claimSquareCommand.player);
    }
    // assure this is the correct next player
    if (claimSquareCommand.player != this.nextPlayer) {
      throw new NotPlayersTurnError(claimSquareCommand.player);
    }
    // check that input square values are valid
    if (!(this.isValidSquare(claimSquareCommand.square[0]) && this.isValidSquare(claimSquareCommand.square[1]))) {
      throw new InvalidSquareError(claimSquareCommand.square);
    }
    // assure square is a valid square on the game board
    let claimedSquare = this.gameBoard[claimSquareCommand.square[0]][claimSquareCommand.square[1]];
    // assure this square isn't already claimed
    if (!(claimedSquare == 0)) {
      throw new SquareAlreadyClaimedError(claimSquareCommand.square);
    }
  }

  // Event Handlers --------------------
  // Note: these methods will be called for rehydration as well as internally (see
  // registerEvent(e)) to set state.
  // Event Handler methods start with "apply"
  applyGameCreated(gameCreated) {
    this.gameBoard = [
      [ 0, 0, 0 ],
      [ 0, 0, 0 ],
      [ 0, 0, 0 ]
    ];
    this.xplayer = gameCreated.xplayer;
    this.oplayer = gameCreated.oplayer;
    // x goes first
    this.nextPlayer = gameCreated.xplayer;
  }

  applySquareClaimed(squareClaimed) {
    var squareValue;
    // X = 1, O = -1 (this will help calc winner later)
    if (squareClaimed.player = this.xplayer) {
      squareValue = 1;
      this.nextPlayer = this.oplayer;
    } else {
      squareValue = -1;
      this.nextPlayer = this.xplayer;
    }
    this.gameBoard[squareClaimed.square[0]][squareClaimed.square[1]] = squareValue;
    let winner = this.gameFinished();
    if (winner) {
      // fire game finished event
      let draw = winner == "";
      var gameFinishedEvent = new GameFinished(draw, winner);
      this.registerEvent(gameFinishedEvent);
      this.gameFinished = true;
    }
  }
  
  // Aggregate utility functions =============================

  registerEvent(e) {
    // Call local 'apply' event method
    this['apply' + e.constructor.name](e);
    // Push the event to list of events created for this command
    this.events.push(e);
  }

  getUncommittedEvents() {
    return this.events;
  }

  // Helper functions ==========================================
  
  isValidSquare(index) {
    return Number.isInteger(index) && index >= 0 && index < 3;
  }
  
  checkRequired(fields) {
    for (var field of fields) {
      if (field[1] == null || field[1] == '') {
        throw new RequiredFieldError(field[0]);
      }
    }
  };
  
  gameFinished() {
    let winner = this.gameIsWon(this.gameBoard);
    if (winner) return winner == 1 ? xplayer : oplayer;
    if (this.gameIsDraw(this.gameBoard)) return "";
    return false;
  }

  gameIsWon(gb) {
    // iterate through each axis (row, columns, diags) and
    //  check whether it adds up to 3 (X won) or -3 (O won)
    for (let a of this.axes(gb)) {
      let sum = a.reduce((sum, x) => sum + x);
      if (sum == 3) {
        return 1;
      } else if (sum == -3) {
        return -1;
      }
    }
    return false;
  }

  gameIsDraw(gb) {
    return !gb.reduce((prev, curr) => prev.concat(curr)).includes(0);
  }

  // Return the different axis as an iterable to check for 3 in a row
  * axes(gb) {
    // rows
    for (let i = 0; i < gb.length; i++) {
    yield gb[i]
    }
    // columns
    for (let i = 0; i < gb.length; i++) {
      var column = [];
      for (let j = 0; j < gb.length; j++) {
        column.push(gb[j][i]);
      }
      yield column;
    }
    // forward diagonal
    yield[gb[0][0], gb[1][1], gb[2][2]];
    // reverse diagonal
    yield[gb[0][2], gb[1][1], gb[2][0]];
  }
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

class GameFinished {
  constructor(draw, winner) {
    this.draw = draw;
    this.winner = winner;
  }
}

module.exports = Game;
