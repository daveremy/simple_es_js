let assert =  require('assert');
let Game = require('../app/game.js');
let { RequiredFieldError } = require('../app/errors');

describe('Game', function() {
  describe('CreateGame', function() {
    it('should result in a GameCreatedEvent with correct id', function() {
      let createGameCommand = require('../app/commands/createGame.js');
      createGame = new createGameCommand('123', 'John', 'Jane');
      let game = new Game().handleCreateGame(createGame);
      let resultEvents = game.getEvents();
      assert.equal(1, resultEvents.length);
      let event = resultEvents[0];
      assert.equal('GameCreated', event.constructor.name);
      assert.equal(createGame.id, event.id);
      assert.equal(createGame.xplayer, event.xplayer);
      assert.equal(createGame.oplayer, event.oplayer);
    })
    it('should fail if gameid not provided', () => {
      let createGameCommand = require('../app/commands/createGame');
      var createGame = new createGameCommand('', 'John', 'Jane');
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError );
      createGame = new createGameCommand();
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError );
    })
    it('should fail if x or o player not provided', () => {
      let createGameCommand = require('../app/commands/createGame');
      var createGame = new createGameCommand('123', '', 'Jane');
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError );
      createGame = new createGameCommand('123');
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError );
      createGame = new createGameCommand('123', 'John', '');
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError );
      createGame = new createGameCommand('123', 'John');
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError );
    })
  })
})