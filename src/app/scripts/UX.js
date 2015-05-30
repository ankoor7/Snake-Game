"use strict";

function Game (container) {
	var messenger,
		cellsWide,
		cellsHigh;

	this.board = build();
	this.board.setup(container);
	this.field = new Map(cellsWide, cellsHigh);
	this.player = new Player();
	this.snake = new Snake(this.field);


	// Use Pub/Sub to connect field and snake to painter and, the game functions
	// a pub/sub version:
	// http://davidwalsh.name/pubsub-javascript
	messenger = new PubSub();

	this.snake.broadcast = messenger.send;
	this.field.broadcast = messenger.send;
	this.player.broadcast = messenger.send;
	messenger.register('snake', 'position', this.board.drawSnake);
	messenger.register('map', 'food', this.board.drawFood);

	// Snake needs to drawn onto the board at the start
	// Should this be done automatically in snake or from board?

	this.board.drawSnake(this.snake.location());
	for (var i = 12; i >= 0; i--) {
		this.board.drawFood([i,i]);
	};
	this.snake.move('left');
	this.snake.move('left');
	this.snake.move('left');
	//
	// SNAKE.MOVE DOES NOT TRIGGER BOARD.DRAWSNAKE
	//
	this.board.drawSnake(this.snake.location());

	// when snake is dead:
	// - clear the board,
	//  - show the score,
	//  - show the end of game menu
	// messenger.register('snake', 'dead', board.clearBoard);
	// messenger.register('snake', 'dead', showScores);
	// messenger.register('snake', 'dead', showEndGameMenu);

	function build () {
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
					cellSize: 20,
				},
				{
					name: 'small',
					width: 900,
					cellSize: 10,
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

			cellsWide = Math.floor($(container).width() / thisScreenSize.cellSize);
			cellsHigh = Math.floor($(container).height() / thisScreenSize.cellSize);
			// a painter object to control the DOM
			board = new Board(cellsWide, cellsHigh);
			return board;
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

function Board (width, height) {
	var head, tail, snakePosition;

	// put the board elements in the DOM
	this.setup = function(container) {
		var gameSpace = $(container);
		gameSpace.empty();
		var columns = '';

		for (var j = height; j > 0; j--) {
			gameSpace.append('<div class="row" id="row' + j + '"></div>');
		}

		for (var i = width; i > 0; i--) {
			columns = '<div class="column' + i + ' cell"></div>' + columns;
		}
		$('.row').append(columns);
	};

	this.drawFood = function (coord) {
		setCell(coord, 'food');
	};

	this.drawSnake = function (position) {
		_.each(snakePosition, erase);
		console.log(position[0][1]);
		_.each(position, drawBodyCell);
		snakePosition = position.slice(0);

		function erase (coord, index, position) {
			var cell = getCell(coord);
			empty(cell);
		}

		function drawBodyCell (coord, index, position) {
			if (index > 0 && index < position.length -1 ) {
			var threeStepDifference = subtractVector(position[index-1], position[index+1]),
				oneStepDifference = subtractVector(position[index-1], coord),
				signature = addVector(oneStepDifference, threeStepDifference),
				options = {
					'-2,1': 'bottomLeft',
					'2,1': 'bottomRight',
					'-2,-1': 'topLeft',
					'2,-1': 'topRight',
					'1,2': 'topLeft',
					'-1,2': 'bottomLeft',
					'1,-2': 'topRight',
					'-1,-2': 'bottomRight',
				};

				setCell(coord, 'topRight');
			} else if (index === 0) {
				console.log('head');
				setCell(_.first(position), 'head');
				head = _.first(position);
			} else if (index === position.length - 1) {
				console.log('tail');
				setCell(_.last(position), 'tail');
				tail = _.last(position);
			}
		}
	};

	function setCell(coord, content) {
		var cell = getCell(coord);
		var setContents = {
			'empty': empty,
			'horizontal': horizontal,
			'vertical': vertical,
			'topLeft': topLeft,
			'topRight': topRight,
			'bottomLeft': bottomLeft,
			'bottomRight': bottomRight,
			'head': head,
			'tail': tail,
			'food': food,
		};
		try {
			setContents[content](cell);
		} catch (e) {
			// console.log(e);
		} finally {
			setContents.vertical(cell);
		}
	};

	function getCell(coord) {
		var selector = '#row' + coord[1] + ' .column' + coord[0];
		return $(selector);
	}

	function selectCell (coord) {
		return '#row' + coord[1] + ' .column' + coord[0];
	}

	function empty (cell) {
		cell.empty();
	}

	function horizontal (cell) {
		cell.empty().append(triangles(['top', 'bottom']));
	}

	function vertical (cell) {
		cell.empty().append(triangles(['left', 'right']));
	}

	function topLeft (cell) {
		cell.empty().append(triangles(['left', 'top']));
	}

	function topRight (cell) {
		cell.empty().append(triangles(['top', 'right']));
	}

	function bottomLeft (cell) {
		cell.empty().append(triangles(['left', 'bottom']));
	}

	function bottomRight (cell) {
		cell.empty().append(triangles(['bottom', 'right']));
	}

	function triangles (positions) {
		var html = '';
		positions.forEach( function (position) {
			html = html + '<div class="cell-' + position + '"></div>';
		});
		return html;
	}

	function head (cell) {
		// cell.append(snakeHead());
		cell.empty().append(triangles(['bottom']));
	}

	function tail (cell) {
		// cell.append(snakeTail());
		cell.empty().append(triangles(['top']));
	}

	function food (cell) {
		// cell.append(snakeFood());
		vertical(cell);
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

