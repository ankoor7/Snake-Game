describe("Snake", function() {
 	var field, snake;

 	beforeEach(function() {
 		field = new Map(8,8, function() {return;});
 		snake = new Snake(field, function() {return;});
 	});

 	it("should be alive when instantiated", function() {
 		expect(snake.getStatus()).toEqual('alive');
 	});

 	it("should be at a specific position", function() {
 		expect(snake.location()).toEqual([[ 4, 6 ], [ 4, 5 ], [ 4, 4 ], [ 4, 3 ], [ 4, 2 ]]);
 	});

 	it("should grow when eats food", function() {
 		spyOn(field, "foundFood").and.returnValue(true);
            snake.move('up');
 		expect(snake.location().length).toEqual(6);
 	});

      describe("movement", function() {
            beforeEach(function() {
              spyOn(field, "foundFood").and.returnValue(false);
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

});