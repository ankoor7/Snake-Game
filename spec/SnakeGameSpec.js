describe("Field", function(){
	var field, snake;
 	beforeEach(function() {
 		field = new Field(8,8);
 		snake = new Snake(field);
 	});


	it('should be the correct width', function(){
		expect(field.getWidth()).toEqual(8);
	});

	it('should be the correct length', function(){
		expect(field.getHeight()).toEqual(8);
	});


	it('should grow food', function(){
		field.growFood(snake.location());
		expect((typeof field.getFood()[0] === 'number' && typeof field.getFood()[1]) === 'number').toBe(true);
		expect((field.getFood()[0] >= 0 && field.getFood()[0] <= field.getWidth())).toBe(true);
		expect((field.getFood()[1] >= 0 && field.getFood()[1] <= field.getHeight())).toBe(true);
	});

	it("should say if food is eaten", function() {
		field.setFood([1,1]);
		expect(field.foundFood([ [1,1] ])).toBe(true);
		field.setFood([1,0]);
		expect(field.foundFood([ [1,1] ])).toBe(false);
	});

	it("should replace food when some is eaten", function() {
		var smallField = new Field(1,1);
		var oldFoodLocation;
		spyOn(snake, 'location').and.returnValue([ [0,1], [0,0], [1,0] ]);
		smallField.growFood(snake.location());
		oldFoodLocation = smallField.getFood();

		smallField.foundFood([[1,1], [0,1], [0,0]]);
		expect(oldFoodLocation === smallField.getFood()).toBe(false);
	});

	it('should grow food away from the snake', function(){
		var smallField = new Field(1,1);
		spyOn(snake, 'location').and.returnValue([[0,0], [0,1], [1,0]]);
		smallField.growFood(snake.location());
		expect(smallField.getFood()).toEqual([1,1]);

		smallField.growFood(snake.location());
		expect(smallField.getFood()).toEqual([1,1]);

		smallField.growFood(snake.location());
		expect(smallField.getFood()).toEqual([1,1]);
	});

	it("should say if a position is in the field", function(){
		expect(field.contains([4, 0])).toBeTruthy();
		expect(field.contains([0, 4])).toBeTruthy();
	})

	it("should say if a position is NOT in the field", function(){
		expect(field.contains([9, 0])).toBeFalsy();
		expect(field.contains([0, 9])).toBeFalsy();
	})

// should grow food when current food is eaten
// should grow food away from the snake
// should say if the food has been found
// should say if a position is in the field
// should say if a position is NOT in the field

});


describe("Snake", function() {
 	var field, snake;

 	beforeEach(function() {
 		field = new Field(8,8);
 		snake = new Snake(field);
 	});

 	it("should be alive when instantiated", function() {
 		expect(snake.getStatus()).toEqual('alive');
 	});

 	it("should be at a specific position", function() {
 		expect(snake.location()).toEqual([[ 4, 6 ], [ 4, 5 ], [ 4, 4 ], [ 4, 3 ], [ 4, 2 ]]);
 	});

 	it("should grow when eats food", function() {
 		spyOn(field, "foundFood").and.returnValue(true);
 		snake.eat();
 		expect(snake.location().length).toEqual(6);
 	});

 	it("should not grow when it does not find food", function() {
 		spyOn(field, "foundFood").and.returnValue(false);
 		snake.eat();
 		expect(snake.location().length).toEqual(5);
 	});

 	it('should move up', function() {
 		snake.move('up');
 		expect(snake.location()).toEqual( [ [ 4 ,7  ], [ 4, 6 ], [ 4, 5 ], [ 4, 4 ], [ 4, 3 ] ] );
 	});

 	it('should move right', function() {
 		snake.move('right');
 		expect(snake.location()).toEqual([[ 5,6 ], [ 4, 6 ], [ 4, 5 ], [ 4, 4 ], [ 4, 3 ]]);
 	});

 	it('should move left', function() {
 		snake.move('left');
 		expect(snake.location()).toEqual([[ 3,6 ], [ 4, 6 ], [ 4, 5 ], [ 4, 4 ], [ 4, 3 ]]);
 	});

 	it('should move down', function() {
 		snake.move('left');
 		snake.move('down');
 		expect(snake.location()).toEqual([[ 3, 5 ], [ 3,6 ], [ 4, 6 ], [ 4, 5 ], [ 4, 4 ]]);
 	});

 	it('should die when moves onto itself', function() {
 		snake.move('down');
 		expect(snake.getStatus()).toEqual('dead');
 	});

});

// describe("Player", function() {
//   var player;
//   var song;

//   beforeEach(function() {
// 	player = new Player();
// 	song = new Song();
//   });

//   it("should be able to play a Song", function() {
// 	player.play(song);
// 	expect(player.currentlyPlayingSong).toEqual(song);

// 	//demonstrates use of custom matcher
// 	expect(player).toBePlaying(song);
//   });

//   describe("when song has been paused", function() {
// 	beforeEach(function() {
// 	  player.play(song);
// 	  player.pause();
// 	});

// 	it("should indicate that the song is currently paused", function() {
// 	  expect(player.isPlaying).toBeFalsy();

// 	  // demonstrates use of 'not' with a custom matcher
// 	  expect(player).not.toBePlaying(song);
// 	});

// 	it("should be possible to resume", function() {
// 	  player.resume();
// 	  expect(player.isPlaying).toBeTruthy();
// 	  expect(player.currentlyPlayingSong).toEqual(song);
// 	});
//   });

//   // demonstrates use of spies to intercept and test method calls
//   it("tells the current song if the user has made it a favorite", function() {
// 	spyOn(song, 'persistFavoriteStatus');

// 	player.play(song);
// 	player.makeFavorite();

// 	expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
//   });

//   //demonstrates use of expected exceptions
//   describe("#resume", function() {
// 	it("should throw an exception if song is already playing", function() {
// 	  player.play(song);

// 	  expect(function() {
// 		player.resume();
// 	  }).toThrowError("song is already playing");
// 	});
//   });
// });
