"use strict";

function Game (divContainer) {
	var messenger,
		cellsWide,
		cellsHigh,
		gameLoop,
		snake;

	messenger = new PubSub();

	this.board = build(divContainer);
	this.field = new Map(this.board.width, this.board.height, messenger.send);
	this.player = new Player(messenger.send);
	this.snake = new Snake(this.field, messenger.send);
	snake = this.snake;

	// Use Pub/Sub to connect field and snake to painter and, the game functions
	// a pub/sub version:
	// http://davidwalsh.name/pubsub-javascript

	messenger.register('snake', 'position', this.board.drawSnake);
	messenger.register('snake', 'dead', function() {console.log("SNAKE DEAD");});
	messenger.register('map', 'food', this.board.drawFood);
	messenger.register('player', 'press', this.snake.move);
	messenger.register('player', 'press', end);



	// when snake is dead:
	// - clear the board,
	//  - show the score,
	//  - show the end of game menu

	function build (container) {
		var board,
			minWidth = _.min([$(container).width(), $(container).height()]),
			screenSizes = [{
					name: 'large',
					width: 1824,
					cellSize: 30,
				},
				{
					name: 'medium',
					width: 1224,
					cellSize: 30,
				},
				{
					name: 'small',
					width: 900,
					cellSize: 30,
			}],
			thisScreenSize = _.reduce(screenSizes, function (smallScreen, thisScreen, key) {
				if (thisScreen.width > minWidth) return smallScreen;
				return ( (smallScreen.width - minWidth) < (thisScreen.width - minWidth) ) ? smallScreen : thisScreen;
			});

			if (minWidth < 1824) {
				thisScreenSize = _.find(screenSizes, function (option) {
					return (option.width === 1824);
				})
			}

			if (minWidth < 1224) {
				thisScreenSize = _.find(screenSizes, function (option) {
					return (option.width === 1224);
				})
			}

			if (minWidth < 900) {
				thisScreenSize = _.find(screenSizes, function (option) {
					return (option.width === 900);
				})
			}

			cellsWide = Math.floor( ($(container).width() - thisScreenSize.cellSize) / thisScreenSize.cellSize);
			cellsHigh = Math.floor( ($(container).height() - thisScreenSize.cellSize) / thisScreenSize.cellSize);
			// a painter object to control the DOM
			board = new Board(cellsWide, cellsHigh, container);
			return board;
	}

	this.start = function() {
		countDown()
		this.field.growFood(this.snake.location());
		this.board.drawSnake(this.snake.location());
		gameLoop = this.player.start();
	};

	function end(keyPress) {
		if (keyPress === 'q' || snake.getStatus() === 'dead') {
			gameLoop.stop();
		}
	};

	function countDown (number) {
		// set div contents to '3'
		// setTimeout(function() {
			// set div contents to 2
		// }, 1000);
		// setTimeout(function() {
			// set div contents to 1
		// }, 2000);
		// setTimeout(function() {
			// set contents of div to 'GO!!'
			// Fade out the div and remove
		// }, 2300);
	}
}

function Board (width, height, container) {
	var oldSnakePosition = [];
	this.width = width;
	this.height = height;

	setup();
	// put the board elements in the DOM
	function setup() {
		var gameSpace = $(container);
		gameSpace.empty();
		var columns = '';

		for (var j = height; j >= 0; j--) {
			gameSpace.append('<div class="row" id="row' + j + '"></div>');
		}

		for (var i = width; i >= 0; i--) {
			columns = '<div class="column' + i + ' cell"></div>' + columns;
		}
		$('.row').append(columns);
	};

	this.drawFood = function (coord) {
		setCell(coord, 'food');
	};

	this.drawSnake = function (position) {
		if (oldSnakePosition.length > 0 && isCoord(oldSnakePosition[0]) ) {
			eraseSnake(oldSnakePosition);
		}

		_.forEach(position, drawBodyCell);

		oldSnakePosition = position.slice(0);

		function eraseSnake (position) {
			_.forEach(position, function (coord) {
				emptyCell(getCell(coord));
			});
		}

		function drawBodyCell (coord, index, position) {
			var endOptions = {
				'0,1': 'top',
				'1,0': 'right',
				'0,-1': 'bottom',
				'-1,0': 'left',
			},
			bodyOptions = {
				'0,1': {
					'0,1': 'vertical',
					'-1,0': 'bottomLeft',
					'1,0': 'bottomRight',
				},
				'1,0': {
					'1,0': 'horizontal',
					'0,1': 'topLeft',
					'0,-1': 'bottomLeft',
				},
				'0,-1': {
					'0,-1': 'vertical',
					'1,0': 'topRight',
					'-1,0': 'topLeft',
				},
				'-1,0': {
					'-1,0': 'horizontal',
					'0,1': 'topRight',
					'0,-1': 'bottomRight',
				},
			};

			if (index > 0 && index < position.length -1 ) { // is not the head or the tail
				var firstStepDifference = subtractVector(coord, position[index+1]);
				var secondStepDifference = subtractVector(position[index-1], coord);
				setCell(coord, bodyOptions[firstStepDifference][secondStepDifference]);
			} else if (index === 0) { // is the head
				var headTriangle = endOptions[subtractVector(position[1], _.first(position))];
				setCell(_.first(position), headTriangle);
			} else if (index === (position.length -1)) {
				var tailTriangle = endOptions[subtractVector(position[position.length - 2], _.last(position))];
				setCell(_.last(position), tailTriangle);
			}
		}
	};

	function setCell(coord, content) {
		var cell = getCell(coord);
		var setContents = {
			"empty": emptyCell,
			"horizontal": horizontalCell,
			"vertical": verticalCell,
			"topLeft": topLeftCell,
			"topRight": topRightCell,
			"bottomLeft": bottomLeftCell,
			"bottomRight": bottomRightCell,
			"bottom": bottomCell,
			"top": topCell,
			"right": rightCell,
			"left": leftCell,
			"head": headCell,
			"tail": tailCell,
			"food": foodCell,
		};
		setContents[content](cell);
	};

	function getCell(coord) {
		return $(selectCell(coord));
	}

	function selectCell (coord) {
		return '#row' + coord[1] + ' .column' + coord[0];
	}

	function emptyCell (cell) {
		cell.empty();
	}

	function horizontalCell (cell) {
		cell.empty().append(triangles(['top', 'bottom']));
	}

	function verticalCell (cell) {
		cell.append(triangles(['left', 'right']));
	}

	function topLeftCell (cell) {
		cell.empty().append(triangles(['left', 'top']));
	}

	function topRightCell (cell) {
		cell.empty().append(triangles(['top', 'right']));
	}

	function bottomLeftCell (cell) {
		cell.empty().append(triangles(['left', 'bottom']));
	}

	function bottomRightCell (cell) {
		cell.empty().append(triangles(['bottom', 'right']));
	}

	function bottomCell (cell) {
		cell.empty().append(triangles(['bottom-head']));
	}

	function topCell (cell) {
		cell.empty().append(triangles(['top-head']));
	}

	function rightCell (cell) {
		cell.empty().append(triangles(['right-head']));
	}

	function leftCell (cell) {
		cell.empty().append(triangles(['left-head']));
	}

	function triangles (positions) {
		var html = '';
		positions.forEach( function (position) {
			html = html + '<div class="cell-' + position + '"></div>';
		});
		return html;
	}

	function headCell (cell) {
		cell.empty().append(triangles(['bottom']));
	}

	function tailCell (cell) {
		cell.empty().append(triangles(['top']));
	}

	function foodCell (cell) {
		cell.empty().append(triangles(['bottom', 'top', 'left', 'right']));
	}

	function snakeHead () {
		var html = '<div>Head</div>';
		return html;
	}

	function snakeTail () {
		var html = '<div>Tail</div>';
		return html;
	}

	function snakeFood () {
		var html = '<div>Food</div>';
		return html;
	}
}

function PubSub() {
	var topics = {},
		hOP = topics.hasOwnProperty;
	return {
		topics: topics,
		register: function(entity, name, callback) {
			var topic = entity.toString() + name.toString();
			// create the topic if required
			if (!hOP.call(topics, topic)) topics[topic] = [];

			// Add the callback to the list
			var index = topics[topic].push(callback) - 1;

			// provide a hnadle to remove the topic
			return {
				remove: function() {
					delete topics[topic][index];
				}
			}
		},
		send: function(entity, name, info) {
			var topic = entity.toString() + name.toString();
			// If topic does not exist or there are no subscribers, just return
			if (!hOP.call(topics, topic)) return;
			// publish to each subscriber
			topics[topic].forEach(function(subscriber) {
				subscriber(info !== undefined ? info : {});
			});
		}
	};
};

