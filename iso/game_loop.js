/* Press Ctrl + H, replace 'replace_' with a unique variable name. */


//############ Globals #############

var context;

var width = 600;
var height = 600;
var sqSize = 8;

cam_x = 0;
cam_y = 0;
cam_w = 600;
cam_h = 600;

mouse_x = 0;
mouse_y = 0;

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

tile_width = 8;
tile_height = 8;

sheet = new Image();
sheet.src = 'basic_ground_tiles_s.png';
sprite_w = 16;
sprite_h = 16;

offset = (width / 2);

//map = makeMap();
//makeTerrain(map);
//pl = new Player();


map_width = 100;
map_height = 100;
map_depth = 25;
water_level = 0;
map = makeZMap(map_width, map_height, map_depth);
//makeTerrain(map);
simplexTerrain(map);
moistureMap(map);
waterFill(map);

intervalId = setTimeout(gameProcess, gamespeed);

canvas.addEventListener('mousemove', getMousePos);

window.onkeydown = keydown;
}

function gameProcess()			// remember to rename this function to [FILENAME] + 'gameProcess()'
{
intervalId = setTimeout(gameProcess, gamespeed);
clear(context, width, height); 		// clears canvas

drawZMap(map);

}

function stop() {				// remember to rename this function to [FILENAME] + 'stop()'
  clear(context, width, height);
  clearInterval(intervalId);
}

function changeSpeed(speed) {
gamespeed = speed;
}

function isoToCart(pt) {
tempPt = new Point(0, 0, pt.h);
tempPt.x = (2 * pt.y + pt.x) / 2;
tempPt.y = (2 * pt.y - pt.x) / 2;
return(tempPt);
}

function cartToIso(pt) {
tempPt = new Point(0, 0, pt.h);
tempPt.x = pt.x - pt.y;
tempPt.y = (pt.x + pt.y) / 2;
return(tempPt);
}

function Player() {
this.x = 5;
this.y = 5;
this.z = 5;

this.image = new Image;
this.image.src = 'man.png';

this.draw = function() {
 temp = cartToIso(new Point(this.x, this.y, 0));
 context.drawImage(this.image, (temp.x * tile_width) + offset + (tile_width/2), (temp.y * tile_height) + 100 - (tile_height/2));
}

this.move = function(x, y) {
this.x += x;
this.y += y;
}

}

function Point(x, y, height_var) {
this.x = x;
this.y = y;
this.h = height_var;
this.t = 1;

this.getRandomNeighbour = function()
{
moves = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

this.neigh_list = new Array();

for (move in moves) {
if (this.x + moves[move][0] >= 0 && this.x + moves[move][0] < width / sqSize) {
  if (this.y + moves[move][1] >= 0 && this.y + moves[move][1] < height / sqSize) {
    this.neigh_list.push(get_cell(this.x + moves[move][0], this.y + moves[move][1]));
}}}

return this.neigh_list[Math.floor(Math.random() * this.neigh_list.length)];
}
}

function draw_tile (pt, image) {
context.drawImage(image, pt.x, pt.y);
}

function draw_sprite(pt, sprite_num) {
 context.drawImage(sheet, sprite_num * 16, 0, 16, 16, (pt.x * tile_width) + offset, (pt.y * tile_height) - (pt.h * 8) + 100, 16, 16);
}

function map_pos(map) {
for(i=0; i<no_rows; i++) {
  for(j=0; j<no_cols; j++) {
    console.log(cartToIso(map[i][j]));
  }
}
}

function dep_onScreen(cell)
{
if (cell.x < 0 || cell.x > width)
{
return false;
}
else if (cell.y < 0 || cell.y > height)
{
return false;
}
else
{
return true;
}
}

function onScreen(cell)
{
if (cell.screen_x < cam_x || cell.screen_x > (cam_x + cam_w))
{
return false;
}
else if (cell.screen_y < cam_y || cell.screen_y > (cam_y + cam_h))
{
return false;
}
else
{
return true;
}
}

function makeMap()
{
  map = [];

  for (x=0; x < (width / 4) / sqSize; x += 1)
  {
    map[x] = [];
    for (y=0; y < (height / 4) / sqSize; y += 1)
    {
      map[x][y] = new Point(x, y, 0);
    }
  }

  return map;
}

function makeZMap(width, height, depth) {
 map = [];

 for (z = 0; z < depth; z++) {
  map[z] = [];
  for (x = 0; x < width; x++) {
   map[z][x] = [];
   for (y = 0; y < height; y++) {
    map[z][x][y] = new Cell(x, y, z);
   }
  }
 }
 return map;
}

function drawZMap(map) {
 for(z = 0; z < map.length; z++) {
  for(x = 0; x < map[z].length; x++) {
   for(y = 0; y < map[z][x].length; y++) {
    map[z][x][y].draw();
   }
  }
 }
}

function waterFill(map) {
 for(z = 0; z < water_level; z++) {
  for(x = 0; x < map[z].length; x++) {
   for(y = 0; y < map[z][x].length; y++) {
    if (map[z][x][y].type != 1) {
     map[z][x][y].type = 2;
    }
   }
  }
 }
}

function Cell(x, y, z) {
 this.x = x;
 this.y = y;
 this.z = z;
 this.iso_x = x - y;
 this.iso_y = (x + y) / 2;
 this.screen_x = (this.iso_x * tile_width) + offset;
 this.screen_y = (this.iso_y * tile_height) + offset - (this.z * tile_height);
  
 this.type = 0;				// 0 = nothing, 1 = land, 2 = water
 this.height = 0;

 this.draw = function() {
  if (this.type != 0) {
   if (onScreen(this) == true) {
    context.drawImage(sheet, this.type * sprite_w, 0, sprite_w, sprite_h, (this.screen_x - cam_x), (this.screen_y - cam_y), sprite_w, sprite_h);
   }
  }
 }

 this.getRandomNeighbour = function() {
  moves = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  this.neigh_list = new Array();

  for (move in moves) {
   if (this.x + moves[move][0] >= 0 && this.x + moves[move][0] < map_width) {
    if (this.y + moves[move][1] >= 0 && this.y + moves[move][1] < map_height) {
     this.neigh_list.push(get_cell(this.x + moves[move][0], this.y + moves[move][1], 0));
    }
   }
  }
  return this.neigh_list[Math.floor(Math.random() * this.neigh_list.length)];
 }
}

function drawMap(map)
{
 for (x=0; x < (width / 4) / sqSize; x += 1)
  {
    for (y=0; y < (height / 4) / sqSize; y += 1)
    {
      if (onScreen(map[x][y]))
      {
       z = 0;
       while (z < 20) {
        if (map[x][y].h == z) {
         draw_sprite(cartToIso(map[x][y]), map[x][y].h);
        }

        z += 1;
       }
       //draw_sprite(cartToIso(map[x][y]), map[x][y].t);
      }
    }
  }
}

function makeTerrain(map)
{
for(a=0; a < 3; a++)
{
new_cell = get_cell(Math.floor(Math.random() * map[0].length), Math.floor(Math.random() * map[0][0].length), 0);

new_cell.type = 1;

for(i=100; i > 0; i--)
{
new_cell = new_cell.getRandomNeighbour();

temp = 1;
while (temp == 1) {
 temp = new_cell.type;

 if (temp == 1) {
  if (new_cell.z + 1 < map_depth) {				
   new_cell = get_cell(new_cell.x, new_cell.y, new_cell.z + 1);
  }
  else {
   temp = 0;
  }
 }
 else {
  new_cell.type = 1;  
  temp = 0; 
 }
}
}
}
}

function simplexTerrain(map) {
 noise.seed(Math.random());
 for(z = 0; z < 1; z++) {
  for(x = 0; x < map[z].length; x++) {
   for(y = 0; y < map[z][x].length; y++) {
    value = Math.abs(noise.simplex2(map[z][x][y].x / 100, map[z][x][y].y / 100));
    value = Math.round(value * (map_depth - 1));

    temp = value;
    map[z][x][y].height = value;
    while (temp >= 0) {
     map[temp][x][y].type = 3;
     temp--;
    }

   }
  }
 }
}

function moistureMap(map) {
 for(z = 0; z < 1; z++) {
  for(x = 0; x < map[z].length; x++) {
   for(y = 0; y < map[z][x].length; y++) {
    top_block = map[map[z][x][y].height][x][y];
    if (top_block.z < 10) {
     top_block.type = 1;
    }
    else {
     top_block.type = 2;
    }
   }
  }
 }
}

function get_cell(x, y, z) {
 return map[z][x][y];
}

function getMousePos(evt) {
var rect = canvas.getBoundingClientRect();
mouse_x = evt.clientX - rect.left;
mouse_y = evt.clientY - rect.top;
console.log(isoToCart(new Point(mouse_x, mouse_y, 0)));
}

