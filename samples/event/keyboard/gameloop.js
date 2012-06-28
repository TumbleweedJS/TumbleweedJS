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
        var eventManager = new EventManager();
        var test = false;

        //methode d'initialisation
        function Initialize()
        {
           //OBLIGATOIRE : permet de reset les variables
           eventManager.Initialize();

            //Ajout d'une fonction au vector de callback, retourne un ID a sauvegarder
            eventManager.addCallBack(this.TestCallBack);
        };

        function TestCallBack()
        {
            alert("TEST CALLBACK");
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
            //OBLIGATOIRE
            eventManager.Update();

            //supprime la fonction ID du vector
            eventManager.deleteCallBack(0);

            if(eventManager.isKeyDown(KeyEnum.A))
            {
               this.test = true;
            }
            else
                this.test = false;

            if (eventManager.isKeyPressed(KeyEnum.Space))
                alert("KEY PRESSED");
        };


        //methode d'affichage
        function Draw()
        {
            context.clearRect(0, 0, 300, 300);

            if (this.test == true)
                context.fillText("KEY DOWN !", 10, 10);
            else
                context.fillText("KEY UP !", 10, 10);

           context.fillText("List keyDown : " + eventManager.keyDown, 10, 20);
           context.fillText("List oldKeyDown : " + eventManager.oldKeyDown, 10, 30);

        };

        return function ()
        {
            this.Initialize = Initialize;
            this.Run = Run;
            this.TestCallBack = TestCallBack;
        }

    }();

    var gl = new GameLoop();
    gl.Initialize();
    gl.Run();
}