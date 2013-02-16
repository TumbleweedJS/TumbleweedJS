 
/*global module: false */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        lint: {
            files: ['grunt.js', 'modules/!(hud|parallax)**/*.js'],
			test: ['test/**/*.js']
        },
        jshint: {
            options: {

				/* coding style */
                indent: 4,
                maxlen: 120,
				white: false,
                multistr: true,
                smarttabs: true,	//mixed tabs and spaces
                trailing: true,		//Spaces in end of lines
                curly: true,		//Add warning for using if without accolade
                newcap: true,

				/* env */
                browser: true,		//allow to use the window object
                //debug: true,		//instruction `debugger`
                //es5: true,		//allow you to use EcmaScript 5 features
                //strict:true,		//Force the strict mode in each functions

				/* correctness */
                //eqnull: true,		//Warning about `==` and `===` for null only.
                noarg: true,        //Forbidden use to argument.caller and argument.callee
                bitwise: true,
                eqeqeq: true,
                //latedef:true,
                nonew: true,
                undef: true
            },
			globals: {
				TW: true,
				define: false
			},
			test: {
				globals: {
					TW: true,
					QUnit: false,
					module: false,
					test: false,
					ok: false,
					equal: false,
					deepEqual: false
				}
			}
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'lint qunit'
        },
        uglify: {},
        requirejs: {
            // release options (default)
            options: {
                dir:	'build',
                baseUrl: 'modules',

                skipModuleInsertion: true,
                logLevel: 1,

                name: 'TW'
            },
            debug: {
                options: { optimize: 'none' }
            },
            'release-with-polyfills': {
                options: { deps: [ 'TW/utils/Polyfills'] }
            },
            'debug-with-polyfills': {
                options: {
                    optimize: 'none',
                    deps: [ 'TW/utils/Polyfills']
                }
            }
        },
        yuidoc: {
            tumbleweed: {
                name:           "Tumbleweed.js",
                Description:    "The Tumbleweed.js API",
                version:        "0.3.0",
                url:            "http://api.tumbleweed-studio.net",
                themedir: "./theme_doc",
                options: {
                    outdir:     "./docs",
                    paths: ["./modules/"]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib');
    grunt.registerTask('check-server', 'lint qunit');

    grunt.registerTask('release', 'requirejs:options');
    grunt.registerTask('debug', 'requirejs:debug');
    grunt.registerTask('release-with-polyfills', 'requirejs:release-with-polyfills');
    grunt.registerTask('debug-with-polyfills', 'requirejs:debug-with-polyfills');
    grunt.registerTask('doc', 'yuidoc');

    grunt.registerTask('default', 'release');


    /**
     * The following options are available:
     *  - release (default)
     *  - debug
     *  - release-with-polyfill
     *  - debug-with-polyfill
     *  - doc
     *  - lint
	 *  - qunit
     */
};
