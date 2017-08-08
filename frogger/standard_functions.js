function clear(context, width, height)
{
context.clearRect(0, 0, width, height);
}

function drawText(context, text, size, x, y, colour, alpha) 
{
context.globalAlpha=alpha;
context.fillStyle = colour;
context.font = "bold " & size & "px sans-serif";
context.fillText(text, x, y);
}

function drawLine(context, x, y, a, b, colour)
{
context.beginPath();
context.moveTo(x, y);
context.lineTo(a, b);
context.strokeStyle=colour;
context.stroke();
}

function drawPoint(context, x, y, sqSize, colour)
{
context.fillStyle = colour;
context.fillRect(x, y, sqSize, sqSize);
context.fill();
}

function drawRect(context, x, y, width, height, colour)
{
context.fillStyle = colour;
context.fillRect(x, y, width, height);
context.fill();
}

function drawCircle(context, x, y, colour)
{
context.strokeStyle = colour;
context.beginPath();
context.arc(x, y, 10, 0, 2*Math.PI);
context.stroke();
}

Math.radians = function(degrees)
{
return degrees * Math.PI / 180;
}

Math.degrees = function(radians)
{
return radians * 180 / Math.PI;
}

function print_list(list)
{
 output_area = document.getElementById("d_out");
 if (output_area)
 {
  out_text = "list output: <br> [";
  for (elem in list) 
  {
   out_text = out_text + list[elem] + ", ";
  }
  out_text = out_text + "]";

  output_area.innerHTML = out_text;
 }
 else
 {
  alert("Debugging needs an area to put results. Please include a <div id='d_out'> tag in your page.");
 }
}

function atan360(x) {
return (x > 0 ? x : (2*Math.PI + x)) * 360 / (2*Math.PI);
}

function cross(v1, v2) {
return (v1.x*v2.y) - (v1.y*v2.x);
}

function PerpDot(A, B) {
	return (A.x * B.y) - (A.y * B.x);
}

function dot(A, B) {
	return (A.x * B.x) + (A.y * B.y) ;
}

function keep360(num) {
if (num > 360) {num = num - 360;}
else if (num < 0) {num = num + 360;}
return num;
}

function getMousePos(evt, canvas) {
var rect = canvas.getBoundingClientRect();
mouse_x = evt.clientX - rect.left;
mouse_y = evt.clientY - rect.top;
}
