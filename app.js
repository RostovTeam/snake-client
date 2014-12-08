var express = require('express'),
    path = require('path');

var Game = require('./game');
var Clients = require('./clients');

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

app.get('/', function (req, res) {
    res.render('index.html', {});
});

var clients = new Clients();

function createGame(user) {
    if (clients.hasWaiting()) {

        var waiting_game = clients.getWaiting();

        if (!waiting_game || !waiting_game.length)
            return;

        var game = new Game(io, waiting_game);

        game.on('ended', function () {
            var self = this;
            this.clients.forEach(function (v) {
                clients.setWaiting(v);
                v.game = null;
                v.is_ready = false;
                v.leave(self.room);
            });
        });
    }
}

//clients.on('add', createGame);
clients.on('setInfo', createGame);

io.sockets.on('connection', function (socket) {

    console.log('user.connect' + "  " + socket.id);
    clients.add(socket);

    socket.on('user.info', function (data) {
        console.log('user.info' + "  " + JSON.stringify(data));
        clients.setInfo(this, data);
    });

    socket.on('user.game.ready', function () {

        this.is_ready = true;

        console.log('user.game.ready' + "  " + this.info.nickname);
        //send (in room) message to start game
        if (this.game.isTeamReady() && this.game) {
            console.log('game.start' + "  " + this.game.room);
            io.sockets.in(this.game.room).emit('game.start');
        }
    });

    socket.on('user.game.position', function (data) {
        //console.log('user.game.position' + "  " + JSON.stringify(data));

        if (!this.game) {
            return;
        }
        var p = {};
        p[socket.info.nickname] = data;

        //console.log('user.game.position' + "  " + JSON.stringify(p));

        if (this.game.checkGameState({client: this.info.nickname, coords: data}) && this.game)
            io.sockets.in(this.game.room).emit('user.game.position', p);
    });
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;