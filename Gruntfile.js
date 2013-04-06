 
/*global module: false */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            options: {

				/* coding style */


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
                undef: true,

				globals: {
					TW: true,
					TW_DEBUG: false,
					define: false
				}
            },
			tumbleweed: ['grunt.js', 'modules/**/*.js'],
			test: {
				options: {
					globals: {
						TW: true,
						define: false,
						QUnit: false,
						module: false,
						test: false,
						ok: false,
						equal: false,
						deepEqual: false
					}
				},
				src: 'test/!(vendor)**/*.js'
			}
        },
        qunit: {
            files: ['test/**/*.html']
        },
        requirejs: {
            options: {
                baseUrl: 'modules',
				almond: true,
                skipModuleInsertion: true,
				include: ['TW'],

				preserveLicenseComments: true,
				wrap: {
					startFile: 'start.frag',
					endFile: 'end.frag'
				}
            },
			release: {
				options: {
					optimize: 'uglify2',
					out : 'build/TW.min.js',
					uglify2: {
						compress: {
							global_defs: {
								TW_DEBUG: false
							}
						}
					}
				}
			},
            debug: {
                options: {
					optimize: 'none',
					out: 'build/TW.js'
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

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-requirejs');

    grunt.registerTask('check-server', ['jshint', 'release', 'qunit']);
    grunt.registerTask('release', 'requirejs:release');
    grunt.registerTask('debug', 'requirejs:debug');
    grunt.registerTask('doc', 'yuidoc');
    grunt.registerTask('default', 'release');
};
