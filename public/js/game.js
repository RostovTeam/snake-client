/**
 * Created by vdaron on 07.12.14.
 */
window.Game = (function($, EventEmitter){
    function Game(socket){
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

        this.speed = 5;
        this.size  = 20;
        this.size_grid = 1;
        this.snake_length = 1;
    }
})