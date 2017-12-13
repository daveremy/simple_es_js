
class RequiredFieldError extends Error {
  constructor(fieldName) {
    super("Expected required field: " + fieldName);
  }
}

class InvalidPlayerError extends Error {
  constructor(player) {
    super("Invalid Player.  Player either missing or not one of the initial players.  Player provided: " + player + ".");
  }
}

class NotPlayersTurnError extends Error {
  constructor(player) {
    super("Player: " + player + " attempted to move when not that player's turn");
  }
}

class SquareAlreadyClaimedError extends Error {
  constructor(square) {
    super("Square: [" + square[0] + ", " + square[1] + "] already claimed.");
  }
}

class InvalidSquareError extends Error {
  constructor(squareParameters) {
    super("Invalid square requested, either not a number or outside game board boundaries (0,0 - 3,3). Received " + squareParameters[0] + "," + squareParameters[1] + ".");
  }
}

module.exports = {
  RequiredFieldError : RequiredFieldError,
  InvalidPlayerError : InvalidPlayerError,
  NotPlayersTurnError : NotPlayersTurnError,
  SquareAlreadyClaimedError : SquareAlreadyClaimedError,
  InvalidSquareError: InvalidSquareError
}
