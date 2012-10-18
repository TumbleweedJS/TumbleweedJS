var TW = TW || {};
TW.Parallax = TW.Parallax || {};

TW.Parallax.Direction = {
	UP   : 0,
	DOWN : 1,
	LEFT : 2,
	RIGHT: 3
};


TW.Parallax.Parallax = function() {
	function Parallax(context) {
		this.view = new TW.Graphic.View(context, 0, 0, 1200, 500);
		this.speed = 15;
		this.direction = TW.Parallax.Direction.RIGHT;
		this.is_scrolling = true;
		this.positionX = 0;
		this.positionY = 0;
	}

	Parallax.prototype.getView = function() {
		return this.view;
	};

	Parallax.prototype.setView = function(view) {
		this.view = view;
	};

	Parallax.prototype.getSpeed = function() {
		return this.speed;
	};

	Parallax.prototype.setSpeed = function(speed) {
		this.speed = speed;
		if (this.speed < 0) {
			this.speed = 0;
		}
	};

	Parallax.prototype.getDirection = function() {
		return this.direction;
	};

	Parallax.prototype.setDirection = function(direction) {
		this.direction = direction;
		this.initializeSprite();
	};

	Parallax.prototype.getIsScrolling = function() {
		return this.is_scrolling;
	};

	Parallax.prototype.setIsScrolling = function(status) {
		this.is_scrolling = status;
	};

	Parallax.prototype.setPosition = function(posX, posY) {
		this.positionX = posX;
		this.positionY = posY;
	};

	Parallax.prototype.getPosition = function() {
		return { x: this.positionX, y: this.positionY };
	};


	Parallax.prototype.initializeSprite = function() {
		if (this.view.listSprite.length == 1) {
			this.view.listSprite[0].setY(this.positionY);
			this.view.listSprite[0].setX(this.positionX);
			return;
		}
		for (var it = 0; it < this.view.listSprite.length; it++) {
			var sprite = this.view.listSprite[it];

			if (this.direction == TW.Parallax.Direction.RIGHT || this.direction == TW.Parallax.Direction.LEFT) {
				sprite.setY(this.positionY);
			}
			if (this.direction == TW.Parallax.Direction.UP || this.direction == TW.Parallax.Direction.DOWN) {
				sprite.setX(this.positionX);
			}
			if (it > 0) {
				if (this.direction == TW.Parallax.Direction.RIGHT) {
					sprite.setX(this.view.listSprite[it - 1].getX() + this.view.listSprite[it - 1].getWidth());
				}
				if (this.direction == TW.Parallax.Direction.LEFT) {
					sprite.setX(this.view.listSprite[it - 1].getX() - this.view.listSprite[it - 1].getWidth());
				}
				if (this.direction == TW.Parallax.Direction.UP) {
					sprite.setY(this.view.listSprite[it - 1].getY() + this.view.listSprite[it - 1].getHeight());
				}
				if (this.direction == TW.Parallax.Direction.DOWN) {
					sprite.setY(this.view.listSprite[it - 1].getY() - this.view.listSprite[it - 1].getHeight());
				}
			}
		}
	};

	Parallax.prototype.add = function(sprite) {
		sprite.setX(this.positionX);
		sprite.setY(this.positionY);

		if (this.view.listSprite.length > 0 && this.direction == TW.Parallax.Direction.RIGHT) {
			sprite.setX(this.view.listSprite[this.view.listSprite.length - 1].getX() +
			            this.view.listSprite[this.view.listSprite.length - 1].getWidth());
		}
		if (this.view.listSprite.length > 0 && this.direction == TW.Parallax.Direction.LEFT) {
			sprite.setX(this.view.listSprite[this.view.listSprite.length - 1].getX() -
			            this.view.listSprite[this.view.listSprite.length - 1].getWidth());
		}
		if (this.view.listSprite.length > 0 && this.direction == TW.Parallax.Direction.UP) {
			sprite.setY(this.view.listSprite[this.view.listSprite.length - 1].getY() +
			            this.view.listSprite[this.view.listSprite.length - 1].getHeight());
		}
		if (this.view.listSprite.length > 0 && this.direction == TW.Parallax.Direction.DOWN) {
			sprite.setY(this.view.listSprite[this.view.listSprite.length - 1].getY() -
			            this.view.listSprite[this.view.listSprite.length - 1].getHeight());
		}
		this.view.pushSprite(sprite);
	};

	Parallax.prototype.update = function() {
		if (this.view.listSprite.length == 0) {
			return;
		}
		if (this.is_scrolling == false) {
			return;
		}
		//Move the first
		switch (this.direction) {
			case TW.Parallax.Direction.LEFT:
				this.view.listSprite[0].setX(this.view.listSprite[0].getX() - this.speed);
				this.view.listSprite[0].setY(this.positionY);
				break;
			case TW.Parallax.Direction.RIGHT:
				this.view.listSprite[0].setX(this.view.listSprite[0].getX() + this.speed);
				this.view.listSprite[0].setY(this.positionY);
				break;
			case TW.Parallax.Direction.DOWN:
				this.view.listSprite[0].setY(this.view.listSprite[0].getY() + this.speed);
				this.view.listSprite[0].setX(this.positionX);
				break;
			case W.Parallax.Direction.UP:
				this.view.listSprite[0].setY(this.view.listSprite[0].getY() - this.speed);
				this.view.listSprite[0].setX(this.positionX);
				break;
			default:
		}
		//Move others sprites
		if (this.view.listSprite.length > 1) {
			for (var it = 1; it < this.view.listSprite.length; it++) {
				switch (this.direction) {
					case TW.Parallax.Direction.LEFT:
						this.view.listSprite[it].setX(this.view.listSprite[it - 1].getWidth() +
						                              this.view.listSprite[it - 1].getX());
						this.view.listSprite[it].setY(this.positionY);
						break;
					case TW.Parallax.Direction.RIGHT:
						this.view.listSprite[it].setX(this.view.listSprite[it - 1].getX() -
						                              this.view.listSprite[it - 1].getWidth());
						this.view.listSprite[it].setY(this.positionY);
						break;
					case TW.Parallax.Direction.DOWN:
						this.view.listSprite[it].setY(this.view.listSprite[it - 1].getY() -
						                              this.view.listSprite[it - 1].getHeight());
						this.view.listSprite[it].setX(this.positionX);
						break;
					case TW.Parallax.Direction.UP:
						this.view.listSprite[it].setY(this.view.listSprite[it - 1].getY() +
						                              this.view.listSprite[it - 1].getHeight());
						this.view.listSprite[it].setX(this.positionX);
						break;
					default:
				}
			}
		}
		if ((this.direction == TW.Parallax.Direction.LEFT && -(this.view.listSprite[0].getX()) >= this.view.width) ||
		    (this.direction == TW.Parallax.Direction.RIGHT && this.view.listSprite[0].getX() >= this.view.width) ||
		    (this.direction == TW.Parallax.Direction.DOWN && this.view.listSprite[0].getY() >= this.view.height) ||
		    (this.direction == TW.Parallax.Direction.UP && -this.view.listSprite[0].getY() >= this.view.height)) {
			if (this.view.listSprite.length > 1) {
				var temp = this.view.listSprite[0];
				this.view.listSprite.splice(0, 1);
				this.view.pushSprite(temp);
			} else {
				this.initializeSprite();
			}
		}
	};

	Parallax.prototype.draw = function(context) {
		this.view.draw(context);
	};
	return Parallax;
}();
