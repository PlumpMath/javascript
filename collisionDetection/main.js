/**
 *
 * Simple 2D collision detection demo main functions
 *
 * @licstart  The following is the entire license notice for the
 * JavaScript code in this page.
 *
 * Copyright (c) 2014 Sascha Willems (www.saschawillems.de)
 * This software is provided 'as-is', without any express or implied
 * warranty.
 * In no event will the authors be held liable for any damages arising
 * from the use of this software.

 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:

 * The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would
 * be appreciated but is not required.
 * Altered source versions must be plainly marked as such, and must not
 * be misrepresented as being the original software.

 * This notice may not be removed or altered from any source distribution.

 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context = canvas.getContext('2d');
canvas.addEventListener('click', canvasClick, true);
window.addEventListener('keypress', keyPress, false);
var activeObject = 'dest';

// e.g. be the current player position
var sourcePos = new vec2(canvas.width/2, canvas.height/2 - 64);
// e.g. the next player position interpolated by movement vector and some timefactor
var destPos = new vec2(canvas.width/2 + 160, canvas.height/2 - 340);

var cx = canvas.width / 2;
var cy = canvas.height / 2;

var lines = [
              // Simple room with corridor and door
              new line(cx - 128, cy + 64, cx + 128, cy + 64),
              new line(cx + 128, cy + 64, cx + 128, cy - 256),
              new line(cx - 128, cy + 64, cx - 128, cy),
              new line(cx - 128, cy, cx - 256, cy),
              new line(cx - 128, cy-64, cx - 256, cy-64),
              new line(cx - 192, cy, cx - 192, cy-64),
              new line(cx - 128, cy-64, cx - 128, cy-256),
              new line(cx - 128, cy-256, cx + 128, cy-256),
              // Box in rrom
              new line(cx + 40, cy - 160, cx + 80, cy - 160),
              new line(cx + 40, cy - 160, cx + 40, cy - 200),
              new line(cx + 40, cy - 200, cx + 80, cy - 200),
              new line(cx + 80, cy - 160, cx + 80, cy - 200)
            ];

var collisionPoints = [];

function drawLine(x1, y1, x2, y2, width) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineWidth = width;
  context.stroke();
}

function drawCircle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.lineWidth = 1;
  context.stroke();
}

function drawBackground() {
  context.rect(0, 0, canvas.width, canvas.height);
  var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#004CB3');
  gradient.addColorStop(1, '#8ED6FF');
  context.fillStyle = gradient;
  context.fill();
}

function canvasClick(event) {
  if (activeObject == 'dest') {
    destPos.set(event.x, event.y);
  } else {
    sourcePos.set(event.x, event.y);
  }
  drawScene();
}

function keyPress(event) {
  if (event.charCode == 112) {
    activeObject = (activeObject == 'dest') ? 'source' : 'dest';
    drawScene();
  }
}

function drawScene() {
  drawBackground();

  // Get collision points
  collisionPoints.length = 0;
  for (var i in lines) {

    var collisionPoint = lines[i].getCollisionPoint(sourcePos, destPos);

    if (collisionPoint !== null) {
      collisionPoints.push(collisionPoint);
      context.fillStyle = 'white';
      context.strokeStyle = 'red';
      drawCircle(collisionPoint.x, collisionPoint.y, 4);
    } else {
      context.strokeStyle = 'black';
    }
    lines[i].draw();

  }

  context.strokeStyle = 'black';

  drawLine(sourcePos.x, sourcePos.y, destPos.x, destPos.y, 1);

  context.fillStyle = (activeObject == 'source') ? '#AAFFAA' : 'white';
  context.strokeStyle = (activeObject == 'source') ? 'green' : 'black';
  drawCircle(sourcePos.x, sourcePos.y, 16);

  context.fillStyle = (activeObject == 'dest') ? '#AAFFAA' : 'white';
  context.strokeStyle = (activeObject == 'dest') ? 'green' : 'black';
  drawCircle(destPos.x, destPos.y, 8);

  context.globalAlpha = 0.6;
  context.font = '14pt Calibri';
  context.textAlign = 'center';
  context.fillStyle = 'white';
  context.fillText('Simple 2d collision detection - 2014 by Sascha Willems', cx, cy + 260);
  context.fillText('Click to move currently active point', cx, cy + 285);
  context.fillText('Press "p" to toggle between source and destination point (selection is green)', cx, cy + 310);

  context.textAlign = 'left';
  context.font = '12pt Calibri';
  context.fillText(collisionPoints.length + ' collision point(s) : ', cx + 250, cy - 260);
  for (i in collisionPoints) {
    context.fillText(collisionPoints[i].x.toFixed(2) + ' / ' + collisionPoints[i].y.toFixed(2) + ' (distance = ' + collisionPoints[i].distance(sourcePos.x, sourcePos.y).toFixed(2) + ')', cx + 250, cy - 240 + i * 20);
  }

  context.globalAlpha = 1.0;
}

drawScene();
