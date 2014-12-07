/**
 * Created by vdaron on 07.12.14.
 */
var snake = function(cord, size, size_field){
    this.consume = false;
    this.segments = [];
    this.def_position = cord;
    this.max_y = size_field;

    for(var i = 0; i < size; i++){
        if(i==0)
            this.segments.push({
                x: cord.x,
                y: cord.y
            });

        else{
            if(cord.y == 0){
                this.segments.push({
                    x: cord.x,
                    y: cord.y+i
                });
            }
            if(cord.y == this.max_y-1){

                this.segments.push({
                    x: cord.x,
                    y: cord.y-i
                });
            }

        }
    }
    /*
    for (var i = cord.length-1; i >= 0; i--) {
        this.segments.push({
            x: cord[i].x,
            y: cord[i].y
        });
    }
    */
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

    var l = this.segments.length
    this.segments = [];

    for(var i = 0; i < l; i++){
        if(i==0)
            this.segments.push({
                x: this.def_position.x,
                y: this.def_position.y
            });

        else{
            if(this.def_position.y == 0){
                this.segments.push({
                    x: this.def_position.x,
                    y: this.def_position.y+i
                });
            }
            if(this.def_position.y == this.max_y-1){

                this.segments.push({
                    x: this.def_position.x,
                    y: this.def_position.y-i
                });
            }

        }
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
