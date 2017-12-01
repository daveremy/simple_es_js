var express = require('express');
var app = express();
var bodyParser = require('body-parser');
let Game = require('./game.js'); 
let Repository = require('./repository.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'welcome to our api' });
});

var repo = new Repository(console);

router.route('/games')
  .post(function(req, res) {
     // command to create a new game
     var game = new Game(req.body);
     repo.pushEvents(req.body.id, game.getEvents());
     res.json(repo.getEvents(req.body.id));
  });

// register routes
app.use('/api', router);

// start the server
app.listen(port);
console.log('Magic happens on port ' + port);
