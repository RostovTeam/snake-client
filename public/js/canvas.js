/**
 * Created by vdaron on 07.12.14.
 */
var canvas = function (canvas, size){
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.min_alpha    = 0.4;
    this.max_alpha    = 1;

    this.size         = 20;
    this.size_grid    = 1;
    this.sizeAll      = this.size+this.size_grid;

    this.context.canvas.width = size*this.sizeAll;
    this.context.canvas.height = size*this.sizeAll;
}

canvas.prototype.clear = function(color) {
    if(color != undefined){
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }else{
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

canvas.prototype.DrawGrid = function(color){
    ctx.fillStyle = color;//'#424242';
    for (var xm = 0; xm < this.canvas.width / this.sizeAll; xm++) {
        for (var ym = 0; ym < this.context.canvas.height / this.sizeAll; ym++) {
            ctx.fillRect(xm * this.sizeAll-this.size_grid, ym * this.sizeAll-this.size_grid, this.sizeAll, this.size_grid);
            ctx.fillRect(xm * this.sizeAll-this.size_grid, ym * this.sizeAll-this.size_grid, this.size_grid, this.sizeAll);
        }
    }

}

canvas.prototype.drawRect = function(x, y, color, alpha) {
    if (alpha == undefined) {
        alpha = this.max_alpha;
    } else if (alpha < this.min_alpha) {
        alpha = this.min_alpha;
    }
    this.context.fillStyle = color;
    this.context.globalAlpha = alpha;
    this.context.fillRect(x * this.sizeAll, y * this.sizeAll, this.size, this.size);
}

canvas.prototype.drawLetter = function(x, y, letter, color){
    this.context.fillStyle = color;
    this.context.font = '13pt fixedsys';
    this.context.fillText(letter, x * this.sizeAll+5, y * this.sizeAll+15);
}

canvas.prototype.drawWord = function(ws,color){
    for(var key in ws){
        var x = key.split(" ")[0],
            y = key.split(" ")[1],
            letter = ws[key];
        //console.log("x="+x+" y="+y+" letter="+letter);
        this.drawLetter(x, y, letter, color);
    }
}

canvas.prototype.drawSnake = function (snake, color){
    var step_alpha = (this.max_alpha - this.min_alpha) / (snake.length / 2);

    for (var i = 0; i < snake.length; i++) {

        if (snake.length / 2 >= 1 && i >= snake.length / 2) {
            this.drawRect(snake[i].x, snake[i].y, color, this.max_alpha + (snake.length / 2 - i) * step_alpha);
            if(snake[i].letter)
                this.drawLetter(snake[i].x, snake[i].y, snake[i].letter, '#3d3d3d');
        } else {
            this.drawRect(snake[i].x, snake[i].y, color, 1);
            if(snake[i].letter)
                this.drawLetter(snake[i].x, snake[i].y, snake[i].letter, '#3d3d3d');
        }
    }
}