xdescribe("Game", function(){
	var game;
	beforeEach(function() {
		game = new Game();
	});

	it("should have a field and a snake", function(){
		expect(_.isObject(game.snake)).toBe(true);
		expect(_.isObject(game.field)).toBe(true);
	});


	it("should run a countdown before initiating play", function(){
		game.start();
		// use intern to check if a #countdown div is active
	});

	describe("starting a game", function() {
		beforeEach(function(done) {
			game.start();

			setTimeout(function() {
		    		done();
		    	}, 3000);
		});

		// use intern to test if field, snake and countdown are displayed

		it("should run the game after the countdown", function(){});
	});

	it("should end a game when snake is dead", function(){});

	it("should show an outro screen when game ends", function() {});

	it("should restart when requested", function(){});

	it("should quit when requested", function(){});

});
