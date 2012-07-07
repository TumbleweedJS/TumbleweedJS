//define a basic function to demonstrate the feature of gameloop
//When an object in the gameloop array is a function, this function is automatically called.
function classicFunction() {
 //print out on the body a trace of the classicFunction call.
 document.body.innerHTML += "classic function call<br/>";
}

//define a FruitWithoutUpdate object
//it contains only a draw method
//the aim of this object is to demonstrate that the gameloop check the validity of the draw method and the update method before calling them.
//Then you can add to the Gameloop an object who contains only a draw method like FruitWithoutUpdate, and only the method draw will be called.
var FruitWithoutUpdate = function ()
{
 function FruitWithoutUpdate(name)
 {
  this.name = name;
 };
 
 FruitWithoutUpdate.prototype.draw = function()
 {
  //print out on the body a trace of the draw method call from the FruitWithoutUpdate object.
  document.body.innerHTML += "I am FruitWithoutUpdate draw<br/>";
 }
 
 return FruitWithoutUpdate;
}();


//define a FruitWithoutDraw object
//it contains only an update method
//the aim of this object is to demonstrate that the gameloop check the validity of the draw method and the update method before calling them.
//Then you can add to the Gameloop an object who contains only an update method like FruitWithoutDraw, and only the method update will be called.
var FruitWithoutDraw = function ()
{
 function FruitWithoutDraw(name)
 {
  this.name = name;
 };
 
 FruitWithoutDraw.prototype.update = function()
 {
  //print out on the body a proof that the update method from the object FruitWithoutDraw was called.
  document.body.innerHTML += "I am FruitWithoutDraw update<br/>";
 }
 
 return FruitWithoutDraw;
}();

//Defining a Fruit object who contains an update method and a draw method.
//The aim of this object is to demonstrate that the Gameloop call the update and the draw method of the object on it array if they are defined.	
var Fruit = function() 
{
    function Fruit(name) 
    {
        this.name = name;
    };

    Fruit.prototype.update = function() 
    {
		//print out on the body a proof that the update method from the object Fruit was succesfully called
		document.body.innerHTML += "I am FruitWithoutUpdate draw<br/>";
    };

    Fruit.prototype.draw = function() 
    {
		//print out on the body a proof that the draw method from the object Fruit was successfully called
		document.body.innerHTML += "I am FruitWithoutUpdate draw<br/>";
    };

    return Fruit;

}();

	 //instanciate a Fruit object
     var apple = new Fruit('apple');
	 //instanciate a FruitWithoutUpdate object
	 var apple_without_update = new FruitWithoutUpdate('fruit without update');
	 //instanciate a FruitWithoutDraw object
	 var apple_without_draw = new FruitWithoutDraw('fruit without draw');
	 //instanciate the tumbleweed framework gameloop with 1 refresh per second.
	 var gl =  new TW.Gameloop.Gameloop(1);
	 
	 //adding the apple object to the gameloop array
     gl.object.push(apple);
	 //adding the classicFunction to the gameloop array
	 gl.object.push(classicFunction);
	 //adding the apple_without_update object to the gameloop array
	 gl.object.push(apple_without_update);
	 //adding the apple_without_draw object to the gameloop array
	 gl.object.push(apple_without_draw);
	 //add to the gameloop array an anonymous object to demonstrate that it works fine.
	 gl.object.push(
					{
						//print out on the body a proof that the method update of the anonymous object was called
						update: function(){ document.body.innerHTML += "anonymous object update method called<br/>"; },
						//print out on the body a proof that the method draw of the anonymous object was called
						draw: function(){ document.body.innerHTML += "anonymous object draw method called<br/>"; }
					}
					);
	//start the tumbleweed gameloop
     gl.start();