var grid = [];
var pause = 0;
var points = 0;
var speed = 200;
var game_interval;
var snake = {
	pos: [[10,10]],
	dir: "right",
	size: 1
};
var food = {
	pos: [],
	present: false
};

$(document).ready(function() {
	initialize();	
	alert("Start");
	game_interval = setInterval(game_loop,speed);
});

var initialize = function(){
	for(var i = 0; i < 20; i++){
		grid[i] = [];
		for(var j = 0; j < 20; j++){
			grid[i][j] = "";
		}
	}
	$('.score').html('Score: '+points);
	$('.grid-wrapper').prepend('<div class="overlay"></div>');
	$('.overlay').append('<button type="button" class="restart">Play Again</button>');
	$('.overlay').hide();
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
		game_interval = setInterval(game_loop, speed);
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
		update_game(head);
	}
	else{
		for(var i = len; i > 0; i--){
			snake.pos[i] = snake.pos[i-1].slice();
		}
		snake.pos[0] = head;
	}
		
}

var update_game = function(head){
	snake.pos.unshift(head);
	snake.size++;
	food.present = false;
	clearInterval(game_interval);
	game_interval = setInterval(game_loop, speed-=10);
	points++;
}

var render = function(){
	var head = snake.pos[0];
	var tail = snake.pos[snake.pos.length -1];
	$('.row:nth-child('+(tail[0]+2)+') .block:nth-child('+(tail[1]+1)+')').removeClass('blue-block red-block');
	$('.row:nth-child('+(food.pos[0]+2)+') .block:nth-child('+(food.pos[1]+1)+')').addClass('red-block');
	$('.row:nth-child('+(head[0]+2)+') .block:nth-child('+(head[1]+1)+')').addClass('blue-block');
	$('.score').html('Score: '+points);
	
}

var spawn_food = function(){
	if(food.present == false){
		food.pos = [Math.floor(Math.random()*19),Math.floor(Math.random()*19)]
		food.present = true;
		console.log(food.pos);
	}
}

var restart_game = function(){
	$('.overlay').hide();
	for(var i = 0; i < snake.size;i++){
		$('.row:nth-child('+(snake.pos[i][0]+2)+') .block:nth-child('+(snake.pos[i][1]+1)+')').removeClass('blue-block red-block');
	}
	$('.row:nth-child('+(food.pos[0]+2)+') .block:nth-child('+(food.pos[1]+1)+')').removeClass('red-block');
	pause = 0;
	points = 0;
	speed = 200;
	snake.pos = [[10,10]];
	snake.dir = "right";
	snake.size = 1;;
	food.pos = [];
	food.present = false;
	game_interval = setInterval(game_loop,speed);
}

var detect_collision = function(){
	var game_over = false;
	// Wall collision
	if(snake.pos[0][1] > 19 || snake.pos[0][0] > 19 || snake.pos[0][1] < 0 || snake.pos[0][0] < 0){
		game_over = true;
	}

	// Self collision
	for(var i = 1; i < snake.size;i++){
		if((snake.pos[0]).every(function(element, index){
			return element === snake.pos[i][index];
		})){
			game_over = true;
		}
	}

	if(game_over){
		clearInterval(game_interval);
		$('.overlay').show();
		$('.restart').click(function(){
			restart_game();
		});
	}
	
}