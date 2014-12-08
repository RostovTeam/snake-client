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
        info,
        data.ss
    )
    _game.render();

    $("#word").html(data.w);
    $("#tword").html(data.wt);

    if(info.mode == 1){
        socket.emit('user.game.ready');
    }
    else{
        $("#ready").show(600, function(){
            $("#ready").on("click", function(){
                socket.emit('user.game.ready');
            })
        });
    }
});

socket.on('game.start',function(data){
    _game.start();
    $(document).keydown(function (e) {
        _game.onKeydown(e);
    });
})


socket.on('user.game.position', function(data){
    //console.log(data);
    var key = Object.keys(data)[0];
    _game.setSnake(key, data[key]);
});

socket.on('game.consume', function(data){
    _game.delLetters(data.letters);
    if(info.nickname == data.client){
        _game.snakes[data.client].consume = true;
        $("#complite").html(data.word);
    }
});

socket.on('game.collision', function(data){
    for(var i = 0; i < data.length; i++){
        for(var j = 0; j < data[i].clients.length; j++){
            console.log(1);
            var nik = data[i].clients[j].client;
            _game.snakes[nik].reset();
            _game.snakes[nik].delTail();
            if(info.nickname == nik){
                $("#complite").html(data[i].clients[j].word);
            }
        }
        _game.addLetter(data[i].letters);
    }
});

socket.on('game.reset', function(data){
    _game.snakes[data.client].reset();
})

socket.on('game.over', function(data){
    _game.stop();
    //alert(data.reason);

    socket.emit('user.info', info);
})

$(function(){
    $('#myModal1').modal({
        backdrop: 'static',
        keyboard: false
    });

    if(window.languages.native){
        for(var i = 0; i < window.languages.native.length; i++){
            var lan = window.languages.native[i];
            $("#native_lang")
                .append($("<option></option>")
                    .attr("value",lan.label)
                    .text(lan.name));
        }
    }
    if(window.languages.learning){
        for(var i = 0; i < window.languages.learning.length; i++){
            var lan = window.languages.learning[i];
            $("#learning_lang")
                .append($("<option></option>")
                    .attr("value",lan.label)
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