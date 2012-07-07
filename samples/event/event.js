/**
 * Created with JetBrains WebStorm.
 * User: Olousouzian
 * Date: 6/11/12
 * Time: 10:06 AM
 * To change this template use File | Settings | File Templates.
 */

window.onload = function ()
{
    //	CLASS: GAMELOOP
    var GameLoop = function ()
    {
        //variables
        var fps = 2;
        var tab = [];
        var context = document.getElementById("eventCanvas").getContext("2d");

        //Instance de l'object
        var test = false;
        var test2 = 'text';
        var events = new TW.Event.InputShortcut();


        var id = events.add([TW.Event.Key.T, TW.Event.Key.U],
            function() {
                test2 = 'connasse de callback';
        });

        //methode d'initialisation
        function Initialize()
        {
           TW.Event.KeyboardService.initialize();
           TW.Event.MouseService.initialize();
        };

        //methodes de boucle de jeu
        function Run()
        {
            setInterval(function()
            {
                Update();
                Draw();
            }, 1000 / this.fps);
        };


        //methode de mise a jour
        function Update()
        {
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


        //methode d'affichage
        function Draw()
        {
            context.clearRect(0, 0, 300, 300);

            if (this.test == true)
                context.fillText("KEY DOWN !", 10, 10);
            else
                context.fillText("KEY UP !", 10, 10);

            context.fillText("KeyDown : " + TW.Event.KeyboardService.keyDown, 10, 30);
            context.fillText("mouseDown : " + TW.Event.MouseService.isMouseButtonDown(TW.Event.MouseKey.Left) , 10, 40);
            context.fillText("Click : " + TW.Event.MouseService.isClick(), 10, 50);
            context.fillText("Mouse Position : " + TW.Event.MouseService.getMousePosition()['x'] + "-" + TW.Event.MouseService.getMousePosition()['y'], 10, 60);
            context.fillText("Callback : " + test2, 10, 70);

            test2 = '';
        };

        return function ()
        {
            this.Initialize = Initialize;
            this.Run = Run;
        }
    }();

    var gl = new GameLoop();
    gl.Initialize();
    gl.Run();
}