"use strict";

function Board (width, height) {
	// paint the board
	this.setup = function(container) {
		var gameSpace = $(container);
		var columns = '';

		for (var j = height; j > 0; j--) {
			gameSpace.append('<div class="row" id="row' + j + '"></div>');
		}

		for (var i = width; i > 0; i--) {
			columns = columns + '<div class="column' + i + ' cell"></div>';
		}
		$('.row').append(columns);
	};

	// subscribe to field and snake

}

function Game (width, height) {
	if (isNaN(width)) { width = 8; }
	if (isNaN(height)) { height = 8; }
	this.field = new Map(width, height);
	this.player = new Player();
	this.snake = new Snake(this.field);

	// Need a painter object to control the DOM
	// Use Pub/Sub to connect field and snake to painter and, the game functions
	// a pub/sub version:
	// http://davidwalsh.name/pubsub-javascript

	function Build () {
		// makes the game screen and DOM elements
		// intro screen (?)
	}


	function Manipulate (argument) {
		// changes the game area according to the active elements
		// use pub/sub and subscribe to field and snake
	}

	this.start = function() {
		countDown()
		this.field.growFood(this.snake.location());
	};

	this.end = function() {
	};

	function countDown (number) {
		// set div contents to '3'
		setTimeout(function() {
			// set div contents to 2
		}, 1000);
		setTimeout(function() {
			// set div contents to 1
		}, 2000);
		setTimeout(function() {
			// set contents of div to 'GO!!'
			// Fade out the div and remove
		}, 2300);
	}
}

function Map (width, height) {
	if (isNaN(width)) { width = 8; }
	if (isNaN(height)) { height = 8; }
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

	this.growFood = function(filledCells) {
		var cells = emptyCells(filledCells);
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

	function emptyCells(filledCells) {
		var cells = [];
		for (var i = allCells.length - 1; i >= 0; i--) {
			var empty = true;
			for (var j = filledCells.length - 1; j >= 0; j--) {
				if (filledCells[j][0] === allCells[i][0] && filledCells[j][1] === allCells[i][1]) { empty = false; }
			}
			if (empty === true) { cells.push(allCells[i]); }
		}
		return cells;
	}

}


function Player (snake) {
}

function Snake (field) {
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
	};

	this.eat = function () {
		if ( field.foundFood(position) ) {
			grow();
		}
	};

	this.location = function () {
		return position;
	};

	this.getStatus = function () {
		return status;
	};


	//  Private
	function setInitialPosition(field) {
		var position = new Array();
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