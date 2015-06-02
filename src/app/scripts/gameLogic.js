"use strict";

function Map (width, height, broadcast) {
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
    broadcast('map', 'food', food);
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

function Player (broadcast) {
  $(document).keydown(function (e) {
    var keys = {
      13: 'enter',
      27: 'escape',
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      81: 'q',
    },
    code = e.which;
    broadcast('player', 'press', keys[code]);
  });

}

function Snake (field, broadcast) {
  var compass = {
    'left':       [-1,0],
    'right':    [1,0],
    'up': [0,1],
    'down': [0,-1],
  };
  var position = setInitialPosition(field);
  var status = 'alive';

  this.move = function (direction) {
    if (!compass.hasOwnProperty(direction)) { return; }
    var nextCoord = addVector(position[0], compass[direction]);
    if (canMoveTo(nextCoord, position) && status === 'alive') {
      setPosition(nextCoord);
      eat();
    } else {
      dies();
    }
  };

  function eat() {
    if ( field.foundFood(position) ) {
      grow();
    }
  };

  function setPosition(nextCoord) {
    position.unshift(nextCoord);
    position.pop();
    broadcast('snake', 'position', position);
  }

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
    position.push([]);
  }

  function dies() {
    broadcast('snake', 'dead', true);
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