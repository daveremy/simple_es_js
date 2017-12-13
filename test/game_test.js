let assert = require('assert');
let Game = require('../app/game.js');
let CreateGameCommand = require('../app/commands/createGame');
let ClaimSquareCommand = require('../app/commands/claimSquare');
let CommandHandler = require('../app/commandHandler');
let GameRepository = require('../app/repository');
let { RequiredFieldError, InvalidPlayerError, NotPlayersTurnError, SquareAlreadyClaimedError,
      InvalidSquareError } = require('../app/errors');

describe('Game', () => {
  describe('CommandHandler', () => {
    it('should dispatch a command', () => {
      let repo = new GameRepository();
      let commandHandler = new CommandHandler(repo);
      commandHandler.handle(new CreateGameCommand('123', 'John', 'Jane'));
      assert.equal(1, repo.getEvents('123').length);
    })
  }),
  describe('CreateGame', () => {
    it('should result in a GameCreatedEvent with correct id', function () {
      let createGame = new CreateGameCommand('123', 'John', 'Jane');
      let game = new Game().handleCreateGame(createGame);
      let resultEvents = game.getUncommittedEvents();
      assert.equal(1, resultEvents.length);
      let event = resultEvents[0];
      assert.equal('GameCreated', event.constructor.name);
      assert.equal(createGame.id, event.id);
      assert.equal(createGame.xplayer, event.xplayer);
      assert.equal(createGame.oplayer, event.oplayer);
    })
    it('should fail if gameid not provided', () => {
      var createGame = new CreateGameCommand('', 'John', 'Jane');
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError);
      createGame = new CreateGameCommand();
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError);
    })
    it('should fail if x or o player not provided', () => {
      var createGame = new CreateGameCommand('123', '', 'Jane');
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError);
      createGame = new CreateGameCommand('123');
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError);
      createGame = new CreateGameCommand('123', 'John', '');
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError);
      createGame = new CreateGameCommand('123', 'John');
      assert.throws(() => new Game().handleCreateGame(createGame), RequiredFieldError);
    })
  }),
  describe('ClaimSquare', () => {
    it('should allow xplayer move', () => {
      let repo = new GameRepository();
      var game = new Game().handleCreateGame(new CreateGameCommand('123', 'John', 'Jane'));
      repo.pushEvents('123', game.getUncommittedEvents());
      game = repo.hydrate('123');
      let claimSquareCommand = new ClaimSquareCommand('John', [0, 0]);
      game.handleClaimSquare(claimSquareCommand);
      assert.equal(1, game.getUncommittedEvents().length);
      let event = game.getUncommittedEvents()[0];
      assert.equal('SquareClaimed', event.constructor.name);
      assert.equal(claimSquareCommand.player, event.player);
      assert.equal(claimSquareCommand.square, event.square);
    })
    it('should not allow invalid player', () => {
      let repo = new GameRepository();
      var game = new Game().handleCreateGame(new CreateGameCommand('123', 'John', 'Jane'));
      repo.pushEvents('123', game.getUncommittedEvents());
      game = repo.hydrate('123');
      // provide new player  as player making move
      var claimSquareCommand = new ClaimSquareCommand('Joe', [0, 0]);
      assert.throws(() => game.handleClaimSquare(claimSquareCommand), InvalidPlayerError); 
    })
    it('should not allow John two consecutive turns', () => {
      let repo = new GameRepository();
      var game = new Game().handleCreateGame(new CreateGameCommand('123', 'John', 'Jane'));
      repo.pushEvents('123', game.getUncommittedEvents());
      game = repo.hydrate('123');
      var claimSquareCommand = new ClaimSquareCommand('John', [0, 0]);
      game.handleClaimSquare(claimSquareCommand);
      repo.pushEvents('123', game.getUncommittedEvents());
      game = repo.hydrate('123');
      claimSquareCommand = new ClaimSquareCommand('John', [0, 1]);
      assert.throws(() => game.handleClaimSquare(claimSquareCommand), NotPlayersTurnError); 
    })
    it('should not allow move to the same square', () => {
      let repo = new GameRepository();
      var game = new Game().handleCreateGame(new CreateGameCommand('123', 'John', 'Jane'));
      repo.pushEvents('123', game.getUncommittedEvents());
      game = repo.hydrate('123');
      var claimSquareCommand = new ClaimSquareCommand('John', [0, 0]);
      game.handleClaimSquare(claimSquareCommand);
      repo.pushEvents('123', game.getUncommittedEvents());
      game = repo.hydrate('123');
      claimSquareCommand = new ClaimSquareCommand('Jane', [0, 0]);
      assert.throws(() => game.handleClaimSquare(claimSquareCommand), SquareAlreadyClaimedError); 
    })
    it('should not allow claiming an invalid square', () => {
      let repo = new GameRepository();
      var game = new Game().handleCreateGame(new CreateGameCommand('123', 'John', 'Jane'));
      repo.pushEvents('123', game.getUncommittedEvents());
      game = repo.hydrate('123');
      var claimSquareCommand = new ClaimSquareCommand('John', [0, 7]);
      assert.throws(() => game.handleClaimSquare(claimSquareCommand), InvalidSquareError); 
    })
  })
})

// TODO:  Add negative tests for claim square