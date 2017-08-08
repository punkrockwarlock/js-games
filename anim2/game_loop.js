/* Press Ctrl + H, replace 'anim' with a unique variable name. */


//############ Globals #############

var anim_context;

var anim_width = 800;
var anim_height = 400;
var anim_sqSize = 45;

var anim_intervalId = 0;
var fps = 124;

var anim_stopper = 0;
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

if (normal_sprite.state == "walk")
{
normal_sprite.x += 1;
normal_sprite.walk.animate();
}

if (normal_sprite.state == "jump")
{
normal_sprite.x += 2;
if (normal_sprite.jump.frame < 2) {
normal_sprite.y -= (2)
}
else if (normal_sprite.jump.frame > 3) {
normal_sprite.y += (2)
}
normal_sprite.jump.animate();
}

normal_sprite.draw(normal_sprite_frame);

print_list([normal_sprite.state]);
fps = 1000 / (performance.now() - old_time);
old_time = performance.now()

if (anim_stopper == 1) 
{
anim_stopper = 0;

normal_sprite.state = "none";
normal_sprite.walk.animating = 0;
normal_sprite.walk.frame = 0;

normal_sprite.jump.animating = 0;
normal_sprite.jump.frame = 0;
}
}

function anim_stop() {				// remember to rename this function to [FILENAME] + 'anim_stop()'
  clear(anim_context, anim_width, anim_height);
  clearInterval(anim_intervalId);
}

function anim_changeSpeed(speed) {
anim_game_speed = speed;
}

function Animation(spritesheet, fps, anim_time, anim_frames)
{
this.frame = 0;
this.animating = 0;
this.sheet = new Image();
this.sheet.src = spritesheet;

this.fps = fps;
this.anim_time = anim_time;
this.anim_frames = anim_frames;

this.change_interval = 0;
this.direction = 1;

this.animate = function() {
total_frames = this.fps * this.anim_time; // anim_time needs to be in seconds
this.change_interval = total_frames / this.anim_frames;

if (frame_counter >= this.change_interval)
{
this.frame += 1;
frame_counter = 0;
}
else {
frame_counter += 1;
}

if (this.frame == this.anim_frames - 1)
{
this.frame = 0;
anim_stopper = 1;
}
}

}

function Sprite()
{
this.x = 0;
this.y = 285;

this.state = "none";

this.walk = new Animation("spritesheet.png", fps, 0.7, 9);
this.jump = new Animation("spritesheet_jump.png", fps, 0.8, 7);

this.draw = function(frame) {
if (this.state == "none") {
anim_context.drawImage(this.walk.sheet, 0 * anim_sqSize, 0, anim_sqSize, 115, this.x, this.y, anim_sqSize, 115);
}

if (this.state == "walk") {
anim_context.drawImage(this.walk.sheet, this.walk.frame * anim_sqSize, 0, anim_sqSize, 115, this.x, this.y, anim_sqSize, 115);
}

if (this.state == "jump") {
anim_context.drawImage(this.jump.sheet, this.jump.frame * anim_sqSize, 0, anim_sqSize, 115, this.x, this.y, anim_sqSize, 115);
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

}
else if (e.keyCode == 87)  // w
{
pos2.y -= movem;
}
else if (e.keyCode == 68) // d
{
if (normal_sprite.state == "none")
{
normal_sprite.state = "walk";
normal_sprite.walk.animating = 1;
}
}
else if (e.keyCode == 83) // s
{
pos2.y += movem;
}
else if (e.keyCode == 13) // enter
{
normal_sprite.state = "jump";
normal_sprite.jump.animating = 1;
}

else if (e.keyCode == 32) // s
{
normal_sprite.x = 0;
normal_sprite.y = 285;
}
}

function keyup(e)
{
if(e.keyCode == 65)  // a
{

}
else if (e.keyCode == 87)  // w
{}
else if (e.keyCode == 68) // d
{
if (normal_sprite.state == "walk")
{
anim_stopper = 1;
}
}
else if (e.keyCode == 83) // s
{}
else if (e.keyCode == 13) // enter
{}
}


