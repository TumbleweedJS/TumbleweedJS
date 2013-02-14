 

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        lint: {
            files: ['grunt.js', 'modules/**/*.js', 'test/**/*.js']
        },
        jshint: {
            options: {

                predef: ['define', 'TW'],

                /* variables */

                indent: 4,
                maxlen: 120,

                browser:true,       //allow to use the window object

                /*	less strict:	*/

                //debug: true,      //instruction `debugger`
                eqnull: true,       //Warning about `==` and `===` for null only.
                es5: true,          //Allow you to use EcmaScript 5 features
                multistr:true,
                smarttabs:true,     //Mixed Tabs and Spaces

                /*	more strict:	*/

                noarg: true,        //Forbidden use to argument.caller and argument.callee
                bitwise:true,
                curly:true,         //Add warning for using if without accolade
                eqeqeq:true,
                //latedef:true,
                newcap:true,
                nonew:true,
                undef:true,
                //strict:true,      //Force the strict mode in each functions
                trailing:true       //Spaces in end of lines
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
                //removeCombined: true,
                logLevel: 1,

                name: 'TW',
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
    grunt.registerTask('check-server', 'lint');


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
