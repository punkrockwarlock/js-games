/* Press Ctrl + H, replace 'anim' with a unique variable name. */


//############ Globals #############

var anim_context;

var anim_width = 800;
var anim_height = 200;
var anim_sqSize = 96;

var anim_intervalId = 0;

window.addEventListener("load", anim_init, true);

//###############################

function anim_init() 
{
 if (anim_intervalId) {
  clearInterval(anim_intervalId);
  }
anim_canvas = document.getElementById("canvas");
anim_context = anim_canvas.getContext("2d");

anim_canvas.width = anim_width;
anim_canvas.height = anim_height;

anim_game_speed = 7;
anim_old_time = 0;

normal_sprite = new Sprite();
normal_sprite_frame = 0;
frame_counter = 0;
change_interval = 10;
fps = 124;

old_time = performance.now();

//anim_canvas.addEventListener('mousemove', getMousePos);

anim_intervalId = setTimeout(anim_gameProcess, anim_game_speed);

window.onkeydown = keydown;
window.onkeyup = keyup;
}

function anim_gameProcess()			// remember to rename this function to [FILENAME] + 'anim_gameProcess()'
{
anim_intervalId = setTimeout(anim_gameProcess, anim_game_speed);

clear(anim_context, anim_width, anim_height); 		// clears canvas

if(normal_sprite.animating == 1) {
  normal_sprite.animate(fps, 0.3, 5);
  if(normal_sprite.direction == 1)
  {
  normal_sprite.x += 2;
  }
  else {
  normal_sprite.x -= 2;
   }
}

normal_sprite.draw(normal_sprite_frame);

print_list([normal_sprite_frame, frame_counter, normal_sprite.change_interval]);
fps = 1000 / (performance.now() - old_time);
old_time = performance.now()

}

function anim_stop() {				// remember to rename this function to [FILENAME] + 'anim_stop()'
  clear(anim_context, anim_width, anim_height);
  clearInterval(anim_intervalId);
}

function anim_changeSpeed(speed) {
anim_game_speed = speed;
}

function Sprite()
{
this.x = 0;
this.y = 104;

this.sprites = new Image();
this.sprites.src = "spritesheet.png";
this.animating = 0;

this.change_interval = 0;
this.direction = 1;

this.draw = function(frame) {
anim_context.drawImage(this.sprites, frame * anim_sqSize, 0, anim_sqSize, anim_sqSize, this.x, this.y, anim_sqSize, anim_sqSize);
}

this.animate = function(fps, anim_time, anim_frames) {
total_frames = fps * anim_time; // anim_time needs to be in seconds
this.change_interval = total_frames / anim_frames;

if (frame_counter >= this.change_interval)
{
normal_sprite_frame += 1;
frame_counter = 0;
}
else {
frame_counter += 1;
}

if (normal_sprite_frame == 5)
{
normal_sprite_frame = 0;
}
}

this.flip = function(dir)
{
if(dir == 1)
{
this.direction = 1;
this.sprites.src = "spritesheet.png";
}
else
{
this.direction = 0;
this.sprites.src = "spritesheet_l.png";
}
}

} // end of sprite class

function keydown(e)
{
if(e.keyCode == 65)  // a
{
if(normal_sprite.direction != 0) {normal_sprite.flip(0);}
normal_sprite.animating = 1;
}
else if (e.keyCode == 87)  // w
{
pos2.y -= movem;
}
else if (e.keyCode == 68) // d
{
if(normal_sprite.direction != 1) {normal_sprite.flip(1);}
normal_sprite.animating = 1;
}
else if (e.keyCode == 83) // s
{
pos2.y += movem;
}
else if (e.keyCode == 13) // enter
{
normal_sprite.x = 0;
}
}

function keyup(e)
{
if(e.keyCode == 65)  // a
{
normal_sprite.animating = 0;
normal_sprite_frame = 0
}
else if (e.keyCode == 87)  // w
{}
else if (e.keyCode == 68) // d
{
normal_sprite.animating = 0;
normal_sprite_frame = 0
}
else if (e.keyCode == 83) // s
{}
else if (e.keyCode == 13) // enter
{}
}


