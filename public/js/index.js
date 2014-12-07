var socket = io.connect(window.location.protocol + '//' + window.location.host, {
    'transports': [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling',
        'polling'
    ]
});


var ctx = $('#canvas')[0].getContext('2d'),
    _game;

var p_collors = ["#42809a","#f85758"],
    info;


socket.on('game.init', function (data) {
    _game = new game(
        $('#canvas')[0],
        data.p,
        data.ws,
        data.s,
        info
    )
    _game.render();

    $("#word").html(data.w);
    $("#tword").html(data.wt);

    if(info.mode == 1){
        _game.start();
        $(document).keydown(function (e) {
            _game.onKeydown(e);
        });
    }
    else{
        socket.emit('user.game.ready');
        socket.on('game.start',function(data){
            _game.start();
            $(document).keydown(function (e) {
                _game.onKeydown(e);
            });
        })
    }
});



socket.on('user.game.position', function(data){
    var key = Object.keys(data)[0];
    _game.setSnake(key, data[key]);
});

socket.on('game.consume', function(data){
    var snake_name = Object.keys(data)[0];
    _game.delLetters(data[snake_name]);
    if(info.nickname == snake_name){
        _game.snakes[snake_name].consume = true;
    }
});

socket.on('game.collision', function(data){
    for(var colis in data){
        for(var i = 0; i < colis.client.length; i++){
            _game.snakes[colis.client[i]].reset();
        }
        _game.addLetter(colis.letters);
    }
});

socket.on('game.reset', function(data){
    _game.snakes[data.client].reset();
})

socket.on('game.over', function(data){
    alert(data.reason);
})

$(function(){
    $('#myModal1').modal({
        backdrop: 'static',
        keyboard: false
    });

    $('#save').on('click', function () {
        info = getFormData($('form'));
        if (!info.nickname || !info.nickname.length) {
            alert('Nickname is empty');
            return false;
        }

        socket.emit('user.info', info);
    });
})





//Draw our game
function render() {
/*
    if (checkCollision(head.x, head.y, snake)) {
        clearGameLoop();
        drawGameover();
        return;
    }

    if (head.x === apple.x && head.y === apple.y) {
        //add new element to array
        snake.unshift(head);
        score++;
        createApple();
    } else {
        //remove last element
        snake.pop();
        //add element to array, to keep the length
        snake.unshift(head);
    }
 */
}


