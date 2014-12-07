var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Words = require('./api');

//var shared = require('./public/js/shared');

var Game = function (io, clients) {
    this.io = io;

    this.dict = new Words();

    this.clients = clients;

    init.call(this);

    this.isTeamReady = function () {
        var _is_team_ready = 1;
        this.clients.forEach(function (v) {
            _is_team_ready &= v.is_ready;
        });

        return _is_team_ready;
    }
};

Game.INIT_SNAKE_SIZE = 1;
util.inherits(Game, EventEmitter);

function init() {
    var self = this;

    this.room = this.clients.map(function (v) {
        return v.id
    }).join('_');

    for (var i = 0, l = this.clients.length; i < l; i++) {
        this.clients[i].join(this.room);
        this.clients[i].game = this;

        this.clients[i].on('disconnect', function () {
            self.end(this.info.nickname + " disconnected");
        });
    }

    var self = this;

    this.dict.getWordAndTr(function (res) {

        var data = {};
        //get word to learn
        data.w = res.word;
        data.wt = res.tr;

        //size of map and coordinates of letters
        var size = self.clients.length * 15;
        data.s = size;

        //get letter coordinates
        data.ws = getLetterCoordinates(data.w, size, self.clients.length);

        //init player's snakes coorinates
        data.p = getPlayersInitCoordinates(self.clients, size);

        self.data = data;

        console.log('game.init' + "  " + JSON.stringify(data));
        self.io.in(self.room).emit('game.init', data);

        //init client's letters
        self.data.pl = {};
        for (var i = 0, l = self.clients.length; i < l; i++) {
            self.data.pl[self.clients[i].info.nickname] = "";
        }
    });

}

Game.prototype.checkGameState = function (position) {
    //check collisions with other snakes

    this.data.p[position.client] = position.coords;
    var collisions = [];

    //need rewrite
    for (var key in this.data.p) {
        if (key == position.client)
            continue;

        for (var i = 0; i < this.data.p[key].length; i++) {
            for (var j = 0; j < position.coords.length; j++) {
                if (this.data.p[key][i].x == position.coords[j].x && this.data.p[key][i].y == position.coords[j].y)
                    collisions.push([position.client, key]);
            }
        }
    }

    //send collisions
    if(collisions.length) {
        console.log('game.collision' + "  " + JSON.stringify(collisions));
        this.io.in(this.room).emit('game.collision', collisions);
    }

    //check collisions with letters
    var coods_hash = [];

    for (var j = 0; j < position.coords.length; j++) {
        coods_hash.push(getCoordHash(position.coords[j]));
    }

    var consumes = {};
    consumes[position.client] = [];

    for (var key in this.data.ws) {
        if (coods_hash.indexOf(key) == -1) {
            continue;
        }
        var l = this.data.ws[key];

        // check if letter is in correct order
        var consumed = this.data.pl[position.client];
        var word = this.data.w;
        var nex_l = word[consumed.length];
        if (nex_l != l) {
            //choosed wrong letter, reset
            console.log('game.reset' + "  " + JSON.stringify({client: position.client}));
            this.io.in(this.room).emit('game.reset', {client: position.client});
        }
        else {
            var _c={};
            _c[key]=l;
            consumes[position.client].push(_c);
            this.data.pl[position.client] += l;
        }
    }
    //send consumes
    if(Object.keys(consumes).length) {
        console.log('game.consume' + "  " + JSON.stringify(consumes));
        this.io.in(this.room).emit('game.consume', consumes);
    }

    //check end game
    for (var c in this.data.pl) {
        if (this.data.pl[c] == this.data.w) {
            //c have von
            this.end(c + " has von");
        }
    }
}

Game.prototype.end = function (reason) {
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

function getLetterCoordinates(word, size, players) {
    var last = word[word.length - 1];

    var letters = '';
    for (var i = 0; i < players; i++)
        letters += word.substring(0, word.length - 1);

    letters += last;

    var coords = {};
    for (i = 0; i < letters.length; i++) {
        coords[getCoordHash(getRandomCoordinate(size, Game.INIT_SNAKE_SIZE))] = letters[i];
    }
    return coords;
}

function getCoordHash(c) {
    return c.x + ' ' + c.y;
}

function getRandomCoordinate(map_size, init_snake_size) {
    var max = map_size - init_snake_size;
    var min = init_snake_size;
    return {
        x: Math.ceil(Math.random() * (max - min) + min),
        y: Math.ceil(Math.random() * (max - min) + min)
    };
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
    var _s = Math.min(start[nc], end[nc]);
    var _e = Math.max(start[nc], end[nc]);

    for (var i = _s; i <= _e; i++) {
        var _c = [];
        _c[c] = start[c];
        _c[nc] = i;
        coords.push({x:_c[0],y:_c[1]});
    }

    return coords;
}

module.exports = Game;