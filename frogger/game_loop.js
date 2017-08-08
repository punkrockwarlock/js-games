//############ Globals #############

var context;

var width = 600;
var height = 390;
var sqSize = 20;

var intervalId = 0;

window.addEventListener("load", init, true);

//###############################

function init() 
{
 if (intervalId) {
  clearInterval(intervalId);
  }
canvas = document.getElementById("canvas");
context = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

gamespeed = 10;

UPPER_LIMIT = 6;
LOWER_LIMIT = 3;
opac = 1;

player = new Player();
road1 = new Road(0, 30);
road2 = new Road(0, 150);
road3 = new Road(0, 270);
cars = new CarTracker();

//canvas.addEventListener('mousemove', getMousePos);

intervalId = setTimeout(gameProcess, gamespeed);

window.onkeydown = keydown;
}

function gameProcess()			
{
intervalId = setTimeout(gameProcess, gamespeed);
clear(context, width, height); 		// clears canvas

road1.draw();
road2.draw();
road3.draw();
player.draw();
player.update();
cars.update();
cars.draw();
cars.lane_check();
changeText();

//print_list([cars.car_list[0].speed]);
drawText(context, "Level: " + player.points, 12, 50, 20, "#AAA", 0.5);

}

function stop() {				
  clear(context, width, height);
  clearInterval(intervalId);
}

function changeSpeed(speed) {
gamespeed = speed;
}

function Player() {
  this.sprite = new Image();
  this.sprite.src = "frog.png";
  this.x = (width / 2) - sqSize;
  this.y = 365;
  this.points = 0;
}

Player.prototype.draw = function() {
  this.rect = new Rect(this.x, this.y, sqSize, sqSize);
  //drawPoint(context, this.x, this.y, sqSize, "#f00");
  context.drawImage(this.sprite, this.x, this.y, 20, 13);
};

Player.prototype.update = function() {
  if (this.y <= 30) {
    this.points += 1;
    this.y = 365;
    UPPER_LIMIT += 1;
    LOWER_LIMIT += 1;
  }
};

function Road(x, y) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = 90;
}

Road.prototype.draw = function() {
  drawRect(context, this.x, this.y, this.width, this.height, "#7f7f7f");
  drawLine(context, this.x, this.y, this.x + width, this.y, "#FEEB63");
    this.draw_lines();
  drawLine(context, this.x, this.y + 90, this.x + width, this.y + 90, "#FEEB63");
};

Road.prototype.draw_lines = function() {
  for(j=1; j<3; j++) {
    for(i=0; i<width; i += 30) {
      drawLine(context, this.x + i, this.y + (j * 30), this.x + (i + 20), this.y + (j * 30), "#fff");
    }
  }
}

function Car(road, lane) {
  this.sprites = new Image();
  this.type = Math.floor(Math.random() * 3);
  this.speed = Math.floor(get_speed());
  this.alive = 1;
  this.road = road;
  this.lane = lane;

  this.x = 650;
  if (road == 1) {
    this.sprites.src = "cars1.png";
    if (lane == 1) {
      this.y = 35;
    }
    if (lane == 2) {
      this.y = 65;
    }
    if (lane == 3) {
      this.y = 95;
    }
  }
  if (road == 2) {
    this.sprites.src = "cars2.png";
    if (lane == 1) {
      this.y = 155;
    }
    if (lane == 2) {
      this.y = 185;
    }
    if (lane == 3) {
      this.y = 215;
    }
  }
  if (road == 3) {
    this.sprites.src = "cars3.png";
    if (lane == 1) {
      this.y = 275;
    }
    if (lane == 2) {
      this.y = 305;
    }
    if (lane == 3) {
      this.y = 335;
    }
  }
}

Car.prototype.draw = function() {
  context.drawImage(this.sprites, 0, this.type * 20, 43, 20, this.x, this.y, 43, 20);
};

Car.prototype.update = function(player) {
  this.rect = new Rect(this.x, this.y, 43, 20);
  if (this.x > -50) {
    this.x -= this.speed;
  }
  else {
    this.alive = 0;
  }
  if (collides(this, player)) {
    UPPER_LIMIT = 6;
    LOWER_LIMIT = 3;
    player.points = 0;
    player.y = 365;
  }
};

function CarTracker() {
this.car_list = [];
this.roads = [];
this.roads.push([], [], []);
this.roads[0].push(0, 0, 0);
this.roads[1].push(0, 0, 0);
this.roads[2].push(0, 0, 0);
}

CarTracker.prototype.add_car = function(road, lane) {
  this.roads[road-1][lane-1] = 1;
  this.car_list.push(new Car(road, lane));
};

CarTracker.prototype.update = function() {
  i = 0;
  for (car in this.car_list) {
    this.car_list[car].update(player);
    if (this.car_list[car].alive == 0) {
      this.roads[this.car_list[car].road-1][this.car_list[car].lane-1] = 0;
      this.car_list.splice(i, 1);
    }
    i++;
  }
};

CarTracker.prototype.lane_check = function() {
  for(i=0; i<3; i++) {
    for(j=0; j<3; j++) {
      if (this.roads[i][j] == 0) {
        this.add_car(i+1, j+1);
        this.roads[i][j] = 1;
      }
    }
  }
};

CarTracker.prototype.draw = function() {
  for (car in this.car_list) {
    this.car_list[car].draw();
  }
};

function collides(box1, box2) {
return !((box1.rect.top() > box2.rect.bottom()) || (box1.rect.bottom() < box2.rect.top()) ||
	(box1.rect.left() > box2.rect.right() || box1.rect.right() < box2.rect.left()));
}

function Rect(x, y, width, height) {
this.x = x;
this.y = y;
this.width = width;
this.height = height;

this.top = function() {
return this.y;
}

this.bottom = function() {
return this.y + this.height;
}

this.left = function() {
return this.x;
}

this.right = function() {
return this.x + width;
}
}

function get_speed() {
  speed = Math.floor(Math.random() * UPPER_LIMIT);
  if (speed < LOWER_LIMIT) {
    speed += LOWER_LIMIT;
  }
  return speed;
}

function changeText() {
if (opac > 0) {
opac -= 0.01;
}
else if (opac <= 0) { 
opac = 1;
}
colour = "#f00";
drawText(context, "This is a test", 20, 40, 50, colour, opac);
}

function keydown(e) {
if (e.keyCode == 65) {	//a
  player.x -= 30;
}
else if (e.keyCode == 87) {	//w
  player.y -= 30;
}
else if (e.keyCode == 68) {	//d
  player.x += 30;
}
else if (e.keyCode == 83) {	//s
  player.y += 30;
}
else if (e.keyCode == 13) {	//enter
}
};

