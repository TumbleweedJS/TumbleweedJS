
# Tumbleweed.js

Tumbleweed.js is a Javascript game framework, using last features from HTML5,
destined to make interactive browser-based games.

## Getting started

    tutorials coming soon.

## Installing Tumbleweed.js

For using Tumbleweed.js quickly, you can download the last version on [our website](www.tumbleweed-studio.net).
It provide a single minified file ready for use, containing all Tumbleweed.js components.

However, all games don't nedd all the features. For example, a chess game don't use the collision module.
If you want to choose only the components that you use, you can use each one separatly with [require.js](requirejs.org).
For that, you will need to install `grunt` and its plugin `grunt-contrib`

    npm install -g grunt
    npm install grunt-contrib

You can use theses following commands with `grunt`:

    grunt debug doc

- `release` (default) minified files
- `debug`: non minified files
- `release-with-polyfill`
- `debug-with-polyfill`
- `doc` for generating the documentation

Both `release` and `debug` produce a `build` folder, containing a `TW.js` file usable alone,
and all others Tumbleweed files, which can be used for selecting components one by one.

Builds with polyfill contains a definition of `Function.bind`
and add them on navigators which don't support it natively.

## Using Tumbleweed.js with require.js

Tumbleweed.js is 100% compatible with require.js or others AMD-compliant module loader.
From the single file `TW.js`, you can use the `TW` global variable directly:

    define[['TW'], function(TW) {

        var gl = new TW.Gameloop.Gameloop();
        //Your code here
    });

Both with the `TW.js` file alone, or using all build directory, you can use each classe like an AMD module:

    define(['TW/Gameloop/Gameloop', 'TW/graphic/Window'], function(Gameloop, Window) {
        var gl = new Gameloop();
        var w = new Window();
    });

The advantages of this method are that only needed files are loaded. By using build tool like `r.js`, you can generate
very small Tumbleweed file, making your games faster to load.


Of course, you can also choose to don't use require, and include the TW.js file directly with a '<scrip>' balise.

