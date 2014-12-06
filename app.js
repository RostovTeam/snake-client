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

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

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

// Example
// io.sockets.on('connection', function (socket) {
//   socket.on('login', function (name) {
//     socket.set('nickname', name, function () {
//       console.log(name);
//       socket.emit('ready', name);
//       socket.broadcast.emit('ready', name);
//     });
//   });

//   socket.on('mensagem', function (msg) {
//     socket.get('nickname', function (err, name) {
//       socket.emit('mensagemclient', msg, name);
//       socket.broadcast.emit('mensagemclient', msg, name);
//     });
//   });

//   socket.on('disconnect', function () {
//     socket.get('nickname', function (err, name) {
//       socket.broadcast.emit('mensagemclient', 'saiu', name);
//     });
//     console.log('saiu fora');
//   });
// });

server.listen(app.get('port'), function () {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;