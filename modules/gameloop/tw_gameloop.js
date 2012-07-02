/**
 * Created with JetBrains WebStorm.
 * User: Aymeric CHAUVIN
 * Date: 26/06/12
 * Time: 18:00
 */


window.onload = function ()
{

    //	CLASS: GAMELOOP
    var GameLoop = function (_fps) //usage (30)
    {
        //variables
        var fps = _fps;
        var updateFunc = this.Update;
        var drawFunc = this.Draw;

        //methode d'initialisation
        function Initialize(_updateFunc, _drawFunc)
        {
            //on set les callback

            if (typeof(_updateFunc) != 'undefined' && typeof(_drawFunc) != 'undefined')
            {
                this.updateFunc = _updateFunc;
                this.drawFunc = _drawFunc;
            }
        }


        //methodes de boucle de jeu
        function Run()
        {
            setInterval(function()
            {
                this.updateFunc();
                this.drawFunc();
            }, 1000 / this.fps);
        }


        //methode de mise a jour
        function Update()
        {

        }


        //methode d'affichage
        function Draw()
        {

        }


        return function ()
        {
            this.Initialize = Initialize;
            this.Run = Run;
        }

    }();

    function testUp() //fonction update callback
    {

    }

    function testDraw() //fonction draw callback
    {

    }



    var gl = new GameLoop(20);
    gl.Initialize(testUp, testDraw); //passer les pointeurs sur fonctions desires
    gl.Run();
};