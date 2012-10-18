var TW = TW || {};
TW.Parallax = TW.Parallax || {};

TW.Parallax.ParallaxManager = function() {
	function ParallaxManager() {
		this.collection = [];
		this.speed = 15;
		this.direction = TW.Parallax.Direction.RIGHT;
		this.is_scrolling = true;
		this.positionX = 0;
		this.positionY = 0;
	}

	ParallaxManager.prototype.setSpeed = function(speed) {
		var it;

		this.speed = speed;
		for (it = 0; it < this.collection.length; it++) {
			this.collection[it].setSpeed(this.speed);
		}
	};

	ParallaxManager.prototype.getSpeed = function() {
		return this.speed;
	};

	ParallaxManager.prototype.setDirection = function(direction) {
		var it;

		this.direction = direction;
		for (it = 0; it < this.collection.length; it++) {
			this.collection[it].setDirection(this.direction);
		}
	};

	ParallaxManager.prototype.getDirection = function() {
		return this.direction;
	};

	ParallaxManager.prototype.setIsScrolling = function(status) {
		var it;

		this.is_scrolling = status;
		for (it = 0; it < this.collection.length; it++) {
			this.collection[it].setIsScrolling(this.is_scrolling);
		}
	};

	ParallaxManager.prototype.getIsScrolling = function() {
		return this.is_scrolling;
	};

	ParallaxManager.prototype.setPosition = function(posX, posY) {
		var it;

		this.positionX = posX;
		this.positionY = posY;

		for (it = 0; it < this.collection.length; it++) {
			this.collection[it].setPosition(this.positionX, this.positionY);
		}
	};

	ParallaxManager.prototype.getPosition = function() {
		var temp = [];
		temp.x = this.positionX;
		temp.y = this.positionY;
		return temp;
	};

	ParallaxManager.prototype.push = function(parallax) {
		this.collection.push(parallax);
	};

	ParallaxManager.prototype.pop = function() {
		this.collection.pop();
	};

	ParallaxManager.prototype.update = function() {
		//DEBUG
		if (TW.Event.KeyboardService.isKeyPressed(TW.Event.Key.Space)) {
			this.setIsScrolling(!this.getIsScrolling());
		}
		if (TW.Event.KeyboardService.isKeyDown(TW.Event.Key.PageUp)) {
			this.setSpeed(this.getSpeed() + 3);
		}
		if (TW.Event.KeyboardService.isKeyDown(TW.Event.Key.PageDown)) {
			this.setSpeed(this.getSpeed() - 3);
		}
		if (TW.Event.KeyboardService.isKeyPressed(TW.Event.Key.UpArrow)) {
			this.setDirection(TW.Parallax.Direction.UP);
		}
		if (TW.Event.KeyboardService.isKeyPressed(TW.Event.Key.DownArrow)) {
			this.setDirection(TW.Parallax.Direction.DOWN);
		}
		if (TW.Event.KeyboardService.isKeyPressed(TW.Event.Key.LeftArrow)) {
			this.setDirection(TW.Parallax.Direction.LEFT);
		}
		if (TW.Event.KeyboardService.isKeyPressed(TW.Event.Key.RightArrow)) {
			this.setDirection(TW.Parallax.Direction.RIGHT);
		}
		for (var it = 0; it < this.collection.length; it++) {
			this.collection[it].update();
		}
	};

	ParallaxManager.prototype.draw = function(context) {
		for (var it = 0; it < this.collection.length; it++) {
			this.collection[it].draw();
		}
	};
	return ParallaxManager;
}();