var grid = [];
var snake = {
	pos: [[10,10],[10,9]],
	dir: "right",
	size: 1
};
var food = {
	pos: [],
	present: false
}
var pause = 0;
var game_interval;

$(document).ready(function() {
	initialize();
	game_interval = setInterval(game_loop,100);
});

var initialize = function(){
	for(var i = 0; i < 20; i++){
		grid[i] = [];
		for(var j = 0; j < 20; j++){
			grid[i][j] = " ";
		}
	}
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
				if(snake.size < 2 || (snake.size > 1 && snake.dir != "right"))
					snake.dir = "left";
				break;
			case 38:
				if(snake.size < 2 || (snake.size > 1 && snake.dir != "down"))
					snake.dir = "up";
				break;
			case 39:
				if(snake.size < 2 || (snake.size > 1 && snake.dir != "left"))
					snake.dir = "right";
				break;
			case 40:
				if(snake.size < 2 || (snake.size > 1 && snake.dir != "up"))
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
	spawn_food();
	get_key_input();
	move();
	detect_collision();
	render();
}

var move = function(){
	var len = snake.size;
	var head = snake.pos[0].slice();

	switch(snake.dir){
		case "left":
			head[1]--;
			break;
		case "up":
			head[0]--;
			break;
		case "right":
			head[1]++;
			break;
		case "down":
			head[0]++;
			break;
		default:
	}

	if(head.every(function(element,index){
		return element === food.pos[index]
	})){
		snake.pos.unshift(head);
		snake.size++;
		food.present = false;
	}
	else{
		for(var i = len; i > 0; i--){
			snake.pos[i] = snake.pos[i-1].slice();
		}
		snake.pos[0] = head;
	}
		
}

var render = function(){
	var head = snake.pos[0];
	var tail = snake.pos[snake.pos.length -1];
	$('.row:nth-child('+(food.pos[0]+1)+') .block:nth-child('+(food.pos[1]+1)+')').addClass('red-block');
	$('.row:nth-child('+(head[0]+1)+') .block:nth-child('+(head[1]+1)+')').addClass('blue-block');
	$('.row:nth-child('+(tail[0]+1)+') .block:nth-child('+(tail[1]+1)+')').removeClass('blue-block red-block');
}

var spawn_food = function(){
	if(food.present == false){
		food.pos = [Math.floor(Math.random()*20),Math.floor(Math.random()*20)]
		food.present = true;
		console.log(food.pos);
	}
}

var detect_collision = function(){
	// Wall collision
	if(snake.pos[0][1] > 19 || snake.pos[0][0] > 19 || snake.pos[0][1] < 0 || snake.pos[0][0] < 0){
		clearInterval(game_interval);
		alert("Game Over");
	}

	// Self collision
	for(var i = 1; i < snake.size;i++){
		if((snake.pos[0]).every(function(element, index){
			return element === snake.pos[i][index];
		})){
			clearInterval(game_interval);
			alert("Game Over");
		}
	}
	
}