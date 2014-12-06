var express = require('express'),
  path = require('path');


/**
 * Create Express server.
 */

var app = express();

/**
 * Socket
 */

var server = require('http').Server(app),
  io = require('socket.io')(server);


/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

var hour = 3600000,
  day = hour * 24,
  week = day * 7;

app.use(express['static'](path.join(__dirname, 'public'), {
  maxAge: week
}));

app.get('/', function(req, res) {
  res.render('index.html', {});
});

var clients = new Clients();

io.sockets.on('connection', function(socket) {

  clients.add(socket);

  clients.on('add', function(user) {
    if (clients.hasWaiting()) {
      var game = new Game(io, clients.getWaiting());

      game.on('ended'.function() {
        this.clients.forEach(function(v) {
          clients.setPending(this);
        });
      });
    }

  });

  socket.on('user.info', function(data) {
    this.nickname = data.name;
    this.data = data;
  });

  socket.on('user.game.ready', function() {
    //send (in room) message to start game
    if (this.game.isTeamReady()) {
      io.sockets.in(this.game.room).emit('game.start');
    }
  });

  socket.on('user.game.position', function(data) {
    io.sockets.in(this.game.room).emit('user.game.consume',data);
  });

  socket.on('user.game.consume', function(data) {
    io.sockets.in(this.game.room).emit('user.game.consume',data);
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;