/**
 * Created by roman on 07.12.14.
 */
var io = require('socket.io-client')
    , assert = require('assert')
    , expect = require('expect.js');

describe('Suite of unit tests', function() {

    var socket,socket1;


    beforeEach(function(done) {
        // Setup
        socket = io.connect('http://localhost:3000', {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        });
        socket.on('connect', function() {
            console.log('s1 connected...');

        });
        socket.on('disconnect', function() {
            console.log('disconnected...');
        })

        socket1 = io.connect('http://localhost:3000', {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        });

        socket1.on('connect', function() {
            console.log('s1 connected...');

        });
        socket1.on('disconnect', function() {
            console.log('s1 disconnected...');
        })

    });

    afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });

    describe('Test multiplayer workflow', function() {

        it('Should work :)', function(done) {
            socket.emit('user.info',{});
            socket1.emit('user.info',{});

            var when_got_init=function(client){

            }

            socket.on('game.init',function(){});
            socket1.on('game.init',function(){});
        });

    });

});
