
class RequiredFieldError extends Error {
  constructor(fieldName) {
    super("Expected required field: " + fieldName);
  }
}

module.exports = {
  RequiredFieldError : RequiredFieldError
}
