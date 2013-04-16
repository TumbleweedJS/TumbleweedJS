
# Tumbleweed.js

Tumbleweed.js is a Javascript game framework using the lastest HTML5 features,
destined to make interactive browser-based games.
its architecture is divided into modules, so you can easily use only a part of the framework.

Each Tumbleweed class is an AMD module, so you can directly load classes you need.
With an AMD optimizer like [r.js](http://requirejs.org/docs/optimization.html), you can generate a really optimized file, throwing away all parts you don't use.

[![Build Status](https://travis-ci.org/TumbleweedJS/TumbleweedJS.png?branch=master,dev,release-0.3)](https://travis-ci.org/TumbleweedJS/TumbleweedJS)

## More informations ?

You can visit [our website here](http://www.tumbleweed-studio.net)

[API documentation can be found here](http://api.tumbleweed-studio.net)

Want to see somes examples ? [Demo are availlable here](http://www.tumbleweed-studio.net/website/demo.php)

## Getting started

### Quick start

For a quick start, you can download the last version on [our website](http://www.tumbleweed-studio.net).
It provide a single minified file ready for use, containing all Tumbleweed.js components.

All you have to do is to add it in your HTML file, and you can start coding.
You should go to see [the demos](http://www.tumbleweed-studio.net/website/demo.php), all code are explained and result is displayed.

### Start with require.js

However, all games don't need all the features. For example, a chess game don't use the collision module.
If you want to choose only the components that you use, you can use each one separately with [require.js](http://requirejs.org).

For that, you need to clone the repository:

    git clone https://github.com/TumbleweedJS/TumbleweedJS.git myGame/scripts/TW

Now, you need to tell require.js where is the path to Tumbleweed, and you can use it:

*in your require.js config:*

```javascript
	require.config({
	  baseUrl: 'scripts',
	  paths: {
	    TW: 'TW/modules'		// this is relative to baseUrl
	  }
	});
```

*game.js*

```javascript
	// each TW class is a AMD module. 
	define(['TW/gameloop/Gameloop', 'TW/window/Window', 'TW/window/Rect'] , function(Gameloop, Window, Rect) {
	  //This function will be your entry point.
	  
	  var gl = new Gameloop();
	  var w = new Window();
	  
  	  var gl = new Gameloop();
	  var win = new Window(document.getElementsByTagName('canvas')[0]);
	  win.addChild(new Rect({
		width: 100,
		height: 100,
		mode: "FILLED",
		color: "red"
	  }));
	  
	  gl.addObject(win);
	  gl.start();

      // INSERT AWESOME GAME HERE
	});
```

The advantages of this method are that only needed files are loaded. By using build tool like `r.js`, you can generate
very small Tumbleweed file, making your games faster to load.

You're now ready to code! You should go to see [the demos](http://www.tumbleweed-studio.net/website/demo.php), all code are explained and result is displayed.

## Build TW.js

*Note: build TW.js is not required for use it. This section is mainly useful for contributing to Tumbleweed.*

Tumbleweed use mainly `grunt` and `require.js` for building concatenated file *TW.js*. So you need Node.js and `npm`.

	npm install -g grunt-cli
    npm install grunt
    npm install grunt-requirejs grunt-contrib-yuidoc grunt-contrib-jshint grunt-contrib-qunit


Grunt is a powerful command-line build system. With the grunt.js file, it provides these following commands:

- `grunt release` (or just `grunt`): generates minified files.
  Both `release` and `debug` produce a `build` folder, containing a `TW.js` file usable alone.
- `grunt debug`: generates non minified files.
- `grunt doc`: creates the documentation. All documentation use [Yuidoc](https://github.com/yui/yuidoc) syntax.
- `grunt lint`: applies jshint on all js files. it is configured for the project.
- `grunt qunit`: launches tests. There are few, but i hope fix this soon.


## Support / Contributing

A bug to report ? Want participating ? You're welcome !<br />
Feel free to report some issues, ask questions or send pull requests!

We would be happy to discuss with you, on github, by email, or [on our forum](http://forum.tumbleweed-studio.net).

## Contributors

 * [Kevin Bernard-Allies](https://github.com/BAKFR)
 * [Pierre Ruiz](https://github.com/RuizPierreC)
 * Arnaud Bonnet de Larbogne
 * Amine Aissati
 * Axel Gambert
 * [Jeremy Grenier](https://github.com/Lyc0s)
 * Aymeric Chauvin
 * Fabrice Bascoulergue
 * Fabien Olousouzian
 * Michael Guidet
