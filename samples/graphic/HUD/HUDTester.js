var HUDTester = function() {
 function HUDTester(context) {
	this.hudHorizontal = new TW.Graphic.HUDHorizontal(context, 150, 0, 650, 100);
	this.hudVertical = new TW.Graphic.HUDVertical(context, 0, 0, 140, 700);
	this.hud = new TW.Graphic.HUD(context, 150, 110, 650, 590);
	//this.view = new TW.Graphic.View(context, 0, 0, 800, 700);
	this.window = new TW.Graphic.Window(800, 700, context);
	this.window.pushHUD(this.hudHorizontal);
	this.window.pushHUD(this.hudVertical);
	this.window.pushHUD(this.hud);
	//this.window.pushView(this.view);
	this.img = new Image();
	this.img.src = "../images/caisse_cassable.png";
	this.img_rect = new TW.Graphic.ImageRect(this.img, 0, 0, 64, 64);
	this.context = context;
 }
 
 HUDTester.prototype.getKeyDown = function(event) {
 if (!event)
  return;
  if (event.keyCode == 65)
   {
    this.addElementToHUDHorizontal();
   }
  if (event.keyCode == 83)
  {
   this.subElementFromHUDHorizontal();
  }
  if (event.keyCode == 90)
  {
   this.addElementToHUDVertical();
  }
  if (event.keyCode == 88)
  {
   this.subElementFromHUDVertical();
  }
  if (event.keyCode == 80)
  {
   this.subElementFromHUD();
  }
  this.draw(this.context);
 };
 
 HUDTester.prototype.getXCenter = function() {
  if (document.getElementById("HUD_x_center").value == "")
   return 0;
  return parseInt(document.getElementById("HUD_x_center").value);
 };

 HUDTester.prototype.getYCenter = function() {
  if (document.getElementById("HUD_y_center").value == "")
   return 0;
  return parseInt(document.getElementById("HUD_y_center").value);
 };
 
  HUDTester.prototype.getX = function() {
   if (document.getElementById("HUD_x").value == "")
	return null;
 return parseInt(document.getElementById("HUD_x").value);
 };
 
  HUDTester.prototype.getY = function() {
   if (document.getElementById("HUD_y").value == "")
	return 0;
 return parseInt(document.getElementById("HUD_y").value);
 };
 
 HUDTester.prototype.getLeft = function() {
 if (document.getElementById("HUD_left").value == "")
	return null;
 return parseInt(document.getElementById("HUD_left").value);
 };

 HUDTester.prototype.getTop = function() {
  if (document.getElementById("HUD_top").value == "")
	return null;
 return parseInt(document.getElementById("HUD_top").value);
 }; 
 
  HUDTester.prototype.getBottom = function() {
   if (document.getElementById("HUD_bottom").value == "")
	return null;
 return parseInt(document.getElementById("HUD_bottom").value);
 };
 
  HUDTester.prototype.getRight = function() {
   if (document.getElementById("HUD_right").value == "")
	return null;
 return parseInt(document.getElementById("HUD_right").value);
 };
 
  HUDTester.prototype.getScaleX = function() {
   if (document.getElementById("HUD_scale").value == "")
	return 1;
 return parseFloat(document.getElementById("HUD_scale").value);
 };
 
   HUDTester.prototype.getScaleY = function() {
    if (document.getElementById("HUD_scale").value == "")
		return 1;
 return parseFloat(document.getElementById("HUD_scale").value);
 };
 
   HUDTester.prototype.getAngle = function() {
    if (document.getElementById("HUD_angle").value == "")
		return 0;
 return parseInt(document.getElementById("HUD_angle").value);
 };
 
   HUDTester.prototype.getPosition = function() {
    if (document.getElementById("HUD_position").value == "")
		return "absolute";
 return document.getElementById("HUD_position").value;
 };
 
 HUDTester.prototype.addElementToHUDHorizontal = function() {
 //fonction pour ajouter un element dans le hud horizontal
var left;
var right;
var bottom;
var top;
var x;
var y;
var scaleX;
var scaleY;
var position;
var angle;
var x_center;
var y_center;

left = this.getLeft();
right = this.getRight();
bottom = this.getBottom();
top = this.getTop();
x = this.getX();
y = this.getY();
scaleX = this.getScaleX();
scaleY = this.getScaleY();
angle = this.getAngle();
position = this.getPosition();
x_center = this.getXCenter();
y_center = this.getYCenter();
 
  var _hudElement = new TW.Graphic.HUDElement(0, 0, 64, 64, this.img_rect);
  _hudElement.setScale(scaleX, scaleY);
  _hudElement.left = left;
  _hudElement.right = right;
  _hudElement.bottom = bottom;
  _hudElement.top = top;
  _hudElement.x = x;
  _hudElement.y = y;
  _hudElement.position = position;
  _hudElement.setAngle(angle);
  _hudElement.setCenterPoint(x_center, y_center);
  this.hudHorizontal.pushHUDElement(_hudElement);
 };

 HUDTester.prototype.addElementToHUDVertical = function() {
 //fonction pour ajouter un element dans le hud vertical
  var left;
var right;
var bottom;
var top;
var x;
var y;
var scaleX;
var scaleY;
var position;
var angle;
var x_center;
var y_center;

left = this.getLeft();
right = this.getRight();
bottom = this.getBottom();
top = this.getTop();
x = this.getX();
y = this.getY();
scaleX = this.getScaleX();
scaleY = this.getScaleY();
angle = this.getAngle();
position = this.getPosition();
x_center = this.getXCenter();
y_center = this.getYCenter(); 
 
 var _hudElement = new TW.Graphic.HUDElement(0, 0, 64, 64, this.img_rect);
   _hudElement.setScale(scaleX, scaleY);
  _hudElement.left = left;
  _hudElement.right = right;
  _hudElement.bottom = bottom;
  _hudElement.top = top;
  _hudElement.x = x;
  _hudElement.y = y;
  _hudElement.position = position;
  _hudElement.setAngle(angle);
  _hudElement.setCenterPoint(x_center, y_center);
 this.hudVertical.pushHUDElement(_hudElement);
 };

 HUDTester.prototype.subElementFromHUDHorizontal = function() {
 //fonction pour enlever un element du hud horizontal
 var tmp = this.hudHorizontal.hudElementList.length - 1;
 if (tmp < 0)
  tmp = 0;
 this.hudHorizontal.popHUDElement(this.hudHorizontal.hudElementList[tmp]);
 };

 HUDTester.prototype.subElementFromHUDVertical = function() {
 //fonction pour enlever un element du hud vertical
 var tmp = this.hudVertical.hudElementList.length - 1;
 if (tmp < 0)
  tmp = 0;
 this.hudVertical.popHUDElement(this.hudVertical.hudElementList[tmp]);
 };

 HUDTester.prototype.addElementToHUD = function() {
 //fonction pour ajouter un element dans le hud
var left;
var right;
var bottom;
var top;
var x;
var y;
var scaleX;
var scaleY;
var position;
var angle;
var x_center;
var y_center;
 
 left = this.getLeft();
right = this.getRight();
bottom = this.getBottom();
top = this.getTop();
x = this.getX();
y = this.getY();
scaleX = this.getScaleX();
scaleY = this.getScaleY();
angle = this.getAngle();
position = this.getPosition();
x_center = this.getXCenter();
y_center = this.getYCenter();
 
 var _hudElement = new TW.Graphic.HUDElement(0, 0, 64, 64, this.img_rect);
   _hudElement.setScale(scaleX, scaleY);
  _hudElement.left = left;
  _hudElement.right = right;
  _hudElement.bottom = bottom;
  _hudElement.top = top;
  _hudElement.x = x;
  _hudElement.y = y;
  _hudElement.position = position;
  _hudElement.setAngle(angle);
  _hudElement.setCenterPoint(x_center, y_center);
 this.hud.pushHUDElement(_hudElement);
 this.draw(this.context);
 };

 HUDTester.prototype.subElementFromHUD = function() {
 //fonction pour enlever un element du hud
 var tmp = this.hud.hudElementList.length - 1;
 if (tmp < 0)
  tmp = 0;
 this.hud.popHUDElement(this.hud.hudElementList[tmp]);
 };

 HUDTester.prototype.draw = function(context) {
 this.window.draw(this.context);
 this.context.fillStyle = "rgb(0,0,0)";
 this.context.strokeRect(150, 0, 650, 100);
 this.context.strokeRect(0, 0, 140, 700);
 this.context.strokeRect(150, 110, 650, 590);
 }
 
 return HUDTester;
}();
