module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            build: {
                cwd: 'src',
                src: ['**', '!**/*.styl'],
                dest: 'build',
                expand: true
            },
        },

        clean: {
            build: {
                src: ['build/**/*']
            },
            stylesheets: {
                src: ['build/**/*.css', 'build/**/*.styl', '!build/style.css']
            },
            scripts: {
                src: ['build/js/user/**/*.js']
            },
        },

        cleanempty: {
            options: {},
            src: ['build/**/*'],
        },

        stylus: {
            build: {
                options: {
                    linenos: false,
                    compress: true
                },
                files: {
                    'build/style.css': 'src/css/main.styl'
                }
            }
        },

        uglify: {
            build: {
                options: [{
                    mangle: false
                }],
                files: [{
                    expand: true,
                    cwd: 'src/js/vendor',
                    src: ['**/*.js'],
                    dest: 'build/js/vendor'
                }, {
                    'build/script.js': ['src/js/user/**/*.js']

                }]

            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build'
                }]
            }
        },

        watch: {
            stylesheets: {
                files: 'src/**/*.styl',
                tasks: ['stylesheets']
            },
            scripts: {
                files: 'src/**/*.js',
                tasks: ['scripts']
            },
            images: {
                files: 'src/**/*.{png,jpg,gif}',
                tasks: ['newer:imagemin']
            },
            copy: {
                files: ['src/**', '!src/**/*.{js,styl,png,jpg,gif}'],
                tasks: ['newer:copy']
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'build'
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cleanempty');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask(
        'stylesheets',
        'Compiles the stylesheets.', ['clean:stylesheets', 'stylus']
    );

    grunt.registerTask(
        'scripts',
        'Compiles the JavaScript files.', ['uglify', 'clean:scripts']
    );

    grunt.registerTask(
        'build',
        'Compiles all of the assets and copies the files to the build directory.', ['clean:build', 'newer:copy', 'stylesheets', 'scripts', 'newer:imagemin', 'cleanempty']
    );

    grunt.registerTask(
        'default',
        'Watches the project for changes, automatically builds them and runs a server.', ['connect','build', 'watch']
    );
};
