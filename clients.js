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

    this.waitingLangClients[langHash] = this.waitingLangClients[langHash] || [];

    this.waitingLangClients[langHash].push(client);

    this.emit('setInfo', client);
  }

  this.setWaiting = function(client) {
    var langHash = getLanguangeHash(client.info);
    this.waitingLangClients[langHash] = this.waitingLangClients[langHash] || [];
    this.waitingLangClients[langHash].push(client);
  }

  this.hasWaiting = function() {
    
    for (var k in this.waitingLangClients)
      if (this.waitingLangClients[k].length >= 2)
        return true;

    return false;
  };

  this.getWaiting = function() {
    for (var k in this.waitingLangClients)
      if (this.waitingLangClients[k].length >= 2)
        return this.waitingLangClients[k].splice(0,2);

    return [];
  }

  this.remove = function(client) {
    var info = client.info;

    if (info) {
      var langHash = getLanguangeHash(info);

      removeFromArray(client, this.waitingLangClients[langHash]);
    }

    removeFromArray(client,this.clients);
  }

  function removeFromArray(obj, array) {
    var index = array.indexOf(obj);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

}

function getLanguangeHash(info) {
  return info ? info.native_lang + "_" + info.learning_lang : "_";
}

util.inherits(Clients, EventEmitter);

module.exports=Clients;