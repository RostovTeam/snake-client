/* globals $: false, io: false */

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
    console.log(data);

    initGame(data);

});

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n) {
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
}

$('#enter').on('click', function () {
    var info = getFormData($('form'));
    if (!info.nickname || !info.nickname.length) {
        alert('Nickname is empty');
        return;
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
    game         = null,
    min_alpha    = 0.2,
    max_alpha    = 1,
    player_1     = "#42809a",
    player_2     = "#f85758",
    ws,
    direction,
    direction_queue,
    apple,
    score,
    snake;

var сells_x = Math.round((width - (size + size_grid)) / (size + size_grid)),
    сells_y = Math.round((height - (size + size_grid)) / (size + size_grid));

function initGame(data) {
    score = 0;
    direction = 'right';
    direction_queue = 'right';
    ws = data.ws;
    width  = ctx.canvas.width = data.s*(size+size_grid);
    height = ctx.canvas.height = data.s*(size+size_grid);


    createSnake();
    createApple();
    clearGameLoop();
    game = setInterval(render, 1000 / speed);
}

function clearGameLoop() {
    if (typeof game !== 'undefined' && game !== null) {
        clearInterval(game);
    }
}

function createSnake() {
    snake = [];
    for (var i = snake_length; i > 0; i--) {
        snake.push({
            x: i - 2,
            y: 0
        });
    }
}

function createApple() {
    var px = Math.round(Math.random() * сells_x);
    var py = Math.round(Math.random() * сells_y);

    //prevent the apple from appearing on snake
    for (var i = 0; i < snake.length; i++) {
        if (px === snake[i].x && py === snake[i].y) {
            return createApple();
        }

    }

    apple = {
        x: px,
        y: py
    };

}

function drawMain() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '40pt fixedsys';
    ctx.textAlign = 'center';
    ctx.fillText('SNAKE', width / 2, height / 2 - 70);

    ctx.font = '25pt fixedsys';
    ctx.fillText('USE THE ARROW KEYS', width / 2, height / 2 + 30);

    ctx.font = '12pt fixedsys';
    ctx.fillText('(Press return to start)', width / 2, height / 2 + 60);
}
drawMain();


function drawGameover() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '40pt fixedsys';
    ctx.fillText('GAME OVER', width / 2, height / 2);

    ctx.font = '25pt fixedsys';
    ctx.fillText('YOUR SCORE: ' + score, width / 2, height / 2 + 60);

    ctx.font = '12pt fixedsys';
    ctx.fillText('(Press return to restart)', width / 2, height / 2 + 84);
}

//Draw our game
function render() {
    //Draw background
    ctx.fillStyle = '#3d3d3d';
    ctx.fillRect(0, 0, width, height);

    //Draw grid
    ctx.fillStyle = '#424242';
    for (var xm = 0; xm < width / (size + size_grid); xm++) {
        for (var ym = 0; ym < height / (size + size_grid); ym++) {
            ctx.fillRect(xm * ((size + size_grid))-size_grid, ym * ((size + size_grid))-size_grid, size+size_grid, size_grid);
            ctx.fillRect(xm * ((size + size_grid))-size_grid, ym * ((size + size_grid))-size_grid, size_grid, size+size_grid);
        }
    }

    var head = {
        x: snake[0].x,
        y: snake[0].y
    };

    direction = direction_queue;
    if (direction === 'right') {
        head.x++;
    } else if (direction === 'left') {
        head.x--;
    } else if (direction === 'up') {
        head.y--;
    } else if (direction === 'down') {
        head.y++;
    }

    var end = {
        x: сells_x,
        y: сells_y
    };

    //If the snake leaves the arena, then bring her back
    if (head.x > end.x) {
        head.x = 0;
    } else if (head.x < 0) {
        head.x = end.x;
    } else if (head.y > end.y) {
        head.y = 0;
    } else if (head.y < 0) {
        head.y = end.y;
    }

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

    //Draw snake
    var step = (max_alpha - min_alpha) / (snake.length / 2);

    for (var i = 0; i < snake.length; i++) {
        if (snake.length / 2 >= 1 && i >= snake.length / 2) {

            drawRect(snake[i].x, snake[i].y, player_1, max_alpha + (snake.length / 2 - i) * step);
        } else {
            drawRect(snake[i].x, snake[i].y, player_1, 1);
        }
    }
    //Draw letters
    drawWord(ws, '#9CF381');
}

function drawWord(ws,color){
    for(var key in ws){
        var x = key.split(" ")[0],
            y = key.split(" ")[1],
            letter = ws[key];
        //console.log("x="+x+" y="+y+" letter="+letter);
        drawLetter(x, y, letter, color);
    }
}

//Draw rectangle
function drawRect(x, y, color, alpha) {
    if (alpha == undefined) {
        alpha = max_alpha;
    } else if (alpha < min_alpha) {
        alpha = min_alpha;
    }
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x * (size + size_grid), y * (size + size_grid), size, size);
}

function drawLetter(x, y, letter, color){
    ctx.fillStyle = color;
    ctx.font = '13pt fixedsys';
    ctx.fillText(letter, x * (size + size_grid)+5, y * (size + size_grid)+15);
}

//Collision
function checkCollision(x, y, array) {
    for (var i = 2; i < array.length - 1; i++) {
        if (array[i].x === x && array[i].y === y) {
            return true;
        }
    }
    return false;
}

//Controls
$(document).keydown(function (e) {
    var key = e.which;
    if (key === 37 && direction !== 'right') {
        direction_queue = 'left';
    } else if (key === 38 && direction !== 'down') {
        direction_queue = 'up';
    } else if (key === 39 && direction !== 'left') {
        direction_queue = 'right';
    } else if (key === 40 && direction !== 'up') {
        direction_queue = 'down';
    } else if (key === 13) {
        //initGame();
    }
});