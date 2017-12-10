var express = require('express');
var app = express();
var bodyParser = require('body-parser');

let Game = require('./app/game.js'); 
let Repository = require('./app/repository.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'welcome to our api' });
});

var repo = new Repository(console);
// Rest API mapping to commands
//   * /api/games          post  createGame
//   * /api/games/:game_id put   placeXorY
router.route('/games')
  .post(function(req, res) {
     // command to create a new game
     var game = new Game().handleCreateGame(req.body);
     repo.pushEvents(req.body.id, game.getEvents());
     res.json(repo.getEvents(req.body.id));
  });

router.route('/games/:game_id')
  .put((function(req, res) {
    // hydrate game
    var game = repo.hydrate(req.params.game_id);
    game.placeXorO(req.body);
  }));

// register routes
app.use('/api', router);

// start the server
app.listen(port);
console.log('Magic happens on port ' + port);
