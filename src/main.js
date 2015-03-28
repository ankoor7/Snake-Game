"use strict";

function Game () {
	this.field = new Field(8,8);
	this.player = new Player();
	this.snake = new Snake(this.field);
	function countDown () {
	}

	function start () {
		field.growFood();
	}

	function end () {
	}
}

function Field (width, height) {
	var width = width;
	var height = height;
	var allCells = setAllCells();

	//  Protected
	var food;

	this.getHeight = function() {
		return height;
	};

	this.getWidth = function() {
		return width;
	};

	this.getFood = function() {
		return food;
	};

	this.setFood = function(coord) {
		food = coord;
	};

	this.growFood = function(snakePosition) {
		var cells = emptyCells(snakePosition);
		this.setFood(cells[Math.floor(Math.random()*cells.length)]);
	};

	this.foundFood = function(snakePosition) {
		if (snakePosition[0][0] === food[0] && snakePosition[0][1] === food[1]) {
			this.growFood(snakePosition);
			return true;
		} else {
			return false;
		}
	};

	this.contains = function(coord) {
		if (coord[0] <= width && coord[1] <= height && coord[0] >= 0 && coord[1] >= 0 ) {
			return true;
		} else {
			return false;
		}
	};

	function setAllCells() {
		var cells = [];
		for (var i = width; i >= 0; i--) {
			for (var j = height; j >= 0; j--) {
				cells.push( new Array(i, j) );
			}
		}
		return cells;
	}

	//  Private

	function emptyCells(snakePosition) {
		var cells = [];
		for (var i = allCells.length - 1; i >= 0; i--) {
			var empty = true;
			for (var j = snakePosition.length - 1; j >= 0; j--) {
				if (snakePosition[j][0] === allCells[i][0] && snakePosition[j][1] === allCells[i][1]) { empty = false; }
			}
			if (empty === true) { cells.push(allCells[i]); }
		}
		return cells;
	}

}


function Player () {
}

function Snake (field) {
	var field = field;
	var compass = {
		'left':       [-1,0],
		'right':    [1,0],
		'up': [0,1],
		'down': [0,-1],
	};
	var position = setInitialPosition(field);
	var status = 'alive';

	//  Should be Protected
	this.move = function (direction) {
		var nextCoord = addVector(position[0], compass[direction]);
		if (canMoveTo(nextCoord, position)) {
			position.unshift(nextCoord);
			position.pop();
		} else {
			dies();
		}
	}

	this.eat = function () {
		if ( field.foundFood(position) ) {
			grow();
		}
	}

	this.location = function () {
		return position;
	}

	this.getStatus = function () {
		return status;
	};


	//  Private
	function setInitialPosition(field) {
		var position = new Array;
		var length = Math.ceil( field.getHeight() / 2 );
		var x = Math.ceil( field.getWidth() / 2 );
		var y = Math.ceil( field.getHeight() * 0.666 );
		for (var i = length; i >= 0; i--) {
			position.push([x, y]);
			y -= 1;
		};
		return position;
	}

	function grow() {
		position.push(null);
	}

	function dies() {
		// console.log('dies');
		status = 'dead';
	}

	function canMoveTo(coord, position) {
		if (field.contains(coord) && isNotOn(position, coord)) {
			return true;
		} else {
			return false;
		}

		function isNotOn(position, coord) {
			var notOn = true;
			for (var i = position.length - 1; i >= 0; i--) {
				if (position[i][0] === coord[0] && position[i][1] === coord[1]) {
					notOn = false;
				}
			}
			return notOn;
		}
	}
}

function isNot(element) {
	return (element[0] != coord[0] && element[1] != coord[1]);
}

function addVector(a,b) {
	return [ a[0]+b[0],  a[1]+b[1] ];
}

// Polyfill includes
if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}