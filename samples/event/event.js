/**
 * Created with JetBrains WebStorm.
 * User: Olousouzian
 * Date: 6/11/12
 * Time: 10:06 AM
 * To change this template use File | Settings | File Templates.
 */

window.onload = function ()
{
    //Gameloop constructor
    var GameLoop = function ()
    {
        //variable who stores the frames per seconds
        var fps = 2;
		//array who contains the objects on which will be called the method draw and update.
        var tab = [];
		//get the canvas' context
        var context = document.getElementById("eventCanvas").getContext("2d");

        var test = false;
        var test2 = 'text';
		//create a mapping of key with functions
        var events = new TW.Event.InputShortcut();

		//map the association of key T and U on a function.
        var id = events.add([TW.Event.Key.T, TW.Event.Key.U],
            function() {
                test2 = 'Callback succesfully called';
        });

        //initialize the events services
        function Initialize()
        {
           TW.Event.KeyboardService.initialize();
           TW.Event.MouseService.initialize();
        };

        //setup a callback to update the application
        function Run()
        {
            setInterval(function()
            {
                Update();
                Draw();
            }, 1000 / this.fps);
        };


        //update method
        function Update()
        {
		//the `events.update()` function calls the function associated with the key which are pressed
            events.update();
            if(TW.Event.KeyboardService.isKeyDown(TW.Event.Key.A))
            {
               this.test = true;
            }
            else
                this.test = false;

            if (TW.Event.KeyboardService.isKeyPressed(TW.Event.Key.Space))
            {
               alert("KEY PRESSED");
                events.delete(id);
            }

        };


        //method draw
        function Draw()
        {
		//clean the canvas
            context.clearRect(0, 0, 300, 300);
		//if test is true, then we print out on the canvas `"KEY DOWN !"`, otherwise, we print out `"KEY UP !"`
            if (this.test == true)
                context.fillText("KEY DOWN !", 10, 10);
            else
                context.fillText("KEY UP !", 10, 10);
		//Display some informations about the input services.
		//Display all the keys down
            context.fillText("KeyDown : " + TW.Event.KeyboardService.keyDown, 10, 30);
		//Display the mouse left state
            context.fillText("mouseDown : " + TW.Event.MouseService.isMouseButtonDown(TW.Event.MouseKey.Left) , 10, 40);
		//Display the mouse click state
            context.fillText("Click : " + TW.Event.MouseService.isClick(), 10, 50);
		//Display the position of the mouse
            context.fillText("Mouse Position : " + TW.Event.MouseService.getMousePosition()['x'] + "-" + TW.Event.MouseService.getMousePosition()['y'], 10, 60);
		//Display a message who proof that the callback has been succesfully called.
            context.fillText("Callback : " + test2, 10, 70);
		//Reset the message who may have been setted by the callbacks.
            test2 = '';
        };
		//Return a function who contains the methods Initialize and Run
        return function ()
        {
            this.Initialize = Initialize;
            this.Run = Run;
        }
    }();

	//We instanciate a Gameloop object.
    var gl = new GameLoop();
	//We call the Initialize function within it.
    gl.Initialize();
	//We call the Run function within it.
    gl.Run();
}