/**
*
*
* @licstart  The following is the entire license notice for the
* JavaScript code in this page.
*
* Copyright (C) 2015 by Sascha Willems (www.saschawillems.de)
*
* Source can be found at https://github.com/SaschaWillems
*
* The JavaScript code in this page is free software: you can
* redistribute it and/or modify it under the terms of the GNU
* General Public License (GNU GPL) as published by the Free Software
* Foundation, either version 3 of the License, or (at your option)
* any later version.  The code is distributed WITHOUT ANY WARRANTY;
* without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this page.
*
*/
*
var context;
var tree;
var deg_to_rad = Math.PI / 180.0;

function drawCircle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = '#58682E';
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = '#45844B';
  context.stroke();
}

// Trunk
function trunk(x1, y1, x2, y2, angle, depth, width) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.angle = angle;
  this.width = width;
  this.depth = depth;
  this.children = [];

  this.addChildren = function (x1, y1, angle, depth, width) {
    var length = 10.0 + Math.floor(Math.random() * 2) - Math.floor(Math.random() * 2);
    var x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * length);
    var y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * length);

    var nTrunk = new trunk(x1, y1, x2, y2, angle, depth, width);
    this.children.push(nTrunk);
    tree.addTrunk(nTrunk);
  }

  this.grow = function (x1, y1, angle, depth) {
    var length = 10.0 + Math.floor(Math.random() * 2) - Math.floor(Math.random() * 2);
    var x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * length);
    var y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * length);
    var rndl = 10.0 + Math.random() * 45.0;
    var rndr = 10.0 + Math.random() * 45.0;
    if (depth == 1) {
      tree.addLeaf(x1, y1);
    } else {
      this.addChildren(x1, y1, this.angle - rndl, depth - 1, this.width - 1);
      this.addChildren(x1, y1, this.angle + rndr, depth - 1, this.width - 1);
      if (Math.random() * 100.0 < 5.0) {
        this.addChildren(x1, y1, this.angle + rndr - rndl, depth - 1, this.width - 1);
      }
    }
  }

  this.draw = function() {
    context.beginPath();
    context.moveTo(this.x1, this.y1);
    context.lineTo(this.x2, this.y2);
    context.strokeStyle = '#514430';
    context.lineWidth = this.width;
    context.stroke();
    if (this.children.length == 0) {
      context.beginPath();
      context.arc(this.x2, this.y2, this.width, 0, 2 * Math.PI, false);
      context.fillStyle = '#45844B';
      context.fill();
      context.lineWidth = width;
      context.strokeStyle = '#58682E';
      context.stroke();
    }
  }

};

// Root
function root(x1, y1, x2, y2, width) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.width = width;

  this.draw = function() {
    context.beginPath();
    context.moveTo(this.x1, this.y1);
    context.lineTo(this.x2, this.y2);
    context.strokeStyle = '#514430';
    context.lineWidth = this.width;
    context.stroke();
    if (this.children.length == 0) {
      context.beginPath();
      context.arc(this.x2, this.y2, this.width, 0, 2 * Math.PI, false);
      context.fillStyle = '#45844B';
      context.fill();
      context.lineWidth = width;
      context.strokeStyle = '#58682E';
      context.stroke();
    }
  }

};

// Leaf
function leaf(x, y) {
  this.x = x;
  this.y = y;
}

// Tree
function tree(x, y) {
  this.trunks = [];
  this.leafs = [];
  this.roots = [];
  this.x = x;
  this.y = y;

  this.addTrunk = function(trunk) {
    this.trunks.push(trunk);
  }

  this.addLeaf = function(x, y) {
    this.leafs.push(new leaf(x, y));
  }

  this.addRoot = function(x1, y1, x2, y2, width) {
    this.roots.push(new root(x1, y1, x2, y2, width));
  }

  this.plant = function(x1, y1, angle, depth) {
    var length = 10.0 + Math.floor(Math.random() * 2) - Math.floor(Math.random() * 2);
    var x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * length);
    var y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * length);
    var nTrunk = new trunk(x1, y1, x2, y2, angle, depth, 12);
    tree.addTrunk(nTrunk);
  }

  this.draw = function() {

    context.save();
    //context.translate(x, y);

    if (this.trunks.length == 0) {
      // Draw seed
      context.beginPath();
      context.arc(x, y, 24, 0, 2 * Math.PI, false);
      context.fillStyle = '#45844B';
      context.fill();
      context.lineWidth = 3;
      context.strokeStyle = '#58682E';
      context.stroke();
    }

    for (i = 0; i < this.trunks.length; i++) {
      this.trunks[i].draw();
    }

    for (i = 0; i < this.leafs.length; i++) {
      drawCircle(this.leafs[i].x, this.leafs[i].y, 8);
    }

    for (i = 0; i < this.roots.length; i++) {
      drawLine(this.roots[i].x1, this.roots[i].y1, this.roots[i].x2, this.roots[i].y2, this.roots[i].width);
    }

    context.restore();
  }

  this.onClick = function(x, y) {

    if (this.trunks.length == 0) {
      var hitSphereRadius = 12;
      if ( (x >= this.x - hitSphereRadius) && (x <= this.x + hitSphereRadius) &&
           (y >= this.y - hitSphereRadius) && (y <= this.y + hitSphereRadius) ) {
            depth = 8 + Math.floor(Math.random()*4);
            depthRoot = 5 + Math.floor(Math.random()*4);
            var angle = -90 + (Math.random() * 35.0) - (Math.random() * 35.0);
            this.plant(x, y, angle, depth);
      }

    } else {
      var hitSphereRadius = 8;
      for (i = 0; i < this.trunks.length; i++) {
        if (this.trunks[i].children.length == 0) {
          if ( (x >= this.trunks[i].x2 - hitSphereRadius) && (x <= this.trunks[i].x2 + hitSphereRadius) &&
               (y >= this.trunks[i].y2 - hitSphereRadius) && (y <= this.trunks[i].y2 + hitSphereRadius) ) {
            this.trunks[i].grow(this.trunks[i].x2, this.trunks[i].y2, -90, depth-1);
          }
        }
      }
    }
  }

}
