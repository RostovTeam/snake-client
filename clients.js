var EventEmitter = require('events').EventEmitter;
var util = require('util');


function Clients() {

    this.clients = [];

    this.langClients = {};

    this.waitingLangClients = {};

    this.add = function (client) {
        var self = this;

        client.on('disconnect', function () {
            console.log('user.disconnected' + '  ' + this.id);
            self.remove(this);
            self.emit('left', this);
        });

        this.clients.push(client);

        this.emit('add', client);
    };

    this.setInfo = function (client, info) {

        var prev_langHash = getLanguangeHash(client.info);
        removeClientFromArray(client, this.waitingLangClients[prev_langHash]);

        client.info = info;
        this.setWaiting(client);
    }

    this.setWaiting = function (client) {
        if (!client.info) {
            return;
        }

        client.info.mode= getPlayMode(client.info.mode);

        var langHash = getLanguangeHash(client.info);

        removeClientFromArray(client, this.waitingLangClients[langHash]);

        this.waitingLangClients[langHash] = this.waitingLangClients[langHash] || [];
        this.waitingLangClients[langHash].push(client);
        this.waitingLangClients[langHash].mode = client.info.mode;

        this.emit('setWaiting', client);
    };

    this.getWaiting = function (client) {
        var clients = [];

        var langHash = getLanguangeHash(client.info);

        clients.push(client);

        var mode = this.waitingLangClients[langHash].mode;
        var k = 0;
        while (k < this.waitingLangClients[langHash].length && clients.length < mode) {
            var _client = this.waitingLangClients[langHash][k];

            if (!_client.disconnected && client.id != _client.id)
                clients.push(_client);
            k++;
        }

        if (mode != clients.length)
            return null;

        clients.forEach(function(v){
            removeClientFromArray(v, this.waitingLangClients[langHash]);
        },this);
        return clients;
    }

    this.remove = function (client) {
        var info = client.info;

        if (info) {
            var langHash = getLanguangeHash(info);

            removeClientFromArray(client, this.waitingLangClients[langHash]);
        }

        removeClientFromArray(client, this.clients);
    }
}

function getPlayMode(mode) {
    return mode < 1 ? 1 : (mode > 3 ? 3 : mode);
}

function removeClientFromArray(obj, array) {
    if (!array || !array.length )
        return;

    for (var i = 0; i < array.length; i++) {
        var _item = array[i];

        if (_item.id == obj.id) {
            array.splice(i,1);
            i--;
        }
    }
}

function getLanguangeHash(info) {
    return info ? info.native_lang + "_" + info.learning_lang + "_" + info.mode : "_";
}

util.inherits(Clients, EventEmitter);

module.exports = Clients;