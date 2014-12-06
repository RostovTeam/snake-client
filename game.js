var EventEmitter = require('events').EventEmitter;
var util = require('util');

var shared = require('./../public/js/shared');

var Game = function(io, clients) {
    this.io = io;

    this.clients = clients;

    init.call(this);

    this.isTeamReady = function()
    {
        var _is_team_ready=0;
        this.clients.forEach(function(v){
            _is_team_ready&=v.is_ready;
        });

        return _is_team_ready;
    }
};

Game.INIT_SNAKE_SIZE=1;
util.inherits(Game, EventEmitter);

function init() {
    var self = this;

    this.room = this.clients.map(function(v) {
        return v.id
    }).join('_');

    for (var i = 0, l = this.clients.length; i < l; i++) {
        this.clients[i].join(this.room);
        this.clients[i].game=this;

        this.clients[i].on('disconnect', function() {
            self.end(this.nickname+" disconnected");
        });
    }

    var data = {};
    //get word to learn
    data.w = "word";
    data.wt="le mot";

    //size of map and coordinates of letters
    var size = this.clients.length * 50; 
    var letters = word + word.substring(0, word.length - 1);
    var coords = [];
    for (i = 0; i < letters.length; i++) {
        coord[getRandomCoordinate(size,Game.INIT_SNAKE_SIZE).join(' ')] = letters[i];
    }
    data.s=size;
    data.ws=coords;

    var ps={};
    //init player's snakes coorinates
     for (var i = 0, l = this.clients.length; i < l; i++) {
        ps[clients.nickname]=getSnakeInitCoodinates(i,size,Game.INIT_SNAKE_SIZE);
    }
    data.p=ps;
    
    this.io.in(this.room).emit('game.init', data);
}

Game.prototype.end = function(reason) {
    this.io.in(this.room).emit('game.over', {
        reason: reason
    });
    this.emit('ended');
};

function getRandomCoordinate(map_size, init_snake_size) {
    var max = map_size - init_snake_size;
    min = init_snake_size;
    return [
        Math.random() * (max - min) + min,
        Math.random() * (max - min) + min
    ];
}

function getSnakeInitCoodinates(pos, map_size, init_snake_size) {
    var start, end, coords=[];
    swtich(pos) {
        case 0:
            start = [0, 0];
            end = [
                0, init_snake_size
            ];
            break;
        case 1:

            start = [map_size, map_size];
            end = [
                map_size - init_snake_size, map_size
            ];
            break;
    }

    if (start[0] == end[0])
        c = 0;
    else
        c = 1;

    for (i = start[!c]; i <= start[!c]; i++)
    {
        var _c=[];
        _c[c]=start[c]
        _c[!c]=i;
        coords.push(_c);
    }

    return coords;
}

module.exports = Game;