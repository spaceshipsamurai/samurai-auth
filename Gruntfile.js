// Gruntfile.js
module.exports = function(grunt) {

    grunt.initConfig({

        // JS TASKS ================================================================
        // check all js files for errors
        jshint: {
            all: ['public/src/js/**/*.js']
        },

        // take all the js files and minify them into app.min.js
        uglify: {
            options: {
                sourceMap: true
            },
            build: {
                files: {
                    'public/dist/js/app.min.js': ['public/app/ssAuth.js', 'public/app/**/*.js', 'public/js/*.js']
                }
            }
        },

        // CSS TASKS ===============================================================
        // take the processed style.css file and minify
        cssmin: {
            build: {
                files: {
                    'public/dist/css/style.min.css': 'public/dist/css/style.css'
                }
            }
        },

        // COOL TASKS ==============================================================
        // watch css and js files and process the above tasks
        watch: {
            css: {
                files: ['public/src/css/**/*.less'],
                tasks: ['less', 'cssmin']
            },
            js: {
                files: ['public/app/**/*.js'],
                tasks: ['jshint', 'uglify']
            }
        },

        // watch our node server for changes
        nodemon: {
            development: {
                script: 'server.js'
            }
        },

        // run watch and nodemon at the same time
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['jshint', 'uglify', 'concurrent']);

};