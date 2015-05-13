"use strict";

function Game (width, height) {
	if (isNaN(width)) { width = 8; }
	if (isNaN(height)) { height = 8; }
	this.field = new Map(width, height);
	this.player = new Player();
	this.snake = new Snake(this.field);


	// a painter object to control the DOM
	var board = new Board(width, height);

	// Use Pub/Sub to connect field and snake to painter and, the game functions
	// a pub/sub version:
	// http://davidwalsh.name/pubsub-javascript
	var messenger = new PubSub();

	this.snake.broadcast = messenger.send;
	this.field.broadcast = messenger.send;
	this.player.broadcast = messenger.send;
	messenger.register('snake', 'position', board.drawSnake);
	messenger.register('map', 'food', board.drawFood);
	// when snake is dead:
	// - clear the board,
	//  - show the score,
	//  - show the end of game menu
	// messenger.register('snake', 'dead', board.clearBoard);
	// messenger.register('snake', 'dead', showScores);
	// messenger.register('snake', 'dead', showEndGameMenu);

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
			columns = columns + '<div class="column' + i + ' cell"></div>';
		}
		$('.row').append(columns);
	};

	this.drawFood = function (coord) {
		this.setCell(coord, 'food');
	};

	this.drawSnake = function (position) {
		_.each(snakePosition, empty(coord));

		if (head !== _.first(position)) {
			this.setCell(position[0], 'head');
			head = _.first(position);
		}

		if (tail !== _.last(position)) {
			this.setCell(position[0], 'tail');
			tail = _.last(position);
		}

		_.each(position, drawBodyCell(coord, index, position));

		snakePosition = position;

		function drawBodyCell (coord, index, position) {
			if (index === 0 || index === position.length -1) return;

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

				setCell(coord, options[signature]);
		}
	}

	this.setCell = function(coord, content) {
		var cell = getCell(coord);
		cell.empty();
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
		setContents[content](cell);
	};

	this.getCell = function(coord) {
		var selector = '#row' + coord[1] + ' .column' + coord[0];
		return $(selector);
	}

	function empty (coord) {
		getCell(coord).empty();
	}

	function horizontal (cell) {
		cell.append(triangles(['top', 'bottom']));
	}

	function vertical (cell) {
		cell.append(triangles(['left', 'right']));
	}

	function topLeft (cell) {
		cell.append(triangles(['left', 'top']));
	}

	function topRight (cell) {
		cell.append(triangles(['top', 'right']));
	}

	function bottomLeft (cell) {
		cell.append(triangles(['left', 'bottom']));
	}

	function bottomRight (cell) {
		cell.append(triangles(['bottom', 'right']));
	}

	function triangles (positions) {
		var html = '';
		positions.forEach( function (position) {
			html = html + '<div class="cell-' + position + '"></div>';
		});
		return html;
	}

	function head (cell) {
		cell.append(snakeHead());
	}

	function tail (cell) {
		cell.append(snakeTail());
	}

	function food (cell) {
		cell.append(snakeFood());
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

