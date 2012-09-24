/**
 * @module HUD
 * @namespace HUD
 */

var TW = TW || {};
TW.HUD = TW.HUD || {};

TW.HUD.HUD = function() {

	HUD.prototype = new TW.Graphic.Layer("undefined", 0, 0, 0, 0);

	/**
	 HUD is a class that allow you to define a HUD object who can organize HUDElements on it and then add it to a View object by the pushHUD method and then draw it by calling the method draw of the View object.
	 HUD inherits from Layer class.

	 @class HUD
	 @param {Integer} x the x coordinate of the HUD
	 @param {Integer} y the y coordinate of the HUD
	 @param {Integer} width the width of the HUD
	 @param {Integer} height the height of the HUD
	 @param {CanvasRenderingContext2D} context the canvas' context to draw the HUD on.
	 @constructor
	 */
	function HUD(context, x, y, width, height) {
		this.context = context;
		/**
		 The x coordinate of the HUD

		 @property {Integer} x
		 */
		this.x = x;
		/**
		 The y coordinate of the HUD

		 @property {Integer} y
		 */
		this.y = y;
		/**
		 The width of the HUD

		 @property {Integer} width
		 */
		this.width = width;
		/**
		 The height of the HUD

		 @property {Integer} height
		 */
		this.height = height;
		/**
		 The left margin of the HUD

		 @property {Integer} left
		 */
		this.left = null;
		/**
		 The right margin of the HUD

		 @property {Integer} right
		 */
		this.right = null;
		/**
		 The bottom margin of the HUD

		 @property {Integer} bottom
		 */
		this.bottom = null;
		/**
		 The top margin of the HUD

		 @property {Integer} top
		 */
		this.top = null;
		/**
		 The position mode of the HUD, this property can only take three values : "absolute","relative","center" if the property is setted with another value, then, "absolute" value will be the default value.

		 @property {string} position
		 */
		this.position = "absolute";
		this.hudList = [];
		this.hudElementList = [];
	}

	/**
	 This method allow you to draw the HUD on a canvas' context

	 @method draw
	 @param {CanvasRenderingContext2D} context the canvas' context to draw the HUD on.
	 */
	HUD.prototype.draw = function(context) {
		var i;
		var tmp_ctx = context || 1;
		var length;

		if (tmp_ctx == 1) {
			tmp_ctx = this.context;
		}

		length = this.hudElementList.length;
		i = 0;
		while (i < length) {
			tmp_ctx.save();
			if (this.hudElementList[i].position == "relative") {
				if (this.hudElementList[i].left !== null) {
					//On transforme avec la marges left
					tmp_ctx.transform(1, 0, 0, 1, this.hudElementList[i].left, 0);
				}
				if (this.hudElementList[i].right !== null) {
					//On transforme avec la marges right
					tmp_ctx.transform(1, 0, 0, 1,
					                  this.width - this.hudElementList[i].right - this.hudElementList[i].width, 0);
				}
				if (this.hudElementList[i].top !== null) {
					//On transforme avec la marges top
					tmp_ctx.transform(1, 0, 0, 1, 0, this.hudElementList[i].top);
				}
				if (this.hudElementList[i].bottom !== null) {
					//On transforme avec la marges bottom
					tmp_ctx.transform(1, 0, 0, 1, 0,
					                  this.height - this.hudElementList[i].bottom - this.hudElementList[i].height);
				}
				tmp_ctx.transform(this.hudElementList[i].scaleX, 0, 0, this.hudElementList[i].scaleY, 0, 0);
				tmp_ctx.transform(1, 0, 0, 1, this.hudElementList[i].x_centerPoint,
				                  this.hudElementList[i].y_centerPoint);
				tmp_ctx.transform(Math.cos(this.hudElementList[i].rotation), -Math.sin(this.hudElementList[i].rotation),
				                  Math.sin(this.hudElementList[i].rotation), Math.cos(this.hudElementList[i].rotation),
				                  0, 0);
				tmp_ctx.transform(1, 0, 0, 1, -this.hudElementList[i].x_centerPoint,
				                  -this.hudElementList[i].y_centerPoint);
				this.hudElementList[i].draw(tmp_ctx);
			} else if (this.hudElementList[i].position == "center") {
				var tmp_x = (this.width / 2) - (this.hudElementList[i].width / 2);
				var tmp_y = (this.height / 2) - (this.hudElementList[i].height / 2);

				tmp_ctx.transform(1, 0, 0, 1, tmp_x, tmp_y);
				tmp_ctx.transform(this.hudElementList[i].scaleX, 0, 0, this.hudElementList[i].scaleY, 0, 0);
				tmp_ctx.transform(1, 0, 0, 1, this.hudElementList[i].x_centerPoint,
				                  this.hudElementList[i].y_centerPoint);
				tmp_ctx.transform(Math.cos(this.hudElementList[i].rotation), -Math.sin(this.hudElementList[i].rotation),
				                  Math.sin(this.hudElementList[i].rotation), Math.cos(this.hudElementList[i].rotation),
				                  0, 0);
				tmp_ctx.transform(1, 0, 0, 1, -this.hudElementList[i].x_centerPoint,
				                  -this.hudElementList[i].y_centerPoint);
				this.hudElementList[i].draw(tmp_ctx);
			} else {
				tmp_ctx.transform(1, 0, 0, 1, this.hudElementList[i].x, this.hudElementList[i].y);
				tmp_ctx.transform(this.hudElementList[i].scaleX, 0, 0, this.hudElementList[i].scaleY, 0, 0);
				tmp_ctx.transform(1, 0, 0, 1, this.hudElementList[i].x_centerPoint,
				                  this.hudElementList[i].y_centerPoint);
				tmp_ctx.transform(Math.cos(this.hudElementList[i].rotation), -Math.sin(this.hudElementList[i].rotation),
				                  Math.sin(this.hudElementList[i].rotation), Math.cos(this.hudElementList[i].rotation),
				                  0, 0);
				tmp_ctx.transform(1, 0, 0, 1, -this.hudElementList[i].x_centerPoint,
				                  -this.hudElementList[i].y_centerPoint);
				this.hudElementList[i].draw(tmp_ctx);
			}
			tmp_ctx.restore();
			i++;
		}
		i = 0;
		length = this.hudList.length;
		while (i < length) {
			tmp_ctx.save();
			if (this.hudList[i].position == "relative") {
				if (this.hudList[i].left !== null) {
					//On transforme avec la marges left
					tmp_ctx.transform(1, 0, 0, 1, this.hudList[i].left, 0);
				}
				if (this.hudList[i].right !== null) {
					//On transforme avec la marges right
					tmp_ctx.transform(1, 0, 0, 1, this.width - this.hudList[i].right - this.hudList[i].width, 0);
				}
				if (this.hudList[i].top !== null) {
					//On transforme avec la marges top
					tmp_ctx.transform(1, 0, 0, 1, 0, this.hudList[i].top);
				}
				if (this.hudList[i].bottom !== null) {
					//On transforme avec la marges bottom
					tmp_ctx.transform(1, 0, 0, 1, 0, this.heigth - this.hudList[i].bottom - this.hudList[i].heigth);
				}
				tmp_ctx.transform(this.hudList[i].x_scale, 0, 0, this.hudList[i].y_scale, 0, 0);
				tmp_ctx.transform(1, 0, 0, 1, this.hudList[i].x_center, this.hudList[i].y_center);
				tmp_ctx.transform(Math.cos(this.hudList[i].rotation), -Math.sin(this.hudList[i].rotation),
				                  Math.sin(this.hudList[i].rotation), Math.cos(this.hudList[i].rotation), 0, 0);
				tmp_ctx.transform(1, 0, 0, 1, -this.hudList[i].x_center, -this.hudList[i].y_center);
				this.hudList[i].draw(ctx_tmp);
			}
			else if (this.hudList[i].position == "center") {
				var tmp_x = (this.width / 2) - (this.hudList[i].width / 2);
				var tmp_y = (this.height / 2) - (this.hudList[i].height / 2);

				tmp_ctx.transform(1, 0, 0, 1, tmp_x, tmp_y);
				tmp_ctx.transform(this.hudList[i].scaleX, 0, 0, this.hudList[i].scaleY, 0, 0);
				tmp_ctx.transform(1, 0, 0, 1, this.hudList[i].x_centerPoint, this.hudList[i].y_centerPoint);
				tmp_ctx.transform(Math.cos(this.hudList[i].rotation), -Math.sin(this.hudList[i].rotation),
				                  Math.sin(this.hudList[i].rotation), Math.cos(this.hudList[i].rotation), 0, 0);
				tmp_ctx.transform(1, 0, 0, 1, -this.hudList[i].x_centerPoint, -this.hudList[i].y_centerPoint);
				this.hudList[i].draw(tmp_ctx);
			} else {
				tmp_ctx.transform(1, 0, 0, 1, this.hudList[i].x, this.hudList[i].y);
				tmp_ctx.transform(this.hudList[i].x_scale, 0, 0, this.hudList[i].y_scale, 0, 0);
				tmp_ctx.transform(1, 0, 0, 1, this.hudList[i].x_center, this.hudList[i].y_center);
				tmp_ctx.transform(Math.cos(this.hudList[i].rotation), -Math.sin(this.hudList[i].rotation),
				                  Math.sin(this.hudList[i].rotation), Math.cos(this.hudList[i].rotation), 0, 0);
				tmp_ctx.transform(1, 0, 0, 1, -this.hudList[i].x_center, -this.hudList[i].y_center);
				this.hudList[i].draw(tmp_ctx);
			}
			tmp_ctx.restore();
			i++;
		}
	};

	/**
	 This method allow you to push an HUD object into the current HUD object

	 @method pushHUD
	 @param {HUD} HUDObject The HUD object to push in the current HUD object
	 @return {Boolean} return true if the pushHUD method has success, otherwise it returns false
	 */
	HUD.prototype.pushHUD = function(HUDObject) {
		if (!HUDObject) {
			return false;
		}
		this.hudList.push(HUDObject);
		return true;
	};


	/**
	 This method allow you to pop a HUD object from the current object

	 @method popHUD
	 @param {HUD} HUDObject The HUD object to pop from the current HUD object.
	 @return {Boolean} return true if the popHUD method has success, otherwise it returns false
	 */
	HUD.prototype.popHUD = function(HUDObject) {
		if (!HUDObject) {
			return false;
		}
		for (var i = 0; i < this.hudList.length; i++) {
			if (this.hudList[i] === HUDObject) {
				this.hudList.split(i, 1);
				return true;
			}
		}
		return false;
	};

	/**
	 This method allow you to push a HUD element on the current object

	 @method pushHUDElement
	 @param {HUDElement} HUDElementObject The HUDElement to pop from the current HUD element.
	 @return {Boolean} return true if the pushHUDElement has success, otherwise it returns false
	 */
	HUD.prototype.pushHUDElement = function(HUDElementObject) {
		if (!HUDElementObject) {
			return false;
		}
		this.hudElementList.push(HUDElementObject);
		return true;
	};

	/**
	 This method allow you to pop a HUDElement from the current object

	 @method popHUDElement
	 @param {HUDElement} HUDElementObject The HUDElementObject to pop from the current HUD object.
	 @return {Boolean} return true if the popHUDElement has success, otherwise it returns false
	 */
	HUD.prototype.popHUDElement = function(HUDElementObject) {
		if (!HUDElementObject) {
			return false;
		}
		for (var i = 0; i < this.hudElementList.length; i++) {
			if (this.hudElementList[i] === HUDElementObject) {
				this.hudElementList.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	HUD.prototype.constructor = HUD;
	return HUD;
}();