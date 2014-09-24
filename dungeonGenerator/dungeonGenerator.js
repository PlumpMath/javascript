/**
 *
 * @source: http://www.lduros.net/some-javascript-source.js
 *
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2014 by Sascha Willems (www.saschawillems.de)
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

var NORTH = 0;
var SOUTH = 1;
var WEST = 2;
var EAST = 3;
var FORWARD = 0;
var BACKWARD = 1;
var LEFT = 2;
var RIGHT = 3;
var CellTypeEmpty = 0;
var CellTypeFloor = 1;
var CellTypeRoom  = 2;
var CellTypeDebug   = 0xFE;
var CellTypeRemoved = 0xFF;
var Horizontal = 0;
var Vertical = 1;

function cell(x, y, owner) {
  this.wall = [false, false, false, false];
	this.door = [false, false, false, false];
	this.type = CellTypeEmpty;
	this.x = x;
	this.y = y;
	this.isCrossing = false;
	this.isCorridor = false;
	this.isVisible = false;
	this.owner = owner;

  this.draw = function() {
    // TODO : Currently only most basic drawing
    context.beginPath();
    if (this.type == CellTypeEmpty) {
      context.fillStyle = '#FFFFFF';
      context.strokeStyle = '#000000';
    } else {
      context.fillStyle = '#ADADAD';
      context.strokeStyle = '#000000';
      if (this.isCorridor) {
        context.fillStyle = '#6F4C3D';
      }
      context.rect(x*10+1, y*10+1, 10-2, 10-2);
      context.fill();
    }
    context.lineWidth = 1;
    context.stroke();
  };

  this.drawWalls = function()  {
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    if (this.wall[NORTH]) {
      context.moveTo(x*10, y*10);
      context.lineTo(x*10+10, y*10);
    }
    if (this.wall[SOUTH]) {
      context.moveTo(x*10, y*10+10);
      context.lineTo(x*10+10, y*10+10);
    }
    if (this.wall[EAST]) {
      context.moveTo(x*10+10, y*10);
      context.lineTo(x*10+10, y*10+10);
    }
    if (this.wall[WEST]) {
      context.moveTo(x*10, y*10);
      context.lineTo(x*10, y*10+10);
    }
    context.stroke();
  };

  this.drawDoors = function() {
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = '#00FF00';
    if (this.door[NORTH]) {
      context.moveTo(x*10, y*10);
      context.lineTo(x*10+10, y*10);
    }
    if (this.door[SOUTH]) {
      context.moveTo(x*10, y*10+10);
      context.lineTo(x*10+10, y*10+10);
    }
    if (this.door[EAST]) {
      context.moveTo(x*10+10, y*10);
      context.lineTo(x*10+10, y*10+10);
    }
    if (this.door[WEST]) {
      context.moveTo(x*10, y*10);
      context.lineTo(x*10, y*10+10);
    }
    context.stroke();
  };

}

function room() {
  this.position.x = 0;
  this.position.y = 0;
  this.size.left = 0;
  this.size.top = 0;
  this.size.right = 0;
  this.size.bottom = 0;
  this.distance = 0.0;
}

function dungeon(width, height, roomFrequency, splitStop) {
	this.partitions = [];
	this.rooms = [];
  this.cell = new Array([]);
	this.width = width;
	this.height = height;
	this.scale = 0.0;
  this.roomFrequency = roomFrequency;
  this.splitStop = splitStop;

  this.generateName = function() {
    attribute = ["fiery", "dark", "hellish", "oozing", "melting", "endless", "infinite", "rotten", "haunted", "obscure"];
    prefix = ["chambers", "dungeon", "rooms", "maze", "labyrinth", "underground", "cellar", "keep", "heart", "eye"];
    suffix = ["death", "torment", "terror", "horror", "doom", "hate", "madness", "insanity", "torture", "damnation"];
    return (
      attribute[Math.floor(Math.random() * attribute.length)] + " " +
      prefix[Math.floor(Math.random() * prefix.length)] + " of " +
      suffix[Math.floor(Math.random() * suffix.length)]
    );
  };

  this.draw = function() {
    context.save();
    context.clearRect(0, 0, elem.width, elem.height);

    context.font = '14pt Calibri';
    context.textAlign = 'left';
    context.fillStyle = 'black';
    context.fillText(this.name, 10, 20);

    context.translate(10, 15);

    for (x=0; x<this.width; x++) {
      for (y=0; y<this.height; y++) {
          this.cell[x][y].draw();
      }
    }

    for (x=0; x<this.width; x++) {
      for (y=0; y<this.height; y++) {
          this.cell[x][y].drawWalls();
      }
    }

    for (x=0; x<this.width; x++) {
      for (y=0; y<this.height; y++) {
          this.cell[x][y].drawDoors();
      }
    }

    context.restore();
  };

  this.pointInRoom = function(x, y) {
    var result = false;

    for (i = 0; i < this.partitions.length; i++) {
      if (this.partitions[i].hasRoom) {
        if ((x >= this.partitions[i].roomDimLeft) & (x <= this.partitions[i].roomDimRight) &
            (y >= this.partitions[i].roomDimTop) & (y <= this.partitions[i].roomDimBottom)) {
          return true;
        }
      }
    }

    return result;
  };

  this.name = this.generateName();

}

function dungeonGenerator(width, height) {

  this.dungeon = null;

  this.generate = function(width, height, roomFrequency, splitStop) {
      console.log("RoomFrequency = ", roomFrequency);
      console.log("BSP split stop = ", splitStop);
      this.dungeon = new dungeon(width, height, roomFrequency, splitStop);

      for (x = 0; x < width; x++) {
        this.dungeon.cell[x] = new Array([]);
        for (y = 0; y < height; y++) {
          this.dungeon.cell[x][y] = new cell(x, y, this.dungeon);
        }
      }

      this.generateRooms(width, height);
      this.generateWalls();
      this.generateDoors();
  };

  this.generateRooms = function(width, height) {

    // Generate root node for BSP Tree
    console.log('root');
    var bspTree = new bspPartition(this.dungeon, null, 0, 0, width, height, Horizontal, 0);
		bspTree.split(true, 16, 32);

		// Connect all rooms
		//  First get branch end nodes (all nodes that don't have children anymore)
		//  Needed because the tree must be traversed from bottom to top
		var endPartitions = [];

		for (i = 0; i < this.dungeon.partitions.length; i++) {
			if ((this.dungeon.partitions[i].children.length === 0) && (this.dungeon.partitions[i].hasRoom) ) {
				endPartitions.push(this.dungeon.partitions[i]);
			}
		}
		if (endPartitions.length > 0) {
			for (var i = 0; i < endPartitions.length; i++) {
        //console.log(i + '/' + endPartitions.length);
			  endPartitions[i].connect();
			}
		}
  };

  this.generateWalls = function() {

		for (var x = 0; x < this.dungeon.width; x++) {
			for (var y = 0; y < this.dungeon.height; y++) {
				curCell = this.dungeon.cell[x][y];
				if (curCell.type > CellTypeEmpty) {

					// To the west
					if (x === 0) {
						curCell.wall[WEST] = true;
					} else {
						if (this.dungeon.cell[x-1][y].type == CellTypeEmpty) {
							curCell.wall[WEST] = true;
						}
					}

					// To the east
					if (x == dungeon.width - 1) {
						curCell.wall[EAST] = true;
					} else {
						if (this.dungeon.cell[x+1][y].type == CellTypeEmpty) {
							curCell.wall[EAST] = true;
						}
					}

					// To the north
					if (y === 0) {
						curCell.wall[NORTH] = true;
					} else {
						if (this.dungeon.cell[x][y-1].type == CellTypeEmpty) {
							curCell.wall[NORTH] = true;
						}
					}

					// To the south
					if (y == dungeon.height - 1) {
						curCell.wall[SOUTH] = true;
					} else {
						if (this.dungeon.cell[x][y+1].type == CellTypeEmpty) {
							curCell.wall[SOUTH] = true;
						}
					}

				}
			}
		}

  };

  this.generateDoors = function () {
		for (var x = 0; x < this.dungeon.width; x++) {
			for (var y = 0; y < this.dungeon.height; y++) {
				curCell = this.dungeon.cell[x][y];

				// Check if cell has at least two opposite walls to each other (east and west or south and north)
	      // Then check against neighbors. If neighbor cell has less than two walls, a corridor usually ends into a room and a door needs to be placed

				if ((curCell.wall[WEST]) && (curCell.wall[EAST])) {
					if (y > 0) {
						if ((this.dungeon.cell[x][y-1].type != CellTypeEmpty) && (!this.dungeon.cell[x][y-1].isCorridor))
							curCell.door[NORTH] = true;
					}
					if (y < this.dungeon.height-1) {
						if ((this.dungeon.cell[x][y+1].type != CellTypeEmpty) && (!this.dungeon.cell[x][y+1].isCorridor))
							curCell.door[SOUTH] = true;
					}
				}

				if ((curCell.wall[NORTH]) && (curCell.wall[SOUTH])) {
					if (x > 0) {
						if ((this.dungeon.cell[x-1][y].type != CellTypeEmpty) && (!this.dungeon.cell[x-1][y].isCorridor))
							curCell.door[WEST] = true;
					}
					if (x < this.dungeon.width-1) {
						if ((this.dungeon.cell[x+1][y].type != CellTypeEmpty) && (!this.dungeon.cell[x+1][y].isCorridor))
							curCell.door[EAST] = true;
					}
				}

			}
		}
  };

}
