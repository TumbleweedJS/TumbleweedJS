//	CLASS: GAMELOOP
	var GameLoop = function () {
		//variables
		var fps = 3;
		var tab = [];
		var context;


		//methodes de boucle de jeu
		function Run() {
			setInterval(function() {
				Update();
				Draw();
			}, 1000 / fps);
		};


		//methode de mise a jour
		function Update() {
			for (var i = 0; i < tab.length; i++) {
				if (typeof(tab[i].update) == 'function')
				 tab[i].update();
			}
		};

		//methode d'affichage
		function Draw() {
			for (var i = 0; i < tab.length; i++) {
			    if (typeof(tab[i].draw) == 'function')
				 tab[i].draw(context);
			}
		};
		
		//methode d'ajout d'un objet
		function AddObject(obj) {
			tab.push(obj);
		};
		
		//methode permettant de configurer le context
		function SetContext(ctx){
		 context = ctx;
		};
		
		return function () {
			this.Run = Run;
			this.AddObject = AddObject;
			this.SetContext = SetContext;
		}
		
	}();