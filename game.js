var EventEmitter = require('events').EventEmitter;
var util = require('util');

var shared = require('./public/js/shared');

var Game = function(io, clients) {
    this.io = io;

    this.clients = clients;

    init.call(this);

    this.isTeamReady = function() {
        var _is_team_ready = 1;
        this.clients.forEach(function(v) {
            _is_team_ready &= v.is_ready;
        });

        return _is_team_ready;
    }
};

Game.INIT_SNAKE_SIZE = 1;
util.inherits(Game, EventEmitter);

function init() {
    var self = this;

    this.room = this.clients.map(function(v) {
        return v.id
    }).join('_');

    for (var i = 0, l = this.clients.length; i < l; i++) {
        this.clients[i].join(this.room);
        this.clients[i].game = this;

        this.clients[i].on('disconnect', function() {
            self.end(this.info.nickname + " disconnected");
        });
    }

    var data = {};
    //get word to learn
    data.w = "word";
    data.wt = "le mot";

    //size of map and coordinates of letters
    var size = this.clients.length * 15;
    data.s = size;

    //get letter coordinates
    data.ws = getLetterCoordinates(data.w, size, this.clients.length);

    //init player's snakes coorinates
    data.p = getPlayersInitCoordinates(this.clients, size);

    console.log('game.init' + "  " + JSON.stringify(data));
    this.io.in(this.room).emit('game.init', data);
}

Game.prototype.end = function(reason) {
    console.log('game.over' + "  " + reason);
    this.io.in(this.room).emit('game.over', {
        reason: reason
    });
    this.emit('ended');
};

function getPlayersInitCoordinates(clients, size) {

    var ps = {};
    for (var i = 0, l = clients.length; i < l; i++) {
        ps[clients[i].info.nickname] = getSnakeInitCoodinates(i, size, Game.INIT_SNAKE_SIZE);
    }
    return ps;
}

function getLetterCoordinates(word, size, players ) {
    var last = word[word.length - 1];

    var letters = '';
    for (var i = 0; i < players; i++)
        letters += word.substring(0, word.length - 1);

    letters += last;

    var coords = {};
    for (i = 0; i < letters.length; i++) {
        coords[getRandomCoordinate(size, Game.INIT_SNAKE_SIZE).join(' ')] = letters[i];
    }
    return coords;
}

function getRandomCoordinate(map_size, init_snake_size) {
    var max = map_size - init_snake_size;
    var min = init_snake_size;
    return [
        Math.ceil(Math.random() * (max - min) + min),
        Math.ceil(Math.random() * (max - min) + min)
    ];
}

function getSnakeInitCoodinates(pos, map_size, init_snake_size) {
    var c, start, end, coords = [];
    switch (pos) {
        case 0:
            start = [0, 0];
            end = [
                0, init_snake_size
            ];
            break;
        case 1:

            start = [map_size - 1, map_size - 1];
            end = [
                map_size - init_snake_size - 1, map_size - 1
            ];
            break;
    }

    if (start[0] == end[0])
        c = 0;
    else
        c = 1;

    var nc = (c - 1) * -1;
    var _s=Math.min(start[nc],end[nc]);
    var _e=Math.max(start[nc],end[nc]);

    for (var i = _s; i <= _e; i++) {
        var _c = [];
        _c[c] = start[c]
        _c[nc] = i;
        coords.push(_c);
    }

    return coords;
}

module.exports = Game;