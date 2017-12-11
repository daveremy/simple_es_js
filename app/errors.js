
class RequiredFieldError extends Error {
  constructor(fieldName) {
    super("Expected required field: " + fieldName);
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

module.exports = {
  RequiredFieldError : RequiredFieldError,
  NotPlayersTurnError : NotPlayersTurnError,
  SquareAlreadyClaimedError : SquareAlreadyClaimedError
}
