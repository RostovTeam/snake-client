var EventEmitter = require('events').EventEmitter;
var util = require('util');


function Clients() {

    this.clients = [];

    this.langClients = {};

    this.waitingLangClients = {};

    this.add = function (client) {
        var self = this;

        client.on('disconnect', function () {
            self.remove(client);
            self.emit('left', client);
        });

        this.clients.push(client);

        this.emit('add', client);
    };

    this.setInfo = function (client, info) {

        var prev_langHash = getLanguangeHash(client.info);

        removeFromArray(client, this.waitingLangClients[prev_langHash]);

        client.info = info;

        this.setWaiting(client);

        this.emit('setInfo', client);
    }

    this.setWaiting = function (client) {
        if (!client.info) {
            return;
        }
        var mode = client.info.mode;

        if (!mode) {
            mode = 1;
        }
        else {
            mode = getPlayMode(mode);
        }

        var langHash = getLanguangeHash(client.info);
        this.waitingLangClients[langHash] = this.waitingLangClients[langHash] || [];
        this.waitingLangClients[langHash].push(client);
        this.waitingLangClients[langHash].mode = mode;
    }

    this.hasWaiting = function () {

        for (var k in this.waitingLangClients)
            if (this.waitingLangClients[k].length >= this.waitingLangClients[k].mode)
                return true;

        return false;
    };

    this.getWaiting = function () {
        for (var k in this.waitingLangClients) {

            var mode = this.waitingLangClients[k].mode;
            if (this.waitingLangClients[k].length >= mode)
                return this.waitingLangClients[k].splice(0, mode);

        }
        return [];
    }

    this.remove = function (client) {
        var info = client.info;

        if (info) {
            var langHash = getLanguangeHash(info);

            removeFromArray(client, this.waitingLangClients[langHash]);
        }

        removeFromArray(client, this.clients);
    }
}

function getPlayMode(mode) {
    return mode < 1 ? 1 : (mode > 3 ? 3 : mode);
}

function removeFromArray(obj, array) {
    if(!array.hasOwnProperty(indexOf) && array.hasOwnProperty(splice))
        return;

    var index = array.indexOf(obj);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function getLanguangeHash(info) {
    return info ? info.native_lang + "_" + info.learning_lang + "_" + info.mode : "_";
}

util.inherits(Clients, EventEmitter);

module.exports = Clients;