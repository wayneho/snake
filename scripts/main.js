var grid = [];
var snake = {
	pos: [[10,10],[10,9]],
	dir: "right",
	size: 1
};
var pause = 0;
var game_interval;

$(document).ready(function() {
	initialize();
	game_interval = setInterval(game_loop,200);
});

var initialize = function(){
	for(var i = 0; i < 20; i++){
		grid[i] = [];
		for(var j = 0; j < 20; j++){
			grid[i][j] = " ";
		}
	}
	grid[10][10] = "O";
	create_grid();
}

var create_grid = function(){
	for(var i = 0; i<grid.length; i++){
		$('.grid-wrapper').append('<div class="row"></div>');
		for(var j = 0; j < grid[i].length; j++){
			$('.row:last-child').append('<div class="block">'+grid[i][j]+'</div>');
		}
	}
}

var get_key_input = function(){
	$('body').keydown(function(event){
		var key = event.which;
		switch(key){
			case 37:
				if(snake.size < 2 || snake.dir != "right")
					snake.dir = "left";
				break;
			case 38:
				if(snake.size < 2 || snake.dir != "down")
					snake.dir = "up";
				break;
			case 39:
				if(snake.size < 2 || snake.dir != "left")
					snake.dir = "right";
				break;
			case 40:
				if(snake.size < 2 || snake.dir != "up")
					snake.dir = "down";
				break;
			case 80:
				pause ^= 1;
				pause_game();
				break;
			default:
				snake.dir = "right";
		}
	});
}

var pause_game = function(){
	if(pause == 1){
		clearInterval(game_interval);
	}else{
		game_interval = setInterval(game_loop, 100);
	}
}

var game_loop = function(){
	get_key_input();
	move();
	render();
}

var move = function(){
	var len = size+1;
	for(var i = len; i > 0; i--){
		snake.pos[i] = snake.pos[i-1].slice();
	}
	switch(snake.dir){
			case "left":
				snake.pos[0][1]--;
				break;
			case "up":
				snake.pos[0][0]--;
				break;
			case "right":
				snake.pos[0][1]++;
				break;
			case "down":
				snake.pos[0][0]++;
				break;
			default:
	}
	if(snake.pos[0][1] > 19 || snake.pos[0][0] > 19 || snake.pos[0][1] < 0 || snake.pos[0][0] < 0){
		clearInterval(game_interval);
		alert("Game Over");
	}
	console.log(snake.pos);
	
}

var render = function(){
	var head = snake.pos[0];
	var tail = snake.pos[snake.pos.length -1];
	$('.row:nth-child('+(head[0]+1)+') .block:nth-child('+(head[1]+1)+')').html("O");
	$('.row:nth-child('+(tail[0]+1)+') .block:nth-child('+(tail[1]+1)+')').html(" ");

}