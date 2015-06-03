describe("Map", function(){
	var field, snake;
 	beforeEach(function() {

 		field = new Map(8,8, function() {return;};);
 		snake = new Snake(field, function() {return;};);
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
		var smallField = new Map(1,1);
		var oldFoodLocation;
		spyOn(snake, 'location').and.returnValue([ [0,1], [0,0], [1,0] ]);
		smallField.growFood(snake.location());
		oldFoodLocation = smallField.getFood();

		smallField.foundFood([[1,1], [0,1], [0,0]]);
		expect(oldFoodLocation === smallField.getFood()).toBe(false);
	});

	it('should grow food away from the snake', function(){
		var smallField = new Map(1,1);
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

});