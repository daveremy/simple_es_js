class GameCommandHandler {
  constructor(gameRepository) {
    if (gameRepository) {
      this.gameRepository = gameRepository;
    } else {
      this.gameRepository = new GameRepository();
    }
  }

  handle(command) {
    let game = this.gameRepository.hydrate(command.id);
    game['handle' + command.constructor.name](command);
    this.gameRepository.pushEvents(command.id, game.getUncommittedEvents());
  }
}

module.exports = GameCommandHandler;