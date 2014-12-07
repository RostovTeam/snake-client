/**
 * Created by vdaron on 07.12.14.
 */
var snake = function(cord){
    this.segments = [];
    for (var i = cord.length-1; i >= 0; i--) {
        this.segments.push({
            x: cord[i][0],
            y: cord[i][1]
        });
    }
}


snake.prototype.move = function(direction, end){

    this.head = {
      x:  this.segments[0].x,
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

    this.segments.pop();
    this.segments.unshift(this.head);
    socket.emit('user.game.position', this.segments);
}

snake.prototype.reset = function(){
    for(var i = this.segments.length-1; i>=0; i--){
        this.segments[i].x = 0;
        this.segments[i].y = i;
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
