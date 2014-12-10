/**
 * Created by vdaron on 07.12.14.
 */
var game = function (_canvas, snakes, word_l, size,info, snake_size) {
/*
        min_alpha = 0.2,
        max_alpha = 1,
        player_1 = "#42809a",
        player_2 = "#f85758",
        ws,
        direction,
        direction_queue,
        score;
*/

    this.speed = 8;
    this.snakes = {};
    this.direction = 'down';
    this.direction_queue = 'down';
    this.canvas =  new canvas(_canvas, size);
    this.game = null;
    this.info = info;
    this.size = size;
    this.ws = word_l;

    for(var key in snakes){
        this.snakes[key] = new snake(snakes[key],snake_size ,size);
    }


}

game.prototype.start = function () {
    var self = this;
    this.game = setInterval(function(){self.render()}, 1000 / this.speed);
}

game.prototype.stop = function () {
    if (typeof this.game !== 'undefined' && this.game !== null) {
        clearInterval(this.game);
    }
}

game.prototype.addLetter = function (letter){
    $.extend(this.ws , letter);
}

game.prototype.setSnake = function (key, positions){
    if(key!=this.info.nickname)
        this.snakes[key].sync(positions);
}

game.prototype.delLetters = function (letters){
    for(var i = 0; i <  letters.length; i++){
        delete  this.ws[letters[i]];
    }
}

game.prototype.render = function () {
    this.canvas.clear('#3d3d3d');
    this.canvas.DrawGrid('#424242');


    this.direction = this.direction_queue;

    var end = {
        x: this.size-1,
        y: this.size-1
    };

    this.canvas.drawWord(this.ws, '#9CF381');

    this.snakes[this.info.nickname].move(this.direction, end);

    var i = 0;
    for (var key in this.snakes) {

        for(var j = 0; j <this.snakes[key].segments.length; j++){
            this.snakes[key].segments[j].letter = "";
        }
        //add letter
        for(var j = 0; j < this.snakes[key].word.length; j++){
            this.snakes[key].segments[j].letter = this.snakes[key].word[j];
        }
        this.canvas.drawSnake(this.snakes[key].segments, p_collors[i]);
        i++;
    }
}

game.prototype.onKeydown = function (e) {
    var key = e.which;
    if (key === 37 && this.direction !== 'right') {
        this.direction_queue = 'left';
    } else if (key === 38 && this.direction !== 'down') {
        this.direction_queue = 'up';
    } else if (key === 39 && this.direction !== 'left') {
        this.direction_queue = 'right';
    } else if (key === 40 && this.direction !== 'up') {
        this.direction_queue = 'down';
    } else if (key === 13) {
        //initGame();
    }
    e.preventDefault();
}

game.prototype.end = function () {

}