
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

module.exports = {
  RequiredFieldError : RequiredFieldError,
  NotPlayersTurnError : NotPlayersTurnError
}
