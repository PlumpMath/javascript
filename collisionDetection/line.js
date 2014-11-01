/**
 *
 * Line class with HTML5 rendering and collision point detection
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

function line(x0, y0, x1, y1) {
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;

  // Draw on a HTML5 canvas
  this.draw = function() {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineWidth = 2;
    context.stroke();
  };

  // Calculate collision point between this line and the line described by origin and dest points
  // On collision : returns the collision point as a 2D vector, returns null if no collision is detected
  this.getCollisionPoint = function(origin, dest) {
    var segmentPos = new vec2(dest.x - origin.x, dest.y - origin.y);
    var segmentWall = new vec2(this.x1 - this.x0, this.y1 - this.y0);

    var s = (-segmentPos.y*(origin.x-this.x0) + segmentPos.x*(origin.y-this.y0)) / (-segmentWall.x*segmentPos.y + segmentPos.x*segmentWall.y);
    var t = ( segmentWall.x*(origin.y-this.y0) - segmentWall.y*(origin.x-this.x0)) / (-segmentWall.x*segmentPos.y + segmentPos.x*segmentWall.y);

    if ( (s >= 0) && (s <= 1) && (t >= 0) && (t <= 1) ) {
      var collisionPoint = new vec2(origin.x + t*segmentPos.x, origin.y + t*segmentPos.y);
      return collisionPoint;
    } else {
      return null;
    }
  };

}
