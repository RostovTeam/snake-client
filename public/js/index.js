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


socket.on('game.init', function (data) {
    /*{
     //players snakes coordinates
     p: {
     "player_id": [
     [1, 2],
     [1, 3],
     [1, 4]
     ],
     "player_id2": [
     [2, 1],
     [2, 2]
     ],
     },
     //letters coordinates
     ws: {
     "1 2": 'w',
     "5 6": 'o',
     "4 5": 'r',
     "8 9": 'd'
     },
     //word
     w: "word",
     wt: "le mot",
     //size of map (map is square)
     s: 300
     }*/

    var  _game = new game(
        $('#canvas')[0],
        data.p,
        data.ws,
        data.s,
        info
    )
    _game.render();

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


$(function(){
    $('#myModal1').modal({
        backdrop: 'static',
        keyboard: false
    });
})

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n) {
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
}

$('#save').on('click', function () {
    info = getFormData($('form'));
    if (!info.nickname || !info.nickname.length) {
        alert('Nickname is empty');
        return false;
    }

    socket.emit('user.info', info);
});


/**
 * Canvas
 */

var ctx = $('#canvas')[0].getContext('2d'),
    width,
    height;


var speed        = 5,
    size_grid    = 1,
    size         = 20,
    snake_length = 1,
    _game         = null,
    min_alpha    = 0.2,
    max_alpha    = 1,
    player_1     = "#42809a",
    player_2     = "#f85758",
    ws,
    direction,
    direction_queue,
    apple,
    score,
    info,
    snakes = {};

var сells_x,
    сells_y;

function initGame(data) {
    score = 0;
    direction = 'down';
    direction_queue = 'down';
    ws = data.ws;
    width  = ctx.canvas.width = data.s*(size+size_grid);
    height = ctx.canvas.height = data.s*(size+size_grid);

    сells_x = Math.round((width - (size + size_grid)) / (size + size_grid));
    сells_y = Math.round((height - (size + size_grid)) / (size + size_grid));


    for(key in data.p){
        snakes[key] = new snake(data.p[key]);
    }


    _game = setInterval(render, 1000 / speed);
}


//Draw our game
function render() {
    var canv = new canvas($('#canvas')[0], width, height);
    canv.clear('#3d3d3d');
    canv.DrawGrid('#424242');



    direction = direction_queue;

    var end = {
        x: сells_x,
        y: сells_y
    };

    snakes[info.nickname].move(direction, end);

    for(key in snakes){
        canv.drawSnake(snakes[key].segments, player_1);
    }

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


