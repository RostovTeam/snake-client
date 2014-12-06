var EventEmitter = require('events').EventEmitter;
var util = require('util');


function Clients() {

  this.clients = [];

  this.langClients = {};

  this.waitingLangClients = {};

  this.add = function(client) {
    var self = this;

    client.on('disconnect', function() {
      self.remove(client);
      self.emit('left', client);
    });

    this.clients.push(client);

    this.emit('add', client);
  };

  this.setInfo = function(client, info) {

    client.info = info;

    var langHash = getLanguangeHash(client.info);

    this.langClients[langHash] = this.langClients[langHash] || [];
    this.waitingLangClients = this.waitingLangClients[langHash] || [];

    this.langClients[langHash].push(client);
    this.waitingLangClients[langHash].push(client);
  }

  this.setWaiting = function() {
    this.waitingLangClients = this.waitingLangClients[langHash] || [];
    this.waitingLangClients[langHash].push(client);
  }

  this.hasWaiting = function() {
    for (var k in this.waitingLangClients)
      if (this.waitingLangClients >= 2)
        return true;

    return false;
  };

  this.getWaiting = function() {
    for (var k in this.waitingLangClients)
      if (this.waitingLangClients[k] >= 2)
        return this.waitingLangClients[k].splice(0,2);

    return [];
  }

  this.remove = function(client) {
    var info = client.info;

    if (info) {
      var langHash = getLanguangeHash(client.info);

      removeFromArray(client, this.waitingLangClients[langHash]);
      removeFromArray(client, this.langClients[langHash]);
    }

    removeFromArray(client,this.clients);
  }

  function removeFromArray(obj, array) {
    var index = array.indexOf(ob);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

}

function getLanguangeHash(info) {
  return info.native_lang + "_" + info.learning_lang;
}

util.inherits(Clients, EventEmitter);

module.exports=Clients;