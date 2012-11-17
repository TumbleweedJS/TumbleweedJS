/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '0.1.0',
            banner: '/*! TumbleweedJS - v<%= meta.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* http://tumbleweed-studio.net/\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                'YOUR_NAME; Licensed MIT */'
        },
        lint: {
            files: ['grunt.js', 'modules/**/*.js', 'test/**/*.js']
        },
        jshint: {
            options: {
                /* variables */
                quotmark: "double",
                indent: 2,
                maxlen: 120,

                browser:true,       //allow to use the window object

                /*	less strict:	*/
                //debug: true,      //instruction `debugger`
                eqnull: true,       //Warning about `==` and `===` for null only.
                es5: true,          //Allow you to use EcmaScript 5 features
                //expr: true,       //???
                //laxbreak:true,    //TODO: instructions multi-lines ?
                multistr:true,
                smarttabs:true,     //Mixed Tabs and Spaces ?

                /*	more strict:	*/

                //immed: false,     //Allow to not add parenthesis around anonymous func.
                noarg: true,        //Forbidden use to argument.caller and argument.callee
                bitwise:true,
                curly:true,         //Add warning for using if without accolade
                eqeqeq:true,
                latedef:true,
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
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'dist/tumbleweed.min.js'
            }
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


            //almond: true,

            skipModuleInsertion: true,
            removeCombined: true,

            //wrap: true,

            //optimize: 'none',
            modules: [
                {
                    name: 'TW',
                    include: [
                        'TW/collision',
                        'TW/event',
                        'TW/gameloop',
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
                { name: 'math' },
                { name: 'preload' },
                { name: 'sound' },
                { name: 'utils' }
            ]
        }
    });

    // Default task.
    //grunt.registerTask('default', 'lint test concat min');
    grunt.registerTask('default', 'lint');
    grunt.loadNpmTasks('grunt-requirejs');
};
