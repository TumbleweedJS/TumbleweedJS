/**
 * @module HUD
 * @namespace HUDHorizontal
 */


var TW = TW || {};
TW.HUD = TW.HUD || {};

TW.HUD.HUDHorizontal = function() {

	HUDHorizontal.prototype = new TW.Graphic.Layer("undefined", 0, 0, 0, 0);

	/**
	 * HUDHorizontal is a class that allow you to define a HUD object who can organize HUDElements horizontaly on it.
	 * Note that the HUDHorizontal object automatically organize objects with margin beetween them.
	 * HUDHorizontal inherits from Layer class.
	 *
	 * @class HUDHorizontal
	 * @param context
	 * @param x
	 * @param y
	 * @param width
	 * @param height
	 * @constructor
	 */
	function HUDHorizontal(context, x, y, width, height) {
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
	 This method allow you to draw the HUDHorizontal on a canvas' context

	 @method draw
	 @param {CanvasRenderingContext2D} context the canvas' context to draw the HUD on.
	 */
	HUDHorizontal.prototype.draw = function(context) {
		var i;
		var tmp_ctx = context || 1;

		if (tmp_ctx == 1) {
			tmp_ctx = this.context;
		}

		i = 0;
		var length_total = this.hudElementList.length + this.hudList.length;
		var nb_hudelements = this.hudElementList.length;
		var nb_huds = this.hudList.length;
		var total_width = 0;
		while (i < nb_hudelements) {
			total_width += this.hudElementList[i].width * this.hudElementList[i].scaleX;
			i++;
		}
		i = 0;
		while (i < nb_huds) {
			total_width += this.hudList[i].width * this.hudElementList[i].x_scale;
			i++;
		}
		var margin = (this.width - total_width) / (length_total + 1);
		i = 0;
		tmp_ctx.save();
		while (i < this.hudElementList.length) {
			tmp_ctx.transform(1, 0, 0, 1, margin, 0);
			tmp_ctx.save();
			tmp_ctx.transform(1, 0, 0, 1, 0,
			                  (this.height - (this.hudElementList[i].height * this.hudElementList[i].scaleY)) / 2);
			tmp_ctx.transform(this.hudElementList[i].scaleX, 0, 0, this.hudElementList[i].scaleY, 0, 0);
			tmp_ctx.transform(1, 0, 0, 1, this.hudElementList[i].x_centerPoint, this.hudElementList[i].y_centerPoint);
			tmp_ctx.transform(Math.cos(this.hudElementList[i].rotation), -Math.sin(this.hudElementList[i].rotation),
			                  Math.sin(this.hudElementList[i].rotation), Math.cos(this.hudElementList[i].rotation), 0,
			                  0);
			tmp_ctx.transform(1, 0, 0, 1, -this.hudElementList[i].x_centerPoint, -this.hudElementList[i].y_centerPoint);
			this.hudElementList[i].draw(tmp_ctx);
			tmp_ctx.restore();
			tmp_ctx.transform(1, 0, 0, 1, this.hudElementList[i].scaleX * this.hudElementList[i].width, 0);
			i++;
		}
		i = 0;
		while (i < this.hudList.length) {
			tmp_ctx.transform(1, 0, 0, 1, margin, 0);
			tmp_ctx.save();
			tmp_ctx.transform(1, 0, 0, 1, 0, (this.height - (this.hudList[i].height * this.hudList[i].scaleY)) / 2);
			tmp_ctx.transform(this.hudList[i].scaleX, 0, 0, this.hudList[i].scaleY, 0, 0);
			tmp_ctx.transform(1, 0, 0, 1, this.hudList[i].x_centerPoint, this.hudList[i].y_centerPoint);
			tmp_ctx.transform(Math.cos(this.hudList[i].rotation), -Math.sin(this.hudList[i].rotation),
			                  Math.sin(this.hudList[i].rotation), Math.cos(this.hudList[i].rotation), 0, 0);
			tmp_ctx.transform(1, 0, 0, 1, -this.hudList[i].x_centerPoint, -this.hudList[i].y_centerPoint);
			this.hudList[i].draw(tmp_ctx);
			tmp_ctx.restore();
			tmp_ctx.transform(1, 0, 0, 1, this.hudList[i].scaleX * this.hudList[i].width, 0);
			i++;
		}
		tmp_ctx.restore();
	};

	/**
	 This method allow you to push an HUD object into the current HUD object

	 @method pushHUD
	 @param {HUD} HUDObject The HUD object to push in the current HUD object
	 @return {Boolean} return true if the pushHUD method has success, otherwise it returns false
	 */
	HUDHorizontal.prototype.pushHUD = function(HUDObject) {
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
	HUDHorizontal.prototype.popHUD = function(HUDObject) {
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
	HUDHorizontal.prototype.pushHUDElement = function(HUDElementObject) {
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
	HUDHorizontal.prototype.popHUDElement = function(HUDElementObject) {
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

	HUDHorizontal.prototype.constructor = HUDHorizontal;
	return HUDHorizontal;
}();