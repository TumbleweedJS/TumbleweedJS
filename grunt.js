/*global module:false*/
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
                quotmark: "double",
                indent: 2,
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
            dir:	'build',
            baseUrl: 'modules',
            paths: { 'TW': '.' },

            skipModuleInsertion: true,
            removeCombined: true,

            //optimize: 'none',
            modules: [
                {
                    name: 'TW',
                    include: [
                        'TW/collision',
                        'TW/event',
                        'TW/gameloop',
                        'TW/graphic',
                        'TW/math',
                        'TW/preload',
                        'TW/sound',
                        'TW/utils'
                    ],
                    create: true
                },
                { name: 'collision' },
                { name: 'event' },
                { name: 'gameloop' },
                { name: 'graphic' },
                { name: 'math' },
                { name: 'preload' },
                { name: 'sound' },
                { name: 'utils' }
            ]
        }
    });

    grunt.loadNpmTasks('grunt-requirejs');
    grunt.registerTask('default', 'lint requirejs');
    //grunt.registerTask('default', 'lint test requirejs');
};

