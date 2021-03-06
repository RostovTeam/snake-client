var socket = io.connect(window.location.protocol + '//' + window.location.host, {
    'transports': [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling',
        'polling'
    ],
    'secure': true
});


var ctx = $('#canvas')[0].getContext('2d'),
    _game;

var p_collors = ["#42809a", "#f85758", "#429a76", "#b9742b"],
    info;


socket.on('game.init', function (data) {

    console.log("init");
    _game = new game(
        $('#canvas')[0],
        data.p,
        data.ws,
        data.s,
        info,
        data.ss
    )
    _game.render();
    $("#word").html("");
    $("#word").append($("<small></small>")
        .text("collect: "));
    $("#word").append(data.w);

    $("#tword").html("");
    $("#tword").append($("<small></small>")
        .text("translation: "));
    $("#tword").append(data.wt);

    $("#ready").show(600, function () {

    });

});

socket.on('game.start', function (data) {
    _game.stop();
    _game.start();
    $(document).keydown(function (e) {
        _game.onKeydown(e);
    });
})


socket.on('user.game.position', function (data) {
    var key = Object.keys(data)[0];
    _game.setSnake(key, data[key]);
});

socket.on('game.consume', function (data) {
    _game.delLetters(data.letters);
    _game.snakes[data.client].setWord(data.word);
    if (info.nickname == data.client) {
        _game.snakes[data.client].consume = true;
        $("#complite").html(data.word);
    }
});

socket.on('game.collision', function (data) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].clients.length; j++) {
            var nik = data[i].clients[j].client;
            _game.snakes[nik].reset();
            _game.snakes[nik].delTail();
            _game.snakes[nik].setWord(data[i].clients[j].word);
            if (info.nickname == nik) {
                $("#complite").html(data[i].clients[j].word);
            }
        }
        _game.addLetter(data[i].letters);
    }
});

socket.on('game.reset', function (data) {
    _game.snakes[data.client].reset();
})

socket.on('game.over', function (data) {

    console.log("end");
    _game.stop();
    socket.emit('user.info', info);

})

$(function () {
    $('#myModal1').modal({
        backdrop: 'static',
        keyboard: false
    });

    $("#ready").on("click", function () {
        console.log("click");
        socket.emit('user.game.ready');
        $("#ready").hide();
    })

    if (window.languages.native) {
        for (var i = 0; i < window.languages.native.length; i++) {
            var lan = window.languages.native[i];
            $("#native_lang")
                .append($("<option></option>")
                    .attr("value", lan.label)
                    .text(lan.name));
        }
    }
    if (window.languages.learning) {
        for (var i = 0; i < window.languages.learning.length; i++) {
            var lan = window.languages.learning[i];
            $("#learning_lang")
                .append($("<option></option>")
                    .attr("value", lan.label)
                    .text(lan.name));
        }
    }


    $('#save').on('click', function () {
        info = getFormData($('form'));
        if (!info.nickname || !info.nickname.length) {
            alert('Nickname is empty');
            return false;
        }

        socket.emit('user.info', info);
    });
});