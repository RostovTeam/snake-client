/**
 * Created by vdaron on 07.12.14.
 */
var snake = function(cord){
    this.consume = false;
    this.segments = [];
    this.def_position = cord;
    for (var i = cord.length-1; i >= 0; i--) {
        this.segments.push({
            x: cord[i].x,
            y: cord[i].y
        });
    }
}
snake.prototype.sync = function(cord){
    this.segments = [];
    for (var i = cord.length-1; i >= 0; i--) {
        this.segments.push({
            x: cord[i].x,
            y: cord[i].y
        });
    }
}

snake.prototype.move = function(direction, end){

    this.head = {
      x: this.segments[0].x,
      y: this.segments[0].y
    };

    if (direction == "right")
        this.head.x++;
    else if (direction == "left")
        this.head.x--;
    else if (direction == "up")
        this.head.y--;
    else if (direction == "down")
        this.head.y++;


    //If the snake leaves the arena, then bring her back
    if (this.head.x > end.x) {
        this.head.x = 0;
    } else if (this.head.x < 0) {
        this.head.x = end.x;
    } else if (this.head.y > end.y) {
        this.head.y = 0;
    } else if (this.head.y < 0) {
        this.head.y = end.y;
    }

    if(!this.consume){
        this.segments.pop();
    }
    else
        this.consume = false


    this.segments.unshift(this.head);
    socket.emit('user.game.position', this.segments);
}

snake.prototype.reset = function(){
    this.segments = [];
    for (var i = this.def_position.length-1; i >= 0; i--) {
        this.segments.push({
            x: this.def_position[i].x,
            y: this.def_position[i].y
        });
    }
}

snake.prototype.checkCollision = function(x,y,array){
    for (var i = 2; i < array.length - 1; i++) {
        if (array[i].x === x && array[i].y === y) {
            return true;
        }
    }
    return false;
}
